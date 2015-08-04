// COPY TO MESS WITH


var selectedTypes, loc, radius;
var longi;
var lati;
var googleGeoCodeAPIKey = "AIzaSyAo2fOi3pBK404sfrRnzJc2zQN31eqJsrY";
var googleFusionAPIKey =  "AIzaSyD2NeLNyyuB9aMfKH8J6hZgTWW6j8c0u5Q";
var accessTableFusionId = "1zuRMjqvXx8gNz58R7vTNJL-iJV9XcqNsgTVR8_0";
var foursquareLink="https://api.foursquare.com/v2/venues/search?client_id=GKDPD1IUYV4LCURJXQAODYV31F4D5CZWGSJTIXYDTHE5FZTS&client_secret=DXRQOP23405OT0AYWUSEKT4GQAXAF00MIM1T4TRSG4HWGJ3V&v=20150724&m=foursquare&"
var googleLink = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%20" + accessTableFusionId + "%20WHERE%20foursquareID%20IN%20(";
var googleGeoLink = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var locationArray = [];
var atArray = [];
var map, myLayer, geojson;
var showWheel = false;
var showBlind = false;
var showHear = false;
var rad;

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
      // lati = 40.7127;
      // longi = -74.0059;
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
        rad = $('#rad').val();
        var value = $("input:checkbox:checked").map(function(){
            return this.value;
        }).get();
        selectedTypes = value;
        reset();
        setCurrLoc();

    });

});

var setCurrLoc = function()
{
  if(loc != "")
  {
    googleGeoLink += loc + "&key=" + googleGeoCodeAPIKey;
    googleGeoLink = googleGeoLink.replace(/ /g, "+");
    $.getJSON(googleGeoLink, function (data) 
    {
      longi = data.results[0].geometry.location.lng;
      lati = data.results[0].geometry.location.lat;
      
    });
  }
  createLink();
  
  console.log("googleGeoLink is ");
  console.log(googleGeoLink);

};



var reset = function()
{
  foursquareLink="https://api.foursquare.com/v2/venues/search?client_id=GKDPD1IUYV4LCURJXQAODYV31F4D5CZWGSJTIXYDTHE5FZTS&client_secret=DXRQOP23405OT0AYWUSEKT4GQAXAF00MIM1T4TRSG4HWGJ3V&v=20150724&m=foursquare&";
  googleLink = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%20" + accessTableFusionId + "%20WHERE%20foursquareID%20IN%20(";
  googleGeoLink = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  locationArray = [];
  showWheel = false;
  showBlind = false;
  showHear = false;
};
 

// code for the map initialize
var initializeMap = function()
{
    L.mapbox.accessToken = 'pk.eyJ1IjoiamVmZnN0ZXJuIiwiYSI6IlAzRFFiN0EifQ.mNWvayrLEw9wULuq0sopyA';
    map = L.mapbox.map('map', 'mapbox.streets').setView([longi, lati], 9);
    //map = L.mapbox.map('map', 'mapbox.streets').setView([40.7127, -74.0059], 9);

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
               //coordinates:[40.7127, -74.0059]
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
    var places = [{
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
               //coordinates:[40.7127, -74.0059]
            }
        }];

    var wc, b, bg;
     
    for(var i = 0; i < locationArray.length; i++)
    {
      // var url = 'http://maps.google.com/?q=' + locationArray[i].quantity.location.address + " " +  locationArray[i].quantity.location.city;
      // url = url.replace(/ /g, "+");

      var url = "http://maps.google.com/maps?saddr=" + "my+location" + "&daddr=" + locationArray[i].quantity.location.address + " " +  locationArray[i].quantity.location.city;
      url = url.replace(/ /g, "+");

      var urlfromloc = "http://maps.google.com/maps?saddr=" + loc + "&daddr=" + locationArray[i].quantity.location.address + " " +  locationArray[i].quantity.location.city;
      urlfromloc = urlfromloc.replace(/ /g, "+");

      if(i%3 == 0)
      {
        wc = "yes";
        b = "no";
        bg = "yes";
      } 
      else if(i%3 == 1)
      {
        wc = "no";
        b = "yes";
        bg = "no";
      }
      else
      {
        wc = "yes";
        b = "yes";
        bg = "yes";
      }

      var des = locationArray[i].quantity.location.address + " " +  locationArray[i].quantity.location.city + ", " + locationArray[i].quantity.location.state + " " + locationArray[i].quantity.location.postalCode;

      if(showWheel)
      {
        des += "<br> Wheelchair Accessible: "+ wc;
      }
      if(showBlind)
      {
        des += "<br> Braille-signage: " + b;
      }
      if(showHear)
      {
        des += "<br>Background-noise: " + bg;
      }

        var marker = 
        {
          type: "Feature",
          properties: 
          { 
              title: locationArray[i].quantity.name,
              // description: locationArray[i].quantity.location.address + " " +  locationArray[i].quantity.location.city + ", " + locationArray[i].quantity.location.state + " " + locationArray[i].quantity.location.postalCode + "<br> Wheelchair Accessible:"+ wc + "<br> Braille-signage: " + b + "<br>Background-noise: " + bg + '<a href="' + url + '" target ="_blank"><br>Go!</a>',
              description: des + '<a href="' + url + '" target ="_blank"><br>Go!</a>' + '<a href="' + urlfromloc + '" target ="_blank"><br>Go from search location!</a>',
              'marker-color': '#C2C2FF',
              'marker-size': 'large',
              'marker-symbol': 'marker',
              'url': url
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

    if(rad != "")
    {
      foursquareLink += "&radius=" + rad;
    }
    else
    {
      foursquareLink += "&radius=" + 2000;
    }

    //  populates the locationArray and later populates the google array
    setFoursquareArray();

    if(selectedTypes.length<1)
    {
        alert("Please select what type of facilities you would like to see");
    }
    if(selectedTypes.indexOf("wheelchair") != -1)
    {
      showWheel = true;
    }
    if(selectedTypes.indexOf("visual") != -1)
    {
      showBlind = true;
    }
    if(selectedTypes.indexOf("deaf") != -1)
    {
      showHear = true;
    }

};


var setFoursquareArray = function()
{
  $.ajax({
      type: 'GET',
      url: foursquareLink,
      //may be able to not use these two
      dataType: "jsonp",
      crossDomain: true,
      //this happens when you get a successful response. 
      success: function (data) {

          var idQuery = "";
          //data.response.venues is the array
          for(var i = 0; i < data.response.venues.length; i++)
          {
            var venue = {};
            venue.id = data.response.venues[i].id;
            venue.quantity = data.response.venues[i];
            locationArray.push(venue);
            idQuery += "%27" + data.response.venues[i].id + "%27,"
            console.log(locationArray[i].quantity.name);
          }
        updateMap();
        console.log(locationArray);
        googleLink += idQuery.substring(0, idQuery.length-1) + ")&key=" + googleFusionAPIKey;
        console.log(googleLink);
        setGoogleArray();
      },
      error: function (request, status, error) {

          alert("There is an error loading the API information from Foursquare");
      }
    });
};

var setGoogleArray = function(){

$.ajax({
      type: 'GET',
      url: googleLink,
      //may be able to not use these two
      dataType: "jsonp",
      crossDomain: true,
      //this happens when you get a successful response. 
      success: function (data) 
      {
        atArray = data;        
      },
      error: function (request, status, error) 
      {
          alert("There is an error loading the API information from Google");
      }
    });

};