from django.http import JsonResponse
from django.shortcuts import render
from .models import Tbschoolslg

# Create your views here.
def map(request):
   return render(request, 'index.html')

def escolas_localization_json(request):
    query = request.GET.get('q', '').strip()
    if query:
        locations = Tbschoolslg.objects.filter(name__icontains=query)
        results = [
            {
                'id': loc.id_schoolslg,
                'name': loc.name,
                'address': loc.address,
                'image': loc.image.url,
                'latitude': loc.latitude,
                'longitude': loc.longitude,
            }
            for loc in locations
        ]
        return JsonResponse({'results': results})
    return JsonResponse({'results': []})

def escolas(request):
    # Obtenha os parâmetros de limite do mapa
    ne_lat = request.GET.get('ne_lat')
    ne_lng = request.GET.get('ne_lng')
    sw_lat = request.GET.get('sw_lat')
    sw_lng = request.GET.get('sw_lng')

    # Verifique se os parâmetros estão presentes
    if ne_lat and ne_lng and sw_lat and sw_lng:
        # Filtra os pontos turísticos dentro dos limites (latitude e longitude)
        pontos = Tbschoolslg.objects.filter(
            latitude__lte=ne_lat,  # Latitude menor ou igual ao limite norte
            latitude__gte=sw_lat,  # Latitude maior ou igual ao limite sul
            longitude__lte=ne_lng, # Longitude menor ou igual ao limite leste
            longitude__gte=sw_lng  # Longitude maior ou igual ao limite oeste
        )
    else:
        # Caso os limites não sejam fornecidos, retorna todos os pontos (pode ser modificado)
        pontos = Tbschoolslg.objects.all()

    # Extrai os valores em um formato de dicionário
    pontos_list = list(pontos.values(
        'latitude', 'longitude', 'name', 'image', 'address'
    ))
 
    return JsonResponse(pontos_list, safe=False)