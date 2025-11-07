from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#Laliga
from match.models import TeamLaliga
import numpy as np
from scipy.stats import nbinom

from .bhm_predictor import (
    predict_by_id_full as bhm_full,
    predict_by_id_ht as bhm_ht,
    _stack,
    trace_full
)
from .nbr_predictor import (
    predict_full_by_id as nbr_full,
    predict_ht_by_id as nbr_ht
)

#EPL
from match.models import TeamEPL  
from .bhm_predictor_epl import (
    predict_by_id_full as bhm_full_epl,
    predict_by_id_ht   as bhm_ht_epl,
)
from .nbr_predictor_epl import (
    predict_full_by_id as nbr_full_epl,
    predict_ht_by_id   as nbr_ht_epl,
)



# LIST EPL TEAM

class ActiveEPLTeamsView(APIView):
    def get(self, request):
        try:
            teams = TeamEPL.objects.filter(is_active=True).order_by("model_index")
            data = [
                {
                    "id": t.id,
                    "name": t.name,
                    "logo": t.logo,
                    "model_index": t.model_index,
                }
                for t in teams
            ]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# BHM — EPL FULL MATCH

class BHMFullPredictEPLView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))

            if home_id == away_id:
                return Response({"error": "Tim Home dan Away tidak boleh sama"}, status=400)

            res = bhm_full_epl(home_id, away_id)

            out = {
                "p_home": round(res["p_home"] * 100, 2),
                "p_draw": round(res["p_draw"] * 100, 2),
                "p_away": round(res["p_away"] * 100, 2),
                "mu_home_mean": round(res["mu_home_mean"], 3),
                "mu_away_mean": round(res["mu_away_mean"], 3),
            }
            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# BHM — EPL HALF TIME
class BHMHalfTimePredictEPLView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))
            hthg = float(request.data.get("HTHG"))
            htag = float(request.data.get("HTAG"))

            if home_id == away_id:
                return Response({"error": "Tim Home dan Away tidak boleh sama"}, status=400)

            res = bhm_ht_epl(home_id, away_id, hthg, htag)

            out = {
                "p_home": round(res["p_home"], 3),
                "p_draw": round(res["p_draw"], 3),
                "p_away": round(res["p_away"], 3),
                "mu_home_mean": round(res["mu_home_mean"], 3),
                "mu_away_mean": round(res["mu_away_mean"], 3),
                "w_live": round(res["w_live"], 3),
                "w_pre": round(res["w_pre"], 3),
                "gap_xg":  round(res["gap_xg"], 3),
                "gap_xg_scaled": round(res["gap_xg_scaled"], 3),
                "tier": res["tier"],
            }
            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

# ========================================================
# NBR — EPL FULL MATCH
# ========================================================
class NBREPLFullPredictView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))

            if home_id == away_id:
                return Response({"error": "Tim Home & Away tidak boleh sama"}, status=400)

            res = nbr_full_epl(home_id, away_id)

            out = {
                "mu_home": round(res.get("mu_home", 0), 3),
                "mu_away": round(res.get("mu_away", 0), 3),
                "goal_diff": round(res.get("goal_diff", 0), 3),

                "alpha": res.get("alpha"),
                "contrib_home": res.get("contrib_home", []),
                "contrib_away": res.get("contrib_away", []),
            }

            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ========================================================
# NBR — EPL HALF TIME
# ========================================================
class NBREPLHalfTimePredictView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))
            hthg = float(request.data.get("HTHG"))
            htag = float(request.data.get("HTAG"))

            if home_id == away_id:
                return Response({"error": "Tim Home & Away tidak boleh sama"}, status=400)

            res = nbr_ht_epl(home_id, away_id, hthg, htag)

            out = {
                "mu_home": round(res.get("mu_home", 0), 3),
                "mu_away": round(res.get("mu_away", 0), 3),
                "goal_diff": round(res.get("goal_diff", 0), 3),

                "HT_home": res.get("HT_home"),
                "HT_away": res.get("HT_away"),

                "alpha": res.get("alpha"),
                "contrib_home": res.get("contrib_home", []),
                "contrib_away": res.get("contrib_away", []),
            }

            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# LIST LALIGA TEAM

