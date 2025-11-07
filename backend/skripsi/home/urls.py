from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="home"),           # halaman home biasa
    path("api/hello/", views.hello, name="hello") # API hello world
]
