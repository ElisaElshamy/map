// function Point(lat, long) {
//     this.lat = ko.observable(lat);
//     this.long = ko.observable(long);
// }
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.578, lng: -73.959},
		zoom: 8
	});
}

function MapViewModel() {
	// var self = this;
 //    self.currentPoint = ko.observable( new Point ({
 //        lat: 40.578,
 //        lng: -73.959
 //    }) );
}

// Activates knockout.js
//ko.applyBindings(new MapViewModel());