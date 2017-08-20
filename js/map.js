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

var today = new Date();
//The value returned by getMonth is an integer between 0 and 11
var current_date = String(today.getFullYear()) + '0' + String(today.getMonth()+1) + String(today.getDate());
var map;


function Marker(location) {
	this.title = ko.observable(location.name);
	this.position = location.point;
	this.marker = location.marker;
}

function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.6350066, lng: -74.0023493},
		zoom: 13
	});

	ko.applyBindings(new MapViewModel());
}

function MapViewModel() {
	// A neat little trick to have a variable pointer to the VM 
	var self = this;

	self.markerList = ko.observableArray();

	restaurants.forEach(function(restaurant){
		
		var marker = new google.maps.Marker({
		    position: restaurant.point,
		    map: map,
		    title: restaurant.name,
		    icon: restaurant.icon,
		    animation: google.maps.Animation.DROP
		});

		$.ajax({
			type: "GET",
			dataType: 'json',
			cache: false,
			url: 'https://api.foursquare.com/v2/venues/' + restaurant.venue_id + '?client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + current_date,
			async: true,
			success: function(data) {
				var infowindow = new google.maps.InfoWindow({
					content: '<div><h2 class="restaurant-name"><a href="' + data.response.venue.canonicalUrl + '">' + 
								data.response.venue.name + '</a></h2><p>Phone: ' + data.response.venue.contact.formattedPhone +
								'</p><p>' + data.response.venue.location.formattedAddress[0] + '<br>' +
								data.response.venue.location.formattedAddress[1] + '</p><p>Rating: ' + data.response.venue.rating +
								'/10 <span class="price" style="margin-left: 1.4em">Price: ' + data.response.venue.price.currency + '</span></p></div>'
				});

				marker.addListener('click', function() {
			      	marker.setAnimation(google.maps.Animation.BOUNCE);
			      	setTimeout(function () {
			      		marker.setAnimation(null);
					}, 1500);

			      	infowindow.open(map, marker);
				});

				restaurant.marker = marker;
				self.markerList.push(new Marker(restaurant));

			},
			error: function(data) {
				alert("Error retrieving data from foursquare.");
			}
		});

		

	});

	self.currentMarker = ko.observable();

	self.setRestaurant = function(clickedMarker) {
		self.currentMarker(clickedMarker);
		map.panTo(clickedMarker.position); 
		google.maps.event.trigger(clickedMarker.marker, 'click');
		map.setZoom(16);
	};

	self.search = ko.observable("");

	self.restaurantsList = ko.computed(function () {
        var result = self.search().toLowerCase();

        //Works as a reset to show all markers if the search box is cleared.
        //Always checks if markers exist and sets them to visible before
        //considering the the typed input into the search box.  Idea 
        //inspired from https://discussions.udacity.com/t/cant-get-to-filter-markers/195121/7
        self.markerList().forEach(function (item) {
			if ( item.marker ) {
				item.marker.setVisible(true);
			} 
		});

        if (!result) {
            return self.markerList();
        } else {

            return ko.utils.arrayFilter(self.markerList(), function (item) {

            	if (item.title().toLowerCase().indexOf(result) === -1) {
            		item.marker.setVisible(false);
            	}

                return item.title().toLowerCase().indexOf(result) !== -1;
            });
        }
    });

}


