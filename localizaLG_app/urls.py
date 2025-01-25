from django.urls import path
from .views import map, escolas_localization_json, escolas


urlpatterns = [
    path('', map, name='map'),
    path('escolas-lg/', escolas_localization_json, name='escolas-pontos'),
    path('escolas/', escolas, name='escolas'),  # API para dados JSON
]
