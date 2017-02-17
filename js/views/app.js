var Backbone = require('backbone');

var AppView = Backbone.View.extend({
  el: 'body',
  initialize: function() {
    var username = 'silentdesigns';
    var password = 'vbkmr6d28vjw';
    // $.ajax({
    //   url: 'http://api.eventfinda.co.nz/v2/events.json',
    //   beforeSend: function (xhr) {
    //     xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    //   },
    //   success: function(xhr) {
    //     console.log(xhr);
    //   }
    // });

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
            });
        },
        error: function(data, textStatus, errorThrown) {
          console.log('error');
        }
    });
  }
});

module.exports = AppView;
