var Backbone = require('backbone');

var AppView = Backbone.View.extend({
  el: 'body',

   events: {
     "change select": "updateRegion",
     "click .nav > li > a": "updateTabs"
  },

	initialize: function() {
		this.initMap();
		this.infowindow = null;
    this.map = null;
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

	getListings: function() {
		var that = this;

		$.ajax({
			type: "GET",
			url: "http://vinyldirectory.nz/js/stores.json",
			dataType: 'json',
			success: function (data) {

				$.each(data.regions, function(i, region) {

					$('select').append('<option value="'+region.name+'">'+region.name+'</option>');
					if (region.name != 'Online Traders') {
						$.each(region.value, function(key, val) {
							var store = region.value[key];
							that.addMarker(map, store.lat, store.lng, store.address, store.name, store.phone, store.website);
						});
					} else if (region.name == 'Online Traders') {
            $.each(region.value, function(key, val) {
							var store = region.value[key];
              var storeItem = '<li><ul>'+
              '<li>'+store.name+'</li>'+
              '<li><a href="'+store.website+'" target="_blank">Visit website</a></li></ul></li>';
              $(storeItem).appendTo('#online-listings');
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
    var that = this;
		var key = 'AIzaSyAGcse28lYcou-lUbmnLGRFGaGbElgFsPw';
		var iconBase = 'images/';
		var contentString = '<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h3>'+name+'</h3>'+
		'<div id="bodyContent">'+
		'<p><strong>Address:</strong> '+address+'</p>'+
		'<p><strong>Phone:</strong> '+phone+'</p>'+
		'<p><a target="_blank" href='+website+'>Visit Website</a></p>'+
		'</div>'+
		'</div>';
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
			url: "http://vinyldirectory.nz/js/stores.json",
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
