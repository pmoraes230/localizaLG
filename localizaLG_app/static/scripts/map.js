// Variáveis globais
let map;
let userMarker = null;
let radarCircle = null;
let markers = [];
let directionsService;
let directionsRenderer;
let infoWindow; // Janela de informações
let userLat = null;
let userLng = null;

// Inicializa o mapa
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -1.458563, lng: -48.490239 },
        zoom: 15,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e8fa' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        ]
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    infoWindow = new google.maps.InfoWindow();

    getCurrentLocation(updateUserMarkerAndMap);
}

// Obtém localização do usuário
function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                callback(userLat, userLng);
            },
            (error) => {
                alert('Erro ao acessar localização.');
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    } else {
        alert('Geolocalização não suportada.');
    }
}

// Atualiza marcador e radar do usuário
function updateUserMarkerAndMap(lat, lng) {
    const userPosition = { lat: lat, lng: lng };

    if (!userMarker) {
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
        userMarker.setPosition(userPosition);
    }

    map.setCenter(userPosition);

    if (!radarCircle) {
        radarCircle = new google.maps.Circle({
            strokeColor: '#00BFFF',
            strokeWeight: 1,
            strokeOpacity: 0.5,
            fillOpacity: 0.15,
            fillColor: '#00BFFF',
            map: map,
            center: userPosition,
            radius: 150
        });
    } else {
        radarCircle.setCenter(userPosition);
    }
}

// Adiciona marcador no mapa
function addMarker(lat, lng, title, icon = null) {
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title,
        icon: icon,
    });
    markers.push(marker);
}

// Limpa os marcadores
function clearMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
}

// Busca no servidor e exibe resultados
function searchHandler() {
    const query = document.getElementById('search-input').value.trim();
    const resultsContainer = document.getElementById('search-results');

    if (query.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }

    fetch(`/escolas-lg/?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
            const results = data.results;
            resultsContainer.innerHTML = '';

            if (results.length === 0) {
                resultsContainer.innerHTML = '<li>Nenhum resultado encontrado</li>';
                resultsContainer.style.display = 'block';
                return;
            }

            resultsContainer.style.display = 'block';

            results.forEach((result) => {
                const li = document.createElement('li');
                li.textContent = result.name;
                li.style.cursor = 'pointer';

                li.addEventListener('click', function () {
                    clearMarkers();
                    addMarker(result.latitude, result.longitude, result.name);
                    map.setCenter({ lat: result.latitude, lng: result.longitude });
                    map.setZoom(15);

                    getRoute(result.latitude, result.longitude);
                    resultsContainer.style.display = 'none';
                });

                resultsContainer.appendChild(li);
            });
        })
        .catch((error) => console.error('Erro na busca:', error));
}

// Exibe rota até o local
function getRoute(destLat, destLng) {
    if (userLat !== null && userLng !== null) {
        const request = {
            origin: { lat: userLat, lng: userLng },
            destination: { lat: destLat, lng: destLng },
            travelMode: 'DRIVING',
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
            } else {
                console.error('Erro ao obter rota:', status);
            }
        });
    } else {
        alert('Localização do usuário não encontrada.');
    }
}

// Carrega pontos da API
function loadMarkers() {
    // Carrega pontos da API
    fetch('/escolas/')
        .then(response => response.json())
        .then(data => {
            data.forEach(ponto => {
                const latitude = parseFloat(ponto.latitude);
                const longitude = parseFloat(ponto.longitude);

                if (isNaN(latitude) || isNaN(longitude)) {
                    console.warn(`Coordenadas inválidas para o ponto:`, ponto);
                    return;
                }

                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: ponto.name || 'Sem nome',
                });

                marker.addListener('click', () => {
                    const contentString = `
                    <div class="info-window">
                        <h3>${ponto.name || 'Sem nome'}</h3>
                        <img src="/media/${ponto.image || 'default.jpg'}" alt="Imagem" />
                        <p>Endereço: ${ponto.address || 'Não disponível'}</p>
                        <button id="start-route">Iniciar Rota</button>
                    </div>`;

                    infoWindow.setContent(contentString);
                    infoWindow.open(map, marker);

                    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                        const startRouteButton = document.getElementById("start-route");
                        if (startRouteButton) {
                            startRouteButton.addEventListener("click", () => {
                                getRoute(latitude, longitude);
                                infoWindow.close();
                            });
                        }
                    });
                });

                markers.push(marker);
            });
        })
        .catch(error => console.error('Erro ao carregar escolas:', error));
}

// Chama a função para carregar os marcadores após inicializar o mapa
initMap = (function (originalInitMap) {
    return function () {
        originalInitMap();
        loadMarkers();
    };
})(initMap);

// Centraliza o mapa no usuário
function centerMap() {
    if (userLat !== null && userLng !== null) {
        map.setCenter({ lat: userLat, lng: userLng });
        map.setZoom(15);
    } else {
        alert('Localização do usuário não encontrada.');
    }
}

// Inicializa os eventos após o DOM carregar
document.addEventListener('DOMContentLoaded', function () {
    initMap();
});
