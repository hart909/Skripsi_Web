from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

def index(request):
    return HttpResponse("Halo, ini halaman Home dari app Home!")

@api_view(["GET"])
def hello(request):
    return Response({"message": "Hello from Django REST Framework!"})
