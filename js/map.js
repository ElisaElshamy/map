// Model
var restaurants = [
  {name: 'Ba Xuyên', point: {lat: 40.64529, lng: -73.999675}},
  {name: 'Golden Z', point: {lat: 40.598652, lng: -73.95695}},
  {name: 'Hand Pull Noodle & Dumplings House', point: {lat: 40.614992, lng: -73.99418}},
  {name: 'La Villa Pizza', point: {lat: 40.674325, lng: -73.981687}},
  {name: 'Super Pollo Latino', point: {lat: 40.650149, lng: -74.005287}}
];

var map;

function Marker(location) {
	this.title = location.name;
	this.position = location.point;
}

function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.6290465, lng: -73.9871572},
		zoom: 13
	});

	ko.applyBindings(new MapViewModel());
	//placeMarkers(map);
}

function MapViewModel() {
	// A neat little trick to have a variable pointer to the VM 
	var self = this;

	this.markerList = ko.observableArray([]);

	restaurants.forEach(function(restaurant){
		
		var marker = new google.maps.Marker({
		    position: restaurant.point,
		    map: map,
		    title: restaurant.name,
		    animation: google.maps.Animation.DROP
		});

		marker.addListener('click', function() {
          	marker.setAnimation(google.maps.Animation.BOUNCE);
          	setTimeout(function () {
          		marker.setAnimation(null);
			}, 1500);

		});

		self.markerList.push(new Marker(restaurant));

	});

	this.currentMarker = ko.observable();
	this.setRestaurant = function(clickedMarker) {
		self.currentMarker(clickedMarker);
		map.panTo(self.clickedMarker.position); 
		console.log(clickedMarker.title);
	};
}

