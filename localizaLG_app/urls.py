from django.urls import path
from django.conf.urls.static import static
from localizaLG import settings
from .views import map, escolas_localization_json, escolas


urlpatterns = [
    path('', map, name='map'),
    path('escolas-lg/', escolas_localization_json, name='escolas-pontos'),
    path('escolas/', escolas, name='escolas'),  # API para dados JSON
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
