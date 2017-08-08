// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function MapViewModel() {

	function initMap() {
		var map;
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
    }

}

// Activates knockout.js
ko.applyBindings(new MapViewModel());