var Backbone = require('backbone');

var AppView = Backbone.View.extend({
  el: 'body',

   events: {
	 "change select": "updateRegion",
	 "click .nav > li > a": "updateTabs"
  },

	initialize: function() {
		this.infowindow = null;
		this.map = null;
		this.markers = new Array();
    	this.userLat = null;
    	this.userLng = null;
    	this.initMap();
    	this.checkGeolocation();
    	_.bindAll(this,'getListings');
	},

	initMap: function() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -41.0155275, lng: 173.6358103},
			scrollwheel: false,
			zoom: 5
		});
		this.map = map;
		this.getListings();
	},

  checkGeolocation: function() {

    if ("geolocation" in navigator){ //check Geolocation available

	    var options = {
		  enableHighAccuracy: true,
		  timeout: 15000,
		  maximumAge: 0
		};
    	
      navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError, options)
    } else {
        console.log("Geolocation not available!");
    }
  },

  geolocationSuccess: function(position) {
  	var that = this;
  	console.log('here');
  	var that = this;
  	this.userLat = position.coords.latitude;
    this.userLng = position.coords.longitude;
   	// AppView.prototype.getListings();
  },

  geolocationError: function(err) {
    console.log(err);
  },

	getListings: function() {
		var that = this;
		var promises = [];

		$.ajax({
			type: 'GET',
			//url: 'https://local.googlemaps.com/js/stores.json',
      		url: 'https://vinyldirectory.nz/js/stores.json',
			dataType: 'json',
			success: function (data) {
				$.each(data.regions, function(i, region) {
					var dfd = $.Deferred();
					if (region.name != 'Online Traders') {
            			$('select').append('<option value="'+region.name+'">'+region.name+'</option>');
						$.each(region.value, function(key, val) {
							var store = region.value[key];
							that.addMarker(map, store.lat, store.lng, store.address, store.name, store.phone, store.website);
						});
						dfd.resolve();
					} else if (region.name == 'Online Traders') {
						$.each(region.value, function(key, val) {
							var store = region.value[key];
							var storeItem = '<li><ul>'+
							'<li>'+store.name+'</li>'+
							'<li><a href="'+store.website+'" target="_blank">Visit website</a></li></ul></li>';
							$(storeItem).appendTo('#online-listings');
							dfd.resolve();
						});
					}
				promises.push(dfd);
				});

				$.when.apply($, promises).then(function () {
					var clusterStyles = [
						{
							textColor: 'white',
							url: 'images/cluster1.png',
    						height: 52,
    						width: 53
						},
						{
							textColor: 'white',
							url: 'images/cluster2.png',
    						height: 52,
    						width: 53
						},
						{
							textColor: 'white',
							url: 'images/cluster3.png',
    						height: 52,
    						width: 53
						},
						{
							textColor: 'white',
							url: 'images/cluster4.png',
    						height: 52,
    						width: 53
						},
						{
							textColor: 'white',
							url: 'images/cluster5.png',
    						height: 52,
    						width: 53
						}
					]
					var mcOptions = {
						styles: clusterStyles,
					};
					var markerCluster = new MarkerClusterer(map, that.markers, mcOptions);
				});
			},
			error: function(xhr, status, error) {
				console.log(xhr, status, error);
			}
		});
	},

	addMarker: function(resultsMap, lat, lng, address, name, phone, website) {
		var that = this;
		var key = 'AIzaSyAGcse28lYcou-lUbmnLGRFGaGbElgFsPw';
		var iconBase = 'images/';
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h3>'+name+'</h3>'+
		'<div id="bodyContent">'+
		'<p id="address"><strong>Address:</strong> '+address+'</p>';
    if (phone != 'N/A') {
      contentString += '<p id="phone"><strong>Phone:</strong> '+phone+'</p>';
    }
    if (website != 'N/A') {
      contentString += '<p><a target="_blank" href='+website+'>Visit Website</a></p>';
    }
   console.log('this.userLat =', this.userLat);
    if (this.userLat !== null) {
      contentString += '<p><a target="_blank" href="http://maps.google.com/maps?saddr='+this.userLat+'&daddr='+this.userLng+'">Get Directions</a></p>';
    }
    contentString += '</div></div>';
		var marker = new google.maps.Marker({
			map: resultsMap,
			position: {lat: lat, lng: lng},
			icon: iconBase + 'icon.png'
		});
		marker.addListener('click', function() {
			if(that.infowindow){
				that.infowindow.close();
			}
			that.infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			that.infowindow.open(resultsMap, marker);
		});
		this.markers.push(marker);
	},

  updateRegion: function(e) {
	var that = this;
	var lat;
	var lng;
	var zoom;
	var changeRegion = $(e.currentTarget).val();
	var center;
	console.log('changeRegion = ',changeRegion);
	$.ajax({
			type: "GET",
			//url: "https://local.googlemaps.com/js/stores.json",
      		url: 'https://vinyldirectory.nz/js/stores.json',
			dataType: 'json',
			success: function (data) {

				$.each(data.regions, function(i, region) {
					if (changeRegion == region.name && changeRegion != 'Online Traders') {
						lat = region.lat;
						lng = region.lng;
						zoom = region.zoom;
					}
					else if (changeRegion == 'Online Traders' || changeRegion == 'All regions') {
						lat = -41.0155275;
						lng = 173.6358103;
						zoom = 5;
					}
					else {
						return;
					}
				});

				center = new google.maps.LatLng(lat, lng);
				map.panTo(center);
				map.setZoom(zoom);
			},
			error: function(xhr, status, error) {
				console.log(xhr, status, error);
			}
		});
  },
  updateTabs: function(e) {
	if ( !$(e.currentTarget).parent().hasClass('active') ) {
	  $('.nav').find('.active').removeClass('active');
	  $(e.currentTarget).parent().addClass('active');
	}

	if ( $('.nav .active').attr('id') == 'nav-tab--physical' ) {
	  $('#online').addClass('hidden');
	  $('#physical').removeClass('hidden');
	} else {
	  $('#physical').addClass('hidden');
	  $('#online').removeClass('hidden');
	}
  }
});

module.exports = AppView;
