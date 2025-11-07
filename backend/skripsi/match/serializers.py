# serializers.py
from rest_framework import serializers
from .models import League
from .models import MatchLaliga

class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ['id', 'name', 'code']

class MatchLaligaSerializer(serializers.ModelSerializer):
    home_id = serializers.IntegerField(source='home.id', read_only=True)
    home_name = serializers.CharField(source='home.name', read_only=True)
    away_id = serializers.IntegerField(source='away.id', read_only=True)
    away_name = serializers.CharField(source='away.name', read_only=True)

    class Meta:
        model = MatchLaliga
        fields = [
            'id',
            'date',
            'home_id',
            'away_id',
            'fthg',
            'ftag',
            'ftr',
            'hthg',
            'htag',
            'htr',
            'hs',
            'aws',
            'hst',
            'ast',
            'hf',
            'af',
            'hc',
            'ac',
            'hy',
            'ay',
            'hr',
            'ar',
        ]

