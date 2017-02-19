var Backbone = require('backbone');

var AppView = Backbone.View.extend({
  	el: 'body',


	initialize: function() {
		this.initMap();	
		this.infowindow = null;
	},

	initMap: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -42.0155275, lng: 173.6358103},
			scrollwheel: false,
			zoom: 5
		});

		google.maps.InfoWindow.prototype.opened = false;

		this.getListings();
	},

	getListings: function() {
		var geocoder = new google.maps.Geocoder();
		var that = this;

		$.ajax({
			type: "GET",	
			url: "http://local.googlemaps.com:8888/js/stores.json",
			dataType: 'json',
			success: function (data) {
				
				$.each(data.regions, function(i, region) {
					
					$('select').append('<option>'+region.name+'</option>');
					if (region.name != 'Online Traders') {
						$.each(region.value, function(key, val) {
							var store = region.value[key];
							that.addMarker(map, store.lat, store.lng, store.address, store.name, store.phone, store.website);
						});
					}	
				});
			},
			error: function(xhr, status, error) {
					console.log(xhr, status, error);
			}
		});
	},

	addMarker: function(resultsMap, lat, lng, address, name, phone, website) {
		var key = 'AIzaSyAGcse28lYcou-lUbmnLGRFGaGbElgFsPw';
		var iconBase = 'images/';
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h3>'+name+'</h3>'+
		'<div id="bodyContent">'+
		'<p>'+address+'</p>'+
		'<p>'+phone+'</p>'+
		'<p><a href='+website+'>Website</a></p>'+
		'</div>'+
		'</div>';
		var marker = new google.maps.Marker({
			map: resultsMap,
			position: {lat: lat, lng: lng},
			icon: iconBase + 'icon.png'
		});
		marker.addListener('click', function() {
			if(this.infowindow){
				this.infowindow.close();
			}
			this.infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			this.infowindow.open(resultsMap, marker);
		});
	}
});

module.exports = AppView;
