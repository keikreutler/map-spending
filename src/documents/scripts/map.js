L.mapbox.accessToken = 'pk.eyJ1IjoiZ2FtZXJhIiwiYSI6IjNlclVnZDAifQ.a8PjkEfE5i2aOShPawCy1A';
var map = L.mapbox.map('map', 'gamera.l9377l9d', {
    zoomControl: false,
}).setView([38.005, 23.7338161468506], 14); // 996121898726

new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

map.scrollWheelZoom.disable();


var items;
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1MnNJ97vEZzj7RSQab2LBq-0o9e6IPBRdtdXQyu6sM0o/pubhtml';
var marker, popupContent;

var spreadsheet_data = Tabletop.init( { key: public_spreadsheet_url,
				 callback: showInfo,
				 simpleSheet: true } );

function showInfo(data, tabletop) {
    items = spreadsheet_data.data();
    createLayers(items);
    createMarkers(items);
}

/********************
CREATE LAYER GROUPS
********************/

var apartment = new L.layerGroup();
var personal = new L.layerGroup();
var food = new L.layerGroup();
var transport = new L.layerGroup();

var clusterGroups = [];

var overlays = [];
/*


var apartment = new L.layerGroup();
var personal = new L.layerGroup();
var food = new L.layerGroup();
var transport = new L.layerGroup();

{
    "Apartment": apartment,
    "Personal": personal,
    "Food": food,
    "Transport": transport
};*/

var markers = new L.MarkerClusterGroup({
	maxClusterRadius: 20
});

/********************
ICONS
********************/

var icon_apartment = L.icon({
	iconUrl: '/images/apartment_root.png',
	iconAnchor: [12, 5],
	iconSize: [20,20]
});
var icon_personal = L.icon({
	iconUrl: '/images/personal_solar.png',
	iconAnchor: [12, 5],
	iconSize: [20,20]
});
var icon_food = L.icon({
	iconUrl: '/images/food_sacral.png',
	iconAnchor: [12, 5],
	iconSize: [20,20]
});
var icon_transport = L.icon({
	iconUrl: '/images/transport_thirdeye.png',
	iconAnchor: [12, 5],
	iconSize: [20,11]
});

function createLayers(data) {
	for(i = 0; i < items.length; i++) {
		if(overlays[data[i].category] === undefined){
			overlays[data[i].category] = new L.layerGroup();
		}
	}
}

function createMarkers(data) {
    for(i = 0; i < items.length; i++) {
		marker = L.marker([data[i].lat, data[i].lng]);
		createPopups(marker, data[i].item, data[i].vendor, data[i].category, data[i].total);
		overlays[data[i].category].addLayer(marker);
		marker.setIcon(L.mapbox.marker.icon({
			'marker-color': '#AAA',
			'marker-size': 'small'
		}));
		markers.addLayer(marker);
	}
	addCategoryLayers();
}

function createPopups(marker, item, vendor, category, total) {
	popupContent = ('<div class="category"><h1>' + category + '</h1></div><div class="description"><p>Item: ' + item + '<br>Vendor: ' + vendor + '<br>Cost: ' + total + '</p></div>');
	marker.bindPopup(popupContent);
}

function addCategoryLayers() {
    for(i = 0; i < overlays.length; i++) {
    	map.addLayer(overlays[i]);
    }
}

/*map.addLayer(apartment);
map.addLayer(food);
map.addLayer(personal);
map.addLayer(transport);*/

map.addLayer(markers);

new L.control.layers(null, overlays, { position: 'bottomright', collapsed: true }).addTo(map);

/**********************
Render text data
**********************/


