from django.db import models

class TeamLaliga(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    name_web = models.CharField(max_length=100, default='', blank=True)
    is_active = models.BooleanField(default=False)
    included_in_traced = models.BooleanField(default=False)
    logo = models.URLField(blank=True, null=True)
    model_index = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.name

class TeamEPL(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    name_web = models.CharField(max_length=100, default='', blank=True)
    is_active = models.BooleanField(default=False)
    included_in_traced = models.BooleanField(default=False)
    logo = models.URLField(blank=True, null=True)
    model_index = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.name
    

class MatchLaliga(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    home = models.ForeignKey(
        TeamLaliga, related_name='laliga_home_matches', on_delete=models.CASCADE
    )
    away = models.ForeignKey(
        TeamLaliga, related_name='laliga_away_matches', on_delete=models.CASCADE
    )

    fthg = models.IntegerField()   # Full Time Home Goals
    ftag = models.IntegerField()   # Full Time Away Goals
    ftr = models.CharField(max_length=1)  # Full Time Result (H/D/A)

    hthg = models.IntegerField()   # Half Time Home Goals
    htag = models.IntegerField()   # Half Time Away Goals
    htr = models.CharField(max_length=1)  # Half Time Result

    hs = models.IntegerField()
    aws = models.IntegerField()  # kolom 'AS' dataset
    hst = models.IntegerField()
    ast = models.IntegerField()
    hf = models.IntegerField()
    af = models.IntegerField()
    hc = models.IntegerField()
    ac = models.IntegerField()
    hy = models.IntegerField()
    ay = models.IntegerField()
    hr = models.IntegerField()
    ar = models.IntegerField()

class MatchEPL(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    home = models.ForeignKey(
        TeamEPL, related_name='epl_home_matches', on_delete=models.CASCADE
    )
    away = models.ForeignKey(
        TeamEPL, related_name='epl_away_matches', on_delete=models.CASCADE
    )

    fthg = models.IntegerField()   # Full Time Home Goals
    ftag = models.IntegerField()   # Full Time Away Goals
    ftr = models.CharField(max_length=1)  # Full Time Result (H/D/A)

    hthg = models.IntegerField()   # Half Time Home Goals
    htag = models.IntegerField()   # Half Time Away Goals
    htr = models.CharField(max_length=1)  # Half Time Result

    hs = models.IntegerField()
    aws = models.IntegerField()  # kolom 'AS' dataset
    hst = models.IntegerField()
    ast = models.IntegerField()
    hf = models.IntegerField()
    af = models.IntegerField()
    hc = models.IntegerField()
    ac = models.IntegerField()
    hy = models.IntegerField()
    ay = models.IntegerField()
    hr = models.IntegerField()
    ar = models.IntegerField()
    

class MatchLaliga2025(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    home = models.ForeignKey(
        TeamLaliga, related_name='laliga2025_home_matches', on_delete=models.CASCADE
    )
    away = models.ForeignKey(
        TeamLaliga, related_name='laliga2025_away_matches', on_delete=models.CASCADE
    )


    fthg = models.IntegerField()   # Full Time Home Goals
    ftag = models.IntegerField()   # Full Time Away Goals
    hy = models.IntegerField()
    ay = models.IntegerField()
    hr = models.IntegerField()
    ar = models.IntegerField()
    hs = models.IntegerField()
    aws = models.IntegerField()  # kolom 'AS' dataset
    hst = models.IntegerField()
    ast = models.IntegerField()
    hc = models.IntegerField()
    ac = models.IntegerField()

class MatchEPL2025(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    home = models.ForeignKey(
        TeamEPL, related_name='epl2025_home_matches', on_delete=models.CASCADE
    )
    away = models.ForeignKey(
        TeamEPL, related_name='epl2025_away_matches', on_delete=models.CASCADE
    )


    fthg = models.IntegerField()   # Full Time Home Goals
    ftag = models.IntegerField()   # Full Time Away Goals
    hy = models.IntegerField()
    ay = models.IntegerField()
    hr = models.IntegerField()
    ar = models.IntegerField()
    hs = models.IntegerField()
    aws = models.IntegerField()  # kolom 'AS' dataset
    hst = models.IntegerField()
    ast = models.IntegerField()
    hc = models.IntegerField()
    ac = models.IntegerField()
    

class League(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)     # contoh: 'La Liga', 'Premier League'
    code = models.CharField(max_length=10)     # contoh: 'laliga', 'epl'

    def __str__(self):
        return self.name