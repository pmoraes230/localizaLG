from django.urls import path
from .views import map, escolas_localization_json


urlpatterns = [
    path('', map, name='map'),
    path('Escolas-LG/', escolas_localization_json, name='escolas-pontos'),
]
