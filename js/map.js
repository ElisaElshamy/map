// Model
var restaurants = [
  {name: 'Ba Xuyên', point: {lat: 40.64529, lng: -73.999675}, icon: 'icons/sandwich.png', venue_id: '49e4cedbf964a5204f631fe3'},
  {name: 'Golden Z', point: {lat: 40.598652, lng: -73.95695}, icon: 'icons/rice.png', venue_id: '4b46743ff964a520892126e3'},
  {name: 'Hand Pull Noodle & Dumplings House', point: {lat: 40.614992, lng: -73.99418}, icon: 'icons/noodles.png', venue_id: '4ac916d1f964a5208fbe20e3'},
  {name: 'La Villa Pizza', point: {lat: 40.674325, lng: -73.981687}, icon: 'icons/pizza.png', venue_id: '44bd68b5f964a5209f351fe3'},
  {name: 'Super Pollo Latino', point: {lat: 40.650149, lng: -74.005287}, icon: 'icons/chicken.png', venue_id: '4cbb77f4a33bb1f7bd8094fd'}
];

//Foursquare API Keys
var client_id = '3F2PGSCHKRP5KKKBATD4WPY1XWTPLXXWS4LW1VHXWWTDZXHU';
var client_secret = 'RVHZN0JBJ0M3Q5Q2CMUJHZHLVYDQWJL2T0L2UADY2IUCZCIC';
//https://api.foursquare.com/v2/venues/49e4cedbf964a5204f631fe3?ll=40.6,-73.9&client_id=3F2PGSCHKRP5KKKBATD4WPY1XWTPLXXWS4LW1VHXWWTDZXHU&client_secret=RVHZN0JBJ0M3Q5Q2CMUJHZHLVYDQWJL2T0L2UADY2IUCZCIC&v=20170818

var today = new Date();
//The value returned by getMonth is an integer between 0 and 11
var current_date = String(today.getFullYear()) + '0' + String(today.getMonth()+1) + String(today.getDate());

console.log(current_date);
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
		    icon: restaurant.icon,
		    animation: google.maps.Animation.DROP
		});

		var infowindow = new google.maps.InfoWindow({
    		content: "contentString"
  		});

		marker.addListener('click', function() {
          	marker.setAnimation(google.maps.Animation.BOUNCE);
          	setTimeout(function () {
          		marker.setAnimation(null);
			}, 1500);

          	infowindow.open(map, marker);
		});

		$.ajax({
			type: "GET",
			dataType: 'json',
			cache: false,
			url: 'https://api.foursquare.com/v2/venues/' + restaurant.venue_id + '?client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + current_date,
			async: true,
			success: function(data) {
					console.log(data.response);
			},
			error: function(data) {
				alert("Error retrieving data from foursquare.");
			}
		});

		self.markerList.push(new Marker(restaurant));

	});

	this.currentMarker = ko.observable();

	this.setRestaurant = function(clickedMarker) {
		self.currentMarker(clickedMarker);
		map.panTo(clickedMarker.position); 
		map.setZoom(16);
	};

}


