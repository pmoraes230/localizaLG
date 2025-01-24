function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -1.458563, lng: -48.490239 },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
            { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
            { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
            { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
            { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
            { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
            { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
            { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
            { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
            { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#d4d4d4' }] },
            { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e8fa' }] },
            { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#b1d0e3' }] }
        ]
    });

    let userMarker;

    // Função para obter a localização atual do usuário
    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
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

    // Atualiza o marcador e centraliza o mapa
    getCurrentLocation((userLat, userLng) => {
        const userPosition = { lat: userLat, lng: userLng };

        if (!userMarker) {
            // Cria o marcador se ele ainda não existir
            userMarker = new google.maps.Marker({
                position: userPosition,
                map: map,
                title: 'Você está aqui',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF'
                }
            });
        } else {
            // Atualiza a posição do marcador
            userMarker.setPosition(userPosition);
        }

        // Centraliza o mapa na nova posição
        map.setCenter(userPosition);
    });
}

function updateRadarposition(lat, lng) {
    // se o radar ainda não foi criado
    if(!radarCircle) {
        radarCircle = new google.maps.Circle({
            strokeColor: "00BFFF",
            strokeWeight: 1,
            strokeOpacity: 0.5,
            fillOpacity: 0.15,
            fillColor: "00BFFF",
            map: map,
            center: {lat: lat, lng: lng},
            radius: 150
        })
    } else {
        radarCircle.setCenter({lat: lat, lng: lng}),
        map.setCenter(XPathResult.routes[0].legs[0].end_location)
    }
}
document.addEventListener("DOMContentLoaded", function () {
    initMap();
});
