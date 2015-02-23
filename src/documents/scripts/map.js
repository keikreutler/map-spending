L.mapbox.accessToken = 'pk.eyJ1IjoiZ2FtZXJhIiwiYSI6IjNlclVnZDAifQ.a8PjkEfE5i2aOShPawCy1A';
var map = L.mapbox.map('map', 'gamera.l9377l9d', {
    zoomControl: false,
}).setView([37.9996121898726, 23.7338161468506], 13);

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
    createMarkers(items);
}

/********************
CREATE LAYER GROUPS
********************/

var apartment = new L.layerGroup();
var personal = new L.layerGroup();
var food = new L.layerGroup();
var transport = new L.layerGroup();

function createMarkers(data) {
    for(i = 0; i < items.length; i++) {
		marker = L.marker([data[i].lat, data[i].lng]);
		createPopups(marker, data[i].item, data[i].vendor, data[i].category);
		/* Add marker to specific layer groups */
		switch(data[i].category) {
			case "Apartment":
				apartment.addLayer(marker);
			break;
			case "Food":
				food.addLayer(marker);
			break;
			case "Personal":
				personal.addLayer(marker);
			break;
			case "Transport":
				transport.addLayer(marker);
			break;
		}
	}
}

function createPopups(marker, item, vendor, category) {
	popupContent = ('<h3>' + item + '</h3><p>Location: ' + vendor + '<br>Category: ' + category + '</p>');
	marker.bindPopup(popupContent);
}

map.addLayer(apartment);
map.addLayer(food);
map.addLayer(personal);
map.addLayer(transport);