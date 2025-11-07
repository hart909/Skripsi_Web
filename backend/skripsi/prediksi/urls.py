from django.urls import path
from .views import (
    ActiveLaligaTeamsView, BHMExplainView,
    BHMFullPredictView, BHMHalfTimePredictView,
    NBRFullPredictView, NBRHalfTimePredictView,

    # === EPL ===
    ActiveEPLTeamsView,
    BHMFullPredictEPLView, BHMHalfTimePredictEPLView,
    NBREPLFullPredictView, NBREPLHalfTimePredictView,
)

urlpatterns = [
    # === LaLiga (sudah ada) ===
    path('bhm/', BHMFullPredictView.as_view(), name='bhm-predict'),
    path('bhm-ht/', BHMHalfTimePredictView.as_view(), name='bhm-ht-predict'),
    path('teams/laliga/', ActiveLaligaTeamsView.as_view(), name='active-laliga-teams'),
    path('bhm/explain/', BHMExplainView.as_view(), name='bhm_explain'),
    path('nbr/', NBRFullPredictView.as_view(), name="nbr_full"),
    path('nbr-ht/', NBRHalfTimePredictView.as_view(), name="nbr_ht"),

    path('bhm/epl/', BHMFullPredictEPLView.as_view(), name='bhm-predict-epl'),
    path('bhm/epl-ht/', BHMHalfTimePredictEPLView.as_view(), name='bhm-ht-predict-epl'),
    path('nbr/epl/', NBREPLFullPredictView.as_view(), name='nbr_full_epl'),
    path('nbr/epl-ht/', NBREPLHalfTimePredictView.as_view(), name='nbr_ht_epl'),
    path('teams/premier/', ActiveEPLTeamsView.as_view(), name='active-epl-teams'),
]