class ActiveLaligaTeamsView(APIView):
    def get(self, request):
        try:
            teams = TeamLaliga.objects.filter(is_active=True).order_by("model_index")

            data = [
                {
                    "id": t.id,
                    "name": t.name,
                    "logo": t.logo,
                    "model_index": t.model_index,
                }
                for t in teams
            ]

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================================================
# BHM — FULL MATCH
# ========================================================
class BHMFullPredictView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))

            if home_id == away_id:
                return Response({"error": "Tim Home dan Away tidak boleh sama"}, status=400)

            res = bhm_full(home_id, away_id)

            out = {
                "p_home": round(res["p_home"] * 100, 2),
                "p_draw": round(res["p_draw"] * 100, 2),
                "p_away": round(res["p_away"] * 100, 2),
                "mu_home_mean": round(res["mu_home_mean"], 3),
                "mu_away_mean": round(res["mu_away_mean"], 3),
            }
            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ========================================================
# BHM — HALF TIME
# ========================================================
class BHMHalfTimePredictView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))
            hthg = float(request.data.get("HTHG"))
            htag = float(request.data.get("HTAG"))

            if home_id == away_id:
                return Response({"error": "Tim Home dan Away tidak boleh sama"}, status=400)

            res = bhm_ht(home_id, away_id, hthg, htag)

            out = {
                "p_home": round(res["p_home"], 2),
                "p_draw": round(res["p_draw"], 2),
                "p_away": round(res["p_away"], 2),
                "mu_home_mean": round(res["mu_home_mean"], 3),
                "mu_away_mean": round(res["mu_away_mean"], 3),
            }
            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ========================================================
# BHM — EXPLAIN
# ========================================================
class BHMExplainView(APIView):
    def get(self, request):
        try:
            home_id = int(request.GET.get("home_id"))
            away_id = int(request.GET.get("away_id"))

            res = bhm_full(home_id, away_id)
            muH = float(res["mu_home_mean"])
            muA = float(res["mu_away_mean"])

            alpha = float(np.median(_stack(trace_full, "alpha")))
            if alpha <= 0 or np.isnan(alpha):
                alpha = 1.0

            max_goals = 6
            probs_home, probs_away = [], []

            for i in range(max_goals + 1):
                ph = nbinom.pmf(i, n=alpha, p=alpha/(alpha+muH)) * 100
                probs_home.append({"score": i, "prob": round(ph, 2)})

            for j in range(max_goals + 1):
                pa = nbinom.pmf(j, n=alpha, p=alpha/(alpha+muA)) * 100
                probs_away.append({"score": j, "prob": round(pa, 2)})

            joint_matrix = np.outer(
                [p["prob"] for p in probs_home],
                [p["prob"] for p in probs_away],
            ).round(2).tolist()

            return Response({
                "mu_home_mean": muH,
                "mu_away_mean": muA,
                "alpha": alpha,
                "home_scores": probs_home,
                "away_scores": probs_away,
                "joint_matrix": joint_matrix,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ========================================================
# NBR — FULL MATCH
# ========================================================
class NBRFullPredictView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))

            if home_id == away_id:
                return Response({"error": "Tim Home & Away tidak boleh sama"}, status=400)

            res = nbr_full(home_id, away_id)

            out = {
                "mu_home": round(res.get("mu_home", 0), 3),
                "mu_away": round(res.get("mu_away", 0), 3),
                "goal_diff_pred": round(res.get("goal_diff", 0), 3),

                # tambahan
                "alpha": round(res.get("alpha")),
                "contrib_home": res.get("contrib_home", []),
                "contrib_away": res.get("contrib_away", []),
            }
            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)



# ========================================================
# NBR — HALF TIME
# ========================================================
class NBRHalfTimePredictView(APIView):
    def post(self, request):
        try:
            home_id = int(request.data.get("home_id"))
            away_id = int(request.data.get("away_id"))
            hthg = float(request.data.get("HTHG"))
            htag = float(request.data.get("HTAG"))

            if home_id == away_id:
                return Response({"error": "Tim Home & Away tidak boleh sama"}, status=400)

            res = nbr_ht(home_id, away_id, hthg, htag)

            out = {
                "mu_home": round(res["mu_home"], 3),
                "mu_away": round(res["mu_away"], 3),
                "goal_diff_pred": round(res["goal_diff"], 3),
                "HT_home": res["HT_home"],
                "HT_away": res["HT_away"],
                "alpha": res.get("alpha"),
                "contrib_home": res.get("contrib_home", []),
                "contrib_away": res.get("contrib_away", []),
            }

            return Response(out, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)