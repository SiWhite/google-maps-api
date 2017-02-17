var Backbone = require('backbone');

var AppView = Backbone.View.extend({
  el: 'body',

	initialize: function() {
		this.initMap();
		this.getEvents();

		this.map;
	},

	initMap: function() {
		var home = {lat: -41.3222902, lng: 174.7743656};
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -41.3222902, lng: 174.7415353},
			scrollwheel: false,
			zoom: 12
		});
		var marker = new google.maps.Marker({
			position: home,
			map: map
		});
	},

	getEvents: function() {
		var username = 'silentdesigns';
		var password = 'vbkmr6d28vjw';
		var that = this;
		$.ajax({
			type: "GET",
			url: 'http://api.eventfinda.co.nz/v2/events.json',
			dataType: "jsonp",
			timeout: 5000,
			beforeSend: function (data) {
				data.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
			},
			success: function (data) {
				// console.log(data.events)
				$.each(data.events, function(index, event) {
					console.log(event.name, event.address);
					that.geoCodeAddress(event.address);
          		});
			},
			error: function(data, textStatus, errorThrown) {
				console.log('error');
			}
		});
	},

	geoCodeAddress: function(address) {
		console.log('geocode', address);
		//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
	}
});

module.exports = AppView;
