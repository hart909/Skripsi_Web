# match/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/laliga/last6/', views.LastSixMatchesView.as_view(), name='laliga-last6'),
    path("api/epl/last6/", views.LastSixMatchesEPLView.as_view(), name="epl-last6"),
    path('api/laliga/table/', views.LaligaTableView.as_view(), name='laliga-table'),
    path('api/epl/table/', views.EplTableView.as_view(), name='epl-table'),
    path('api/<str:league_code>/team-stats/<int:team_id>/', views.TeamStatsView.as_view(), name='team-stats'),
]
