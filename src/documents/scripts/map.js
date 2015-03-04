L.mapbox.accessToken = 'pk.eyJ1IjoiZ2FtZXJhIiwiYSI6IjNlclVnZDAifQ.a8PjkEfE5i2aOShPawCy1A';
var map = L.mapbox.map('map', 'gamera.l9377l9d', {
    zoomControl: false,
}).setView([37.9996121898726, 23.7338161468506], 13);

new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

map.scrollWheelZoom.disable();

var heat = L.heatLayer([]).addTo(map);

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

var clusterGroups = [];

var overlays = {
    "Apartment": apartment,
    "Personal": personal,
    "Food": food,
    "Transport": transport
};

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
		}
	}
}

function createMarkers(data) {
    for(i = 0; i < items.length; i++) {
		marker = L.marker([data[i].lat, data[i].lng]);
		createPopups(marker, data[i].item, data[i].vendor, data[i].category);
		if(clusterGroups[data[i].vendor] === undefined) {
			clusterGroups[data[i].vendor] = new L.MarkerClusterGroup(); 
		}
		clusterGroups[data[i].vendor].addLayer(marker);
		/* Add marker to specific layer groups */
		switch(data[i].category) {
			case "Apartment":
				apartment.addLayer(marker);
				marker.setIcon(L.mapbox.marker.icon({
					'marker-color': '#FFCAA7',
					'marker-size': 'small'
				}));
			break;
			case "Food":
				food.addLayer(marker);
				marker.setIcon(L.mapbox.marker.icon({
					'marker-color': '#50A4AB',
					'marker-size': 'small'
				}));
			break;
			case "Personal":
				personal.addLayer(marker);
				marker.setIcon(L.mapbox.marker.icon({
					'marker-color': '#83E6ED',
					'marker-size': 'small',
					'opacity': '.5'
				}));
			break;
			case "Transport":
				transport.addLayer(marker);
				marker.setIcon(L.mapbox.marker.icon({
					'marker-color': '#C7945F',
					'marker-size': 'small'
				}));
			break;
		}
	}
}

function createPopups(marker, item, vendor, category) {
	popupContent = ('<div class="category"><h1>' + category + '</h1></div><div class="description"><p>Item: ' + item + '<br>Vendor: ' + vendor + '</p></div>');
	marker.bindPopup(popupContent);
}

map.addLayer(apartment);
map.addLayer(food);
map.addLayer(personal);
map.addLayer(transport);

apartment.eachLayer(function(l) {
	heat.addLatLng(l.getLatLng());
});

food.eachLayer(function(l) {
	heat.addLatLng(l.getLatLng());
});

personal.eachLayer(function(l) {
	heat.addLatLng(l.getLatLng());
});

transport.eachLayer(function(l) {
	heat.addLatLng(l.getLatLng());
});

map.addLayer(heat);

new L.control.layers(null, overlays, { position: 'bottomright', collapsed: false }).addTo(map);

/**********************
Render text data
**********************/

var Spending = Backbone.Model.extend({
	tabletop: {
		instance: spreadsheet_data
	},
	sync: Backbone.tabletopSync
})

/*
Need to specify that you'd like to sync using Backbone.tabletopSync
Need to specify a tabletop key and sheet
*/
var SpendingCollection = Backbone.Collection.extend({
// Reference to this collection's model.
model: Spending,
	tabletop: {
		instance: spreadsheet_data
	},
	sync: Backbone.tabletopSync
});

var SpendingView = Backbone.View.extend({
	el: "#spending",
	tagname: 'div',
	template: _.template($('#spending-template').html()),

	initialize: function(){
	   this.listenTo(this.collection,"add", this.renderItem);          
	},
	render: function () {
	   this.collection.each(function(model){
	        var spendingTemplate = this.template(model.toJSON());
	        this.$el.append(spendingTemplate);
	   }, this);        
	   return this;
	},
	renderItem: function(profile) {
	    var spendingTemplate = this.template(profile.toJSON());
	    this.$el.append(spendingTemplate);        
	}
});

var spendingCollection = new SpendingCollection();
var spendingView = new SpendingView({ collection: spendingCollection });
spendingView.render();

