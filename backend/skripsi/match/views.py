# match/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from match.models import MatchEPL2025, MatchLaliga2025, TeamLaliga,TeamEPL
from django.db.models import Q

class LastSixMatchesView(APIView):
    def get(self, request):
        matches = (
            MatchLaliga2025.objects
            .select_related('home', 'away')   # JOIN ke tabel tim
            .order_by('-id')[:6]
        )

        data = []
        for m in matches:
            data.append({
                "date": m.date,
                "home": m.home.name,
                "away": m.away.name,
                "homeScore": m.fthg,
                "awayScore": m.ftag,
                "homeLogo": m.home.logo,   
                "awayLogo": m.away.logo, 
            })

        return Response(data)
    
class LastSixMatchesEPLView(APIView):
    def get(self, request):
        matches = (
            MatchEPL2025.objects
            .select_related('home', 'away')   # JOIN ke tabel tim
            .order_by('-id')[:6]
        )

        data = []
        for m in matches:
            data.append({
                "date": m.date,
                "home": m.home.name,
                "away": m.away.name,
                "homeScore": m.fthg,
                "awayScore": m.ftag,
                "homeLogo": m.home.logo,   
                "awayLogo": m.away.logo, 
            })

        return Response(data)
    
class LaligaTableView(APIView):
    def get(self, request):
        matches = MatchLaliga2025.objects.select_related('home', 'away')
        teams = {}

        for m in matches:
            home, away = m.home, m.away
            for t in (home, away):
                if t.id not in teams:
                    teams[t.id] = {
                        "team_id": t.id,
                        "name": t.name,
                        "logo": t.logo,
                        "played": 0, "won": 0, "drawn": 0, "lost": 0, "points": 0
                    }
            teams[home.id]["played"] += 1
            teams[away.id]["played"] += 1

            if m.fthg > m.ftag:      # home menang
                teams[home.id]["won"] += 1; teams[home.id]["points"] += 3
                teams[away.id]["lost"] += 1
            elif m.fthg < m.ftag:    # away menang
                teams[away.id]["won"] += 1; teams[away.id]["points"] += 3
                teams[home.id]["lost"] += 1
            else:                     # seri
                teams[home.id]["drawn"] += 1; teams[home.id]["points"] += 1
                teams[away.id]["drawn"] += 1; teams[away.id]["points"] += 1

        sorted_teams = sorted(teams.values(), key=lambda x: (-x["points"], -x["won"], x["name"]))
        for i, t in enumerate(sorted_teams, start=1):
            t["position"] = i
        return Response(sorted_teams)


class EplTableView(APIView):
    def get(self, request):
        matches = MatchEPL2025.objects.select_related('home', 'away')
        teams = {}

        for m in matches:
            home, away = m.home, m.away
            for t in (home, away):
                if t.id not in teams:
                    teams[t.id] = {
                        "team_id": t.id,
                        "name": t.name,
                        "logo": t.logo,  # URLField cukup pakai .logo
                        "played": 0, "won": 0, "drawn": 0, "lost": 0, "points": 0
                    }
            teams[home.id]["played"] += 1
            teams[away.id]["played"] += 1

            if m.fthg > m.ftag:
                teams[home.id]["won"] += 1; teams[home.id]["points"] += 3
                teams[away.id]["lost"] += 1
            elif m.fthg < m.ftag:
                teams[away.id]["won"] += 1; teams[away.id]["points"] += 3
                teams[home.id]["lost"] += 1
            else:
                teams[home.id]["drawn"] += 1; teams[home.id]["points"] += 1
                teams[away.id]["drawn"] += 1; teams[away.id]["points"] += 1

        sorted_teams = sorted(teams.values(), key=lambda x: (-x["points"], -x["won"], x["name"]))
        for i, t in enumerate(sorted_teams, start=1):
            t["position"] = i
        return Response(sorted_teams)
    
def _recent_matches_payload(matches_qs, team_obj, is_laliga=True, limit=5):
    data = []
    for m in matches_qs[:limit]:
        if m.home_id == team_obj.id:
            opponent = m.away
            venue = "H"
            score = f"{m.fthg}-{m.ftag}"
            result = "Menang" if m.fthg > m.ftag else ("Seri" if m.fthg == m.ftag else "Kalah")
        else:
            opponent = m.home
            venue = "A"
            score = f"{m.ftag}-{m.fthg}"  # dari sudut pandang tim
            result = "Menang" if m.ftag > m.fthg else ("Seri" if m.ftag == m.fthg else "Kalah")

        data.append({
            "opponent": opponent.name,
            "opponent_logo": opponent.logo,
            "venue": venue,
            "score": score,
            "result": result,
            "date": m.date
        })
    return data

class TeamStatsView(APIView):
    def get(self, request, league_code, team_id):
        if league_code == "laliga":
            Team = TeamLaliga
            Match = MatchLaliga2025
        elif league_code == "premier":
            Team = TeamEPL
            Match = MatchEPL2025
        else:
            return Response({"detail": "League not found"}, status=404)

        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found"}, status=404)

        # semua match yang melibatkan tim
        matches = (Match.objects
                   .select_related('home', 'away')
                   .filter(Q(home=team) | Q(away=team))
                   .order_by('-date', '-id'))

        played = wins = draws = losses = goals_for = goals_against = 0

        for m in matches:
            played += 1
            if m.home_id == team.id:
                goals_for += m.fthg
                goals_against += m.ftag
                if m.fthg > m.ftag: wins += 1
                elif m.fthg == m.ftag: draws += 1
                else: losses += 1
            else:
                goals_for += m.ftag
                goals_against += m.fthg
                if m.ftag > m.fthg: wins += 1
                elif m.ftag == m.fthg: draws += 1
                else: losses += 1

        avg_goals = (goals_for / played) if played else 0.0
        avg_conceded = (goals_against / played) if played else 0.0

        recent = _recent_matches_payload(matches, team)

        return Response({
            "team_id": team.id,
            "team_name": team.name,
            "logo": team.logo,
            "played": played,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "avg_goals": round(avg_goals, 2),
            "avg_conceded": round(avg_conceded, 2),
            "recent_matches": recent
        })
    
