// DO NOT MESS WITH THIS COPY 07/31/15  10:45AM WORKING SEARCH

var selectedTypes, loc, radius;
var longi;
var lati;
var googleFusionAPIKey =  "AIzaSyD2NeLNyyuB9aMfKH8J6hZgTWW6j8c0u5Q";
var accessTableFusionId = "1zuRMjqvXx8gNz58R7vTNJL-iJV9XcqNsgTVR8_0";
var foursquareLink="https://api.foursquare.com/v2/venues/search?client_id=GKDPD1IUYV4LCURJXQAODYV31F4D5CZWGSJTIXYDTHE5FZTS&client_secret=DXRQOP23405OT0AYWUSEKT4GQAXAF00MIM1T4TRSG4HWGJ3V&v=20150724&m=foursquare&"
var googleLink;
var locationArray = [];
var map, myLayer, geojson;


$("document").ready(function(){

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude);
      console.log('More or less ' + crd.accuracy + ' meters.');

      longi = crd.longitude;
      lati = crd.latitude;
      initializeMap();

    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, {timeout: 10000});

    $('#sub').click(function(event)
    {
        event.preventDefault();

        loc = $('#loc').val();
        place = $('#place').val();

        var value = $("input:checkbox:checked").map(function(){
            return this.value;
        }).get();
        selectedTypes = value;
        createLink();

    });

});

 

// code for the map initialize
var initializeMap = function()
{
    L.mapbox.accessToken = 'pk.eyJ1IjoiamVmZnN0ZXJuIiwiYSI6IlAzRFFiN0EifQ.mNWvayrLEw9wULuq0sopyA';
    map = L.mapbox.map('map', 'mapbox.streets').setView([longi, lati], 9);
    //var map = L.mapbox.map('map', 'mapbox.streets').setView([38, -76], 9);

    myLayer = L.mapbox.featureLayer().addTo(map);

    geojson = { 
        type: 'FeatureCollection',

        // This is an array of Map Point objects
        features: [
        {
            type: 'Feature',
            properties: {
                title: 'Current Location',
                description: 'Where you are right now',
                'marker-color': '#FF7722',
                'marker-size': 'large',
                'marker-symbol': 'marker',
            },
            geometry: {
                type: 'Point',
                coordinates: [longi, lati]
             //    coordinates:[38, -76]
            }
        },
        ]
    };


    myLayer.setGeoJSON(geojson); // Adds all of the points to the map

    // Makes sure that map's initial zoom contains all of the points
    map.on('ready', function() {
        map.fitBounds(myLayer.getBounds());
    });
};

// code for the map initialize
var updateMap = function()
{
    var places = [];

    for(var i = 0; i < locationArray.length; i++)
    {
        var marker = 
        {
          type: "Feature",
          properties: 
          {
              title: locationArray[i].quantity.name,
              description: 'place to go',
              'marker-color': '#FF7722',
              'marker-size': 'large',
              'marker-symbol': 'marker'
          },
          geometry: 
          {
              type: 'Point',
              coordinates: [locationArray[i].quantity.location.lng, locationArray[i].quantity.location.lat]
          }
        };

        places.push(marker);
    }

    //create a geojson file from our places array
    geojson = { type: 'FeaturesCollection', features: places};
    //call function that sets up the map

    myLayer.setGeoJSON(geojson); // Adds all of the points to the map
    console.log("i have refreshed the json");
    // Makes sure that map's initial zoom contains all of the points

    map.fitBounds(myLayer.getBounds());

};



// submit button code
var createLink = function()
{
    //add la/ lo to the link
    foursquareLink += "ll=" + lati + "," + longi + "%20";

    // add type of venue to query to the link
    foursquareLink += "&query=" + place + "%20";

    //add the radius around current location to the link
    foursquareLink += "&radius=" + 16000;

    console.log(foursquareLink);

    // call function to get the data
    // put ajax code here
    $.ajax({
      type: 'GET',
      url: foursquareLink,
      //may be able to not use these two
      dataType: "jsonp",
      crossDomain: true,
      //this happens when you get a successful response. 
      success: function (data) {

          //data.response.venues is the array
          for(var i = 0; i < data.response.venues.length; i++)
          {
            var venue = {};
            venue.id = data.response.venues[i].id;
            venue.quantity = data.response.venues[i];
            locationArray.push(venue);
            console.log(locationArray[i].quantity.name);
          }
        updateMap();

      },
      error: function (request, status, error) {

          alert("There is an error loading the API information from Foursquare");
      }
    });

    var sortCols="";

    if(selectedTypes.length<1)
    {
        alert("Please select what type of facilities you would like to see");
    }
    if(selectedTypes.indexOf("wheelchair") != -1)
    {
        sortCols += ",%27building-entry%27";
    }
    if(selectedTypes.indexOf("visual") != -1)
    {
        sortCols += ",%27braille-signage%27";
    }
    if(selectedTypes.indexOf("deaf") != -1)
    {
        sortCols += ",%27background-noise%27";
    }

    var categ = sortCols.substring(1, sortCols.length);
    
   googleLink = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20" + categ + "%20FROM%20" + accessTableFusionId + "&key=" + googleFusionAPIKey;
    console.log(googleLink);



};


//ll=40.7,-74%20&query=library%20"; // more & radius and such, api parameters 

// string to represent a swhere clause

// var ids = "(";
// loop for all objects returned by 4square ids index to find foursquare id
// append to the string and process end
// ll = longitude and latutude
// add radius=number of meters
// intent, defaults to check in, intent=browse 
// change the ll, change the 


