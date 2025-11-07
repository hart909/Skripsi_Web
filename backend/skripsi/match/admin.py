from django.contrib import admin
from .models import TeamEPL, TeamLaliga

@admin.register(TeamLaliga)
class TeamLaligaAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','name_web', 'is_active','included_in_traced', 'logo', 'model_index')
    list_editable = ('name','name_web','is_active','included_in_traced','logo','model_index')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(TeamEPL)
class TeamEplAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','name_web', 'is_active','included_in_traced','logo', 'model_index')
    list_editable = ('name','name_web','is_active','included_in_traced','logo','model_index')
    list_filter = ('is_active',)
    search_fields = ('name',)