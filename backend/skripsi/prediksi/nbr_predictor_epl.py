import pickle
import os
import numpy as np

# ========================================
# LOAD MODEL
# ========================================
BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE, "nbr_epl.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

beta_home  = model["beta_home"]
beta_away  = model["beta_away"]
scaler     = model["scaler"]
ratings    = model["ratings"]
feat_cols  = model["feat_cols"]
alpha      = float(model.get("alpha", 1.0))


# ========================================
# UTIL — Kontribusi
# ========================================
def compute_contrib(x_std, beta, feat_cols):
    """
    x_std  : (1,n_features)
    beta   : intercept + coef
    """
    x_std = x_std.reshape(-1)
    coef  = beta[1:]
    intercept = beta[0]

    contrib = [{"name": "Intercept", "value": float(intercept)}]

    for name, val, b in zip(feat_cols, x_std, coef):
        contrib.append({"name": name, "value": float(val * b)})

    return contrib


# ========================================
# FULL MATCH
# ========================================
def predict_full_by_id(home_id, away_id):
    """
    Prediksi pre-match NBR EPL
    """
    hs  = ratings.get(int(home_id), 0.0)
    as_ = ratings.get(int(away_id), 0.0)
    sd  = hs - as_

    # Fitur match-day lain tidak ada → 0
    HST = 0.0
    AST = 0.0
    HS  = 0.0
    AS_ = 0.0

    # Susun fitur sesuai feat_cols
    x = np.array([
        1.0,   # HomeAdv
        sd,    # StrengthDiff
        HST,
        AST,
        HS,
        AS_,
    ], float).reshape(1, -1)

    x_std = scaler.transform(x)
    Xc = np.column_stack([np.ones(len(x_std)), x_std])

    muH = float(np.exp(Xc @ beta_home))
    muA = float(np.exp(Xc @ beta_away))

    contrib_home = compute_contrib(x_std, beta_home, feat_cols)
    contrib_away = compute_contrib(x_std, beta_away, feat_cols)

    return {
        "home_id": home_id,
        "away_id": away_id,
        "mu_home": muH,
        "mu_away": muA,
        "goal_diff": muH - muA,
        "alpha": alpha,
        "contrib_home": contrib_home,
        "contrib_away": contrib_away,
    }



# ========================================
# HALF-TIME
# ========================================
def predict_ht_by_id(home_id, away_id, hthg, htag):
    """
    Blending antara prediksi pre-match & skor HT
    hthg = gol HT tim home
    htag = gol HT tim away
    """
    pre = predict_full_by_id(home_id, away_id)

    muH_pre = pre["mu_home"]
    muA_pre = pre["mu_away"]

    contrib_home = pre["contrib_home"]
    contrib_away = pre["contrib_away"]

    lead = float(hthg) - float(htag)
    gap = abs(lead)

    # bobot dinamis — makin besar gap, makin kuat pengaruh HT
    w = min(0.60, 0.20 + 0.20 * gap)

    # kontribusi HT
    adj_home = w * (hthg - muH_pre)
    adj_away = w * (htag - muA_pre)

    contrib_home.append({"name": "HT_adjust", "value": float(adj_home)})
    contrib_away.append({"name": "HT_adjust", "value": float(adj_away)})

    # update mean goal
    muH = np.exp(np.log(muH_pre) + adj_home)
    muA = np.exp(np.log(muA_pre) + adj_away)

    return {
        "home_id": home_id,
        "away_id": away_id,

        "mu_home": float(muH),
        "mu_away": float(muA),
        "goal_diff": float(muH - muA),

        "HT_home": int(hthg),
        "HT_away": int(htag),

        "alpha": alpha,
        "contrib_home": contrib_home,
        "contrib_away": contrib_away,
    }
