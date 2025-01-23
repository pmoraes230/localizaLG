from django.urls import path
from .views import map


urlpatterns = [
    path('', map, name='map'),
    # path('Escolas-LG/', escolasLG, name='escolas'),
]
