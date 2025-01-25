from django.http import JsonResponse
from django.shortcuts import render
from .models import TbSchoolslg

# Create your views here.
def map(request):
   return render(request, 'index.html')

def escolas_localization_json(request):
    query = request.GET.get('q', '').strip()
    if query:
        locations = TbSchoolslg.objects.filter(name__icontains=query)
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