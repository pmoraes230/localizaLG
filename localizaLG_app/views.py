from django.http import JsonResponse
from django.shortcuts import render
from .models import TbSchoolslg

# Create your views here.
def map(request):
   return render(request, 'index.html')

def escolas_localization_json(request):
    # Obtenha os parâmetros de limite do mapa
    ne_lat = request.GET.get('ne_lat')
    ne_lng = request.GET.get('ne_lng')
    sw_lat = request.GET.get('sw_lat')
    sw_lng = request.GET.get('sw_lng')

    # Verifique se os parâmetros estão presentes
    if ne_lat and ne_lng and sw_lat and sw_lng:
        # Filtra os pontos turísticos dentro dos limites (latitude e longitude)
        pontos = TbSchoolslg.objects.filter(
            latitude__lte=ne_lat,  # Latitude menor ou igual ao limite norte
            latitude__gte=sw_lat,  # Latitude maior ou igual ao limite sul
            longitude__lte=ne_lng, # Longitude menor ou igual ao limite leste
            longitude__gte=sw_lng  # Longitude maior ou igual ao limite oeste
        )
    else:
        # Caso os limites não sejam fornecidos, retorna todos os pontos (pode ser modificado)
        pontos = TbSchoolslg.objects.all()

    # Extrai os valores em um formato de dicionário
    school_point = list(pontos.values(
        'name', 'image', 'address', 'latitude', 'longitude',
    ))

    return JsonResponse(school_point, safe=False)

