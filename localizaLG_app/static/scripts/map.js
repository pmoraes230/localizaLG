function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -1.458563, lng: -48.490239 },
        zoom: 2,
        disableDefaultUI: true,
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#eaeaea' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#333' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a4c8e1' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#c0c0c0' }] }
        ]
    });

    const infoWindow = new google.maps.InfoWindow();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    directionsRenderer.setMap(map);

    let userMarker;

    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    callback(userLat, userLng);
                },
                error => console.error('Erro ao obter localização:', error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.log("Geolocalização não é suportada pelo navegador.");
        }
    }

    function updateRoute(userLat, userLng, destinationLat, destinationLng) {
        const request = {
            origin: { lat: userLat, lng: userLng },
            destination: { lat: destinationLat, lng: destinationLng },
            travelMode: 'DRIVING'
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                map.setCenter(result.routes[0].legs[0].end_location);
            } else {
                console.error('Erro ao traçar rota:', status);
            }
        });
    }

    // Obtém os parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    let destinationLat = parseFloat(urlParams.get('lat'));
    let destinationLng = parseFloat(urlParams.get('lng'));

    if (!isNaN(destinationLat) && !isNaN(destinationLng)) {
        getCurrentLocation((userLat, userLng) => {
            // Cria a rota inicial
            updateRoute(userLat, userLng, destinationLat, destinationLng);

            // Cria ou atualiza o marcador do usuário
            userMarker = new google.maps.Marker({
                position: { lat: userLat, lng: userLng },
                map: map,
                title: 'Você está aqui',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#FFFFFF'
                }
            });

            map.setCenter({ lat: userLat, lng: userLng });
            map.setZoom(15);
        });
    }

    // Carrega os pontos turísticos
    fetch('/pontos-turisticos/')
        .then(response => response.json())
        .then(data => {
            data.forEach(ponto => {
                const latitude = parseFloat(ponto.latitude);
                const longitude = parseFloat(ponto.longitude);
                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: ponto.nome
                });

                marker.addListener('click', () => {
                    const contentString = `
                    <div>
                        <h3>${ponto.nome}</h3>
                        <p>Endereço: ${ponto.endereco || 'Não disponível'}</p>
                        <button id="start-route">Iniciar Rota</button>
                    </div>`;
                    infoWindow.setContent(contentString);
                    infoWindow.open(map, marker);

                    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                        document.getElementById("start-route").addEventListener("click", () => {
                            updateRoute(userMarker.getPosition().lat(), userMarker.getPosition().lng(), latitude, longitude);
                            infoWindow.close();
                        });
                    });
                });
            });
        })
        .catch(error => console.error('Erro ao buscar pontos turísticos:', error));
}

document.addEventListener("DOMContentLoaded", function () {
    initMap();
});