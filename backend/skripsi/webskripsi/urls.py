from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('match/', include('match.urls')),
    path('home/', include('home.urls')),
   path('api/predict/', include('prediksi.urls')),   # ⬅️ ini penting
]
