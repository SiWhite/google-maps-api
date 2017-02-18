var Backbone = require('backbone');

var AppView = Backbone.View.extend({
  el: 'body',

	initialize: function() {
		this.initMap();
		this.getEvents();	
	},

	initMap: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -42.0155275, lng: 173.6358103},
			scrollwheel: false,
			zoom: 5
		});
	},

	getEvents: function() {
		var geocoder = new google.maps.Geocoder();
		var that = this;

		$.ajax({
			type: "GET",	
			url: "http://local.googlemaps.com:8888/js/stores.json",
			dataType: 'json',
			success: function (data) {
				//console.log(data.regions);
				
				$.each(data.regions, function(i, region) {
					console.log(region.name);
					$('select').append('<option>'+region.name+'</option>');
					// $.each(region, function(key, val) {
					// 	//console.log(region[key]);
					// 	$('select').append('<option>'+region[key]+'</option>');
					// });
					
					// $.each(region.Auckland, function(i, store) {
					// 	//console.log(store);
					// 	that.addMarker(map, store.lat, store.lng, store.address, store.name, store.phone);
					// });
				});
			},
			error: function(xhr, status, error) {
					console.log(xhr, status, error);
			}
		});
	},

	addMarker: function(resultsMap, lat, lng, address, name, phone) {
		var key = 'AIzaSyAGcse28lYcou-lUbmnLGRFGaGbElgFsPw';
		var iconBase = 'images/';
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h3>'+name+'</h3>'+
		'<div id="bodyContent">'+
		'<p>'+address+'</p>'+
		'<p>'+phone+'</p>'+
		'</div>'+
		'</div>';
		var marker = new google.maps.Marker({
			map: resultsMap,
			position: {lat: lat, lng: lng},
			icon: iconBase + 'icon.png'
		});
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		marker.addListener('click', function() {
			infowindow.open(resultsMap, marker);
		});
	}
});

module.exports = AppView;
