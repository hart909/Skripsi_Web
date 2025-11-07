


import os
import pickle
import numpy as np
from django.conf import settings

# =========================
# 1) Load artefak model
# =========================
MODEL_PATH = os.path.join(settings.BASE_DIR, "prediksi", "bhm_epl.pkl")

with open(MODEL_PATH, "rb") as f:
    model_data = pickle.load(f)

trace_full = model_data["trace_full"]
data       = model_data["data"]
df         = model_data.get("df", None)

# =========================
# Helper
# =========================
def _stack(idata, name):
    """Flatten posterior array (chain, draw, …) -> (samples, …)"""
    arr = idata.posterior[name].values
    return arr.reshape(-1, *arr.shape[2:])



#  A. PRE-MATCH

def predict_by_id_full(home_id, away_id):
    """
    Prediksi pre-match:
    return: {p_home, p_draw, p_away, mu_home_mean, mu_away_mean}
    """
    if home_id not in data["id_to_idx"] or away_id not in data["id_to_idx"]:
        raise ValueError("Tim tidak dikenal model.")

    hid = data["id_to_idx"][home_id]
    aid = data["id_to_idx"][away_id]

    att  = _stack(trace_full, "attack")      # (S, team)
    dff  = _stack(trace_full, "defense")
    hadv = _stack(trace_full, "home_adv").ravel()

    # Linear predictor
    lin_home = hadv + att[:, hid] - dff[:, aid]
    lin_away =        att[:, aid] - dff[:, hid]

    muH = np.exp(lin_home).ravel()
    muA = np.exp(lin_away).ravel()

    # Ambil alpha
    if "alpha_home" in trace_full.posterior and "alpha_away" in trace_full.posterior:
        aH = _stack(trace_full, "alpha_home").ravel()
        aA = _stack(trace_full, "alpha_away").ravel()
    else:
        a = _stack(trace_full, "alpha").ravel()
        aH = aA = a

    rng = np.random.default_rng(42)

    # Negative Binomial sampling
    lamH = rng.gamma(shape=aH, scale=muH / aH)
    lamA = rng.gamma(shape=aA, scale=muA / aA)

    yH    = rng.poisson(lamH)
    yA    = rng.poisson(lamA)

    return {
        "home_id": home_id,
        "away_id": away_id,
        "p_home": float((yH > yA).mean()),
        "p_draw": float((yH == yA).mean()),
        "p_away": float((yH < yA).mean()),
        "mu_home_mean": float(muH.mean()),
        "mu_away_mean": float(muA.mean()),
    }


#  B. RATING & TIER
def build_team_strength_from_xg(df_):
    """
    Rating berbasis SOT (HST/AST).
    Ini sama seperti versi LaLiga – supaya seragam.
    """
    if "HST" not in df_ or "AST" not in df_:
        raise ValueError("Butuh kolom HST dan AST.")

    df_ = df_.copy()
    df_["xg_home"], df_["xg_away"] = df_["HST"], df_["AST"]
    hids, aids = df_["HomeID"], df_["AwayID"]
    teams = np.unique(np.concatenate([hids, aids]))
    n = len(teams)
    id2idx = {tid: i for i, tid in enumerate(teams)}

    m = len(df_) * 2
    p = 2 + 2 * n
    X = np.zeros((m, p))
    y = np.zeros(m)

    r = 0
    for _, row in df_.iterrows():
        hi = id2idx[row["HomeID"]]
        ai = id2idx[row["AwayID"]]
        xgh = row["xg_home"]
        xga = row["xg_away"]

        X[r, [0, 1, 2 + hi, 2 + n + ai]] = [1, 1, 1, -1]
        y[r] = xgh
        r += 1

        X[r, [0, 2 + ai, 2 + n + hi]] = [1, 1, -1]
        y[r] = xga
        r += 1

    lam = 1e-3
    A = X.T @ X + lam * np.eye(p)
    b = X.T @ y
    coef = np.linalg.solve(A, b)

    att = coef[2:2 + n]
    dff = coef[2 + n:]
    idx2id = {i: t for t, i in id2idx.items()}

    ratings = {idx2id[i]: float(att[i] - dff[i]) for i in range(n)}
    return ratings, None


def quality_gap_and_tier(ratings, home_id, away_id):
    gap = ratings.get(home_id, 0.0) - ratings.get(away_id, 0.0)
    vals = np.array(list(ratings.values()))
    med  = np.median(vals)
    mad  = np.median(np.abs(vals - med)) + 1e-9
    gap_scaled = gap / (1.4826 * mad)

    g = abs(gap_scaled)
    if g >= 1.2:
        tier = "big_vs_small"
    elif g >= 0.6:
        tier = "big_vs_mid"
    elif g >= 0.25:
        tier = "mid_vs_small"
    else:
        tier = "balanced"
    return gap, gap_scaled, tier


#  C. HALF-TIME (blending)
def predict_by_id_ht(home_id, away_id, hthg, htag):
    """
    Prediksi half-time — memanfaatkan pre-match BHM + informasi skor HT.
    Tidak ada trace_ht, karena HT bukan model PyMC terpisah.
    """
    if home_id not in data["id_to_idx"] or away_id not in data["id_to_idx"]:
        raise ValueError("Tim tidak ditemukan.")

    pre = predict_by_id_full(home_id, away_id)

    ratings, _ = build_team_strength_from_xg(df)
    gap_raw, gap_scaled, tier = quality_gap_and_tier(ratings, home_id, away_id)

    hthg = float(hthg)
    htag = float(htag)
    lead = abs(hthg - htag)

    # Probabilitas live dasar sederhana
    if hthg > htag:
        pH_live, pA_live = 0.6, 0.2
        pD_live = 0.2
    elif htag > hthg:
        pH_live, pA_live = 0.2, 0.6
        pD_live = 0.2
    else:
        pH_live = pA_live = 0.3
        pD_live = 0.4

    # cara campur
    w_live_base = float(np.clip(1.0 - np.tanh(0.6 * abs(gap_scaled)), 0.1, 1.0))
    w_live = float(np.clip(w_live_base + 0.2 * lead, 0.0, 1.0))
    w_pre  = 1.0 - w_live

    pH = w_pre * pre["p_home"] + w_live * pH_live
    pD = w_pre * pre["p_draw"] + w_live * pD_live
    pA = w_pre * pre["p_away"] + w_live * pA_live
    s = pH + pD + pA + 1e-12
    pH, pD, pA = float(pH / s), float(pD / s), float(pA / s)

    muH = float(w_pre * pre["mu_home_mean"] + w_live * (pre["mu_home_mean"] + hthg))
    muA = float(w_pre * pre["mu_away_mean"] + w_live * (pre["mu_away_mean"] + htag))

    print(
        f"[HT EPL] {hthg}-{htag} lead={lead} gap={gap_scaled:.2f} ({tier}) "
        f"w_live={w_live:.2f} -> pH={(pH):.3f} pD={(pD):.3f} pA={(pA):.3f}"
    )

    return {
        "home_id": home_id,
        "away_id": away_id,
        "p_home": pH,
        "p_draw": pD,
        "p_away": pA,
        "mu_home_mean": muH,
        "mu_away_mean": muA,
        "gap_xg": float(gap_raw),
        "gap_xg_scaled": float(gap_scaled),
        "tier": tier,
        "w_live": w_live,
        "w_pre": w_pre,
    }
