let map;
let userMarker = null;
let radarCircle = null;
let markers = [];
let directionsService;
let directionsRenderer;
let infoWindow;  // Adicionado para o infoWindow

// Inicializa o mapa
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -1.458563, lng: -48.490239 }, // Ponto inicial
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

    // Inicializa o infoWindow para exibir detalhes
    infoWindow = new google.maps.InfoWindow();

    getCurrentLocation(updateUserMarkerAndMap);
}

// Obtém localização do usuário
function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
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
function addMarker(lat, lng, title) {
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title,
    });
    markers.push(marker);
}

// Limpa os marcadores
function clearMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
}

// Busca no servidor e exibe resultados
document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.trim();
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
                resultsContainer.style.display = 'none';
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
});

// Exibe rota até o local
function getRoute(destLat, destLng) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

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
        },
        (error) => {
            alert('Erro ao obter localização.');
        }
    );
}

fetch('/escolas/')
    .then(response => response.json())
    .then(data => {
        data.forEach(ponto => {
            const latitude = parseFloat(ponto.latitude);
            const longitude = parseFloat(ponto.longitude);
            console.log(latitude, longitude); // Verifique os valores no console

            const categoria = ponto["categorias_id_categorias__nome"];
            const latLngKey = `${latitude},${longitude}`;
            const markerIcon = {
                url: gerarIconeCor(categoria),
                scaledSize: new google.maps.Size(35, 55),
                anchor: new google.maps.Point(15, 40)
            };

            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: ponto.nome,
                category: categoria,
                icon: markerIcon
            });

            marker.addListener('click', () => {
                const contentString = `
                    <div class="info-window p-3">
                        <h3 class="info-title text-center">${ponto.name}</h3>
                        <img src="/media/${ponto.image}" alt="${ponto.name}" class="info-image img-fluid mb-2" />
                        <div class="content-ponto">
                        <p><span>Endereço:</span> ${ponto.address || 'Não disponível'}</p>
                        </div>
                        <button id="start-route">Iniciar Rota</button>
                    </div>`;
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);

                google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                    document.getElementById("start-route").addEventListener("click", () => {
                        getRoute(latitude, longitude); // Inicia a rota até a escola
                        infoWindow.close();
                    });
                });
            });

            markers.push(marker);
        });
    })
    .catch(error => console.error('Erro ao carregar escolas:', error));

document.getElementById('center-map-btn').addEventListener('click', function () {
    // Exemplo de centralizar no centro do mapa atual
    const currentCenter = map.getCenter();

    // Ou você pode usar a localização do usuário, por exemplo:
    // const userPosition = { lat: userLat, lng: userLng }; (onde userLat e userLng são obtidas via geolocalização)

    map.setCenter(currentCenter); // ou userPosition
    map.setZoom(15); // Para ajustar o zoom se necessário
});


document.addEventListener('DOMContentLoaded', function () {
    initMap();
});
