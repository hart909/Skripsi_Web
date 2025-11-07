import pickle
import os
import numpy as np

BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE, "nbr_model.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

beta_home  = model["beta_home"]
beta_away  = model["beta_away"]
alpha_home = model.get("alpha_home", 1.0)
alpha_away = model.get("alpha_away", 1.0)
scaler     = model["scaler"]
ratings    = model["ratings"]
feat_cols  = model["feat_cols"]   # contoh: ['hs','as','sd']


# =========================
# UTIL — kontribusi fitur
# =========================
def compute_contrib(x_std, beta, feat_cols):
    """
    x_std : array shape (1,n_features)
    beta  : array shape (n_features+1,)  # intercept + coef
    """
    x_std = x_std.reshape(-1)
    coef  = beta[1:]   # tanpa intercept
    intercept = beta[0]

    contrib = [{"name": "Intercept", "value": float(intercept)}]

    for name, val, b in zip(feat_cols, x_std, coef):
        contrib.append({
            "name": name,
            "value": float(val * b)
        })

    return contrib


# =========================
# PREDIKSI FULL
# =========================
def predict_full_by_id(home_id, away_id):
    """
    Prediksi pre-match
    """
    hs  = ratings.get(int(home_id), 0.0)
    as_ = ratings.get(int(away_id), 0.0)
    sd  = hs - as_

    x = np.array([hs, as_, sd], float).reshape(1, -1)
    x_std = scaler.transform(x)
    x_c   = np.column_stack([np.ones(len(x_std)), x_std])

    mu_h = float(np.exp(x_c @ beta_home))
    mu_a = float(np.exp(x_c @ beta_away))

    contrib_home = compute_contrib(x_std, beta_home, feat_cols)
    contrib_away = compute_contrib(x_std, beta_away, feat_cols)

    return {
        "home_id": home_id,
        "away_id": away_id,
        "mu_home": mu_h,
        "mu_away": mu_a,
        "goal_diff": mu_h - mu_a,
        "alpha_home": float(alpha_home),
        "alpha_away": float(alpha_away),
        "alpha": float((alpha_home + alpha_away)/2),
        "contrib_home": contrib_home,
        "contrib_away": contrib_away,
    }


# =========================
# PREDIKSI HALF TIME
# =========================
def predict_ht_by_id(home_id, away_id, hthg, htag):
    pre = predict_full_by_id(home_id, away_id)

    muH_pre = pre["mu_home"]
    muA_pre = pre["mu_away"]

    contrib_home = pre.get("contrib_home", [])
    contrib_away = pre.get("contrib_away", [])
    alpha = pre.get("alpha", 1.0)

    gap = abs(hthg - htag)
    w = min(0.75, 0.25 + 0.25 * gap)

    # HT contribution: (observed - predicted) * weight
    ht_adj_home = w * (hthg - muH_pre)
    ht_adj_away = w * (htag - muA_pre)

    # tambahkan kontribusi HT
    contrib_home.append({
        "name": "HalfTimeAdj",
        "value": float(ht_adj_home),
    })

    contrib_away.append({
        "name": "HalfTimeAdj",
        "value": float(ht_adj_away),
    })

    # final n
    n_home = np.log(muH_pre) + ht_adj_home
    n_away = np.log(muA_pre) + ht_adj_away

    muH_final = np.exp(n_home)
    muA_final = np.exp(n_away)

    return {
        "home_id": home_id,
        "away_id": away_id,

        "mu_home": float(muH_final),
        "mu_away": float(muA_final),
        "goal_diff": float(muH_final - muA_final),

        "HT_home": int(hthg),
        "HT_away": int(htag),

        "alpha": alpha,
        "contrib_home": contrib_home,
        "contrib_away": contrib_away,
    }
