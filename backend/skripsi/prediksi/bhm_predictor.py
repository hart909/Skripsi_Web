import os
import pickle
import numpy as np
from django.conf import settings

# =========================
# 1) Load artefak model
# =========================
MODEL_PATH = os.path.join(settings.BASE_DIR, "prediksi", "bhm_nbr_model_2.pkl")
with open(MODEL_PATH, "rb") as f:
    model_data = pickle.load(f)

trace_full = model_data["trace_full"]
data = model_data["data"]
df = model_data["df"]


# Helper
def _stack(idata, name):
    arr = idata.posterior[name].values
    return arr.reshape(-1, *arr.shape[2:])

#  A. PRE-MATCH ala notebook (dipakai baseline HT)
def predict_by_id_full(home_id, away_id):
    if home_id not in data["id_to_idx"] or away_id not in data["id_to_idx"]:
        raise ValueError("Tim tidak ditemukan di model.")

    hid = data["id_to_idx"][home_id]
    aid = data["id_to_idx"][away_id]

    att  = _stack(trace_full, "attack")
    dff  = _stack(trace_full, "defense")
    hadv = _stack(trace_full, "home_adv").ravel()

    lin_home = hadv + att[:, hid] - dff[:, aid]
    lin_away =         att[:, aid] - dff[:, hid]

    muH = np.exp(lin_home).ravel()
    muA = np.exp(lin_away).ravel()

    alpha = _stack(trace_full, "alpha").ravel()
    rng   = np.random.default_rng(42)
    lamH  = rng.gamma(shape=alpha, scale=muH / alpha)
    lamA  = rng.gamma(shape=alpha, scale=muA / alpha)
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

#  B. Util “xG-only rating” & tier
def build_team_strength_from_xg(df_):
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
        # home row
        X[r, [0, 1, 2 + hi, 2 + n + ai]] = [1, 1, 1, -1]
        y[r] = xgh
        r += 1
        # away row
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


#  C. HALF-TIME (LIVE XG ONLY) – TANPA PEMBATAS 55%

def predict_by_id_ht(home_id, away_id, hthg, htag):
    """
    Versi tanpa pembatas 55–25–20.
    Probabilitas live menyesuaikan dengan selisih gol (lead).
    """
    if home_id not in data["id_to_idx"] or away_id not in data["id_to_idx"]:
        raise ValueError("Tim tidak ditemukan di model.")

    # baseline pre-match
    pre = predict_by_id_full(home_id, away_id)

    # rating & tier
    ratings, _ = build_team_strength_from_xg(df)
    gap_raw, gap_scaled, tier = quality_gap_and_tier(ratings, home_id, away_id)

    # selisih gol
    hthg = float(hthg)
    htag = float(htag)
    lead = abs(hthg - htag)

    # === live prob dinamis (tidak dibatasi) ===
    scale = 0.1 * lead             # makin besar selisih, makin yakin
    base = 0.5 + min(scale, 0.45)  # bisa naik sampai ±0.95 max

    if hthg > htag:       # home unggul
        pH_live = base
        pA_live = 1 - base
        pD_live = 1 - (pH_live + pA_live)
    elif htag > hthg:     # away unggul
        pA_live = base
        pH_live = 1 - base
        pD_live = 1 - (pH_live + pA_live)
    else:                 # imbang
        pH_live = pA_live = 0.25
        pD_live = 0.5

    # blend weight
    w_live_base = np.clip(1.0 - np.tanh(0.6 * abs(gap_scaled)), 0.1, 1.0)
    w_live = float(np.clip(w_live_base + 0.2 * lead, 0.0, 1.0))
    w_pre = 1.0 - w_live

    # blend final
    pH = w_pre * pre["p_home"] + w_live * pH_live
    pD = w_pre * pre["p_draw"] + w_live * pD_live
    pA = w_pre * pre["p_away"] + w_live * pA_live
    s = pH + pD + pA + 1e-12
    pH, pD, pA = float(pH / s), float(pD / s), float(pA / s)

    muH = float(w_pre * pre["mu_home_mean"] + w_live * (pre["mu_home_mean"] + hthg))
    muA = float(w_pre * pre["mu_away_mean"] + w_live * (pre["mu_away_mean"] + htag))

    print(f"[HT Live-XG] HT {hthg}-{htag} | lead={lead} | gap={gap_scaled:.2f} ({tier}) | "
          f"w_live={w_live:.2f} | pH={pH:.3f} pD={pD:.3f} pA={pA:.3f}")

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
