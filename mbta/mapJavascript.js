var map;

// initMap() initializes the map, creates the stations array, and calls a function to draw the map itself
function initMap() {

    // Create the map and center it on South Station
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom:13
    });

    // Initialize infoWindow so only one appears at one time
    infoWindow = new google.maps.InfoWindow();

    // Create an array of stations that contain its name, position, and stop id
    stations = [
        {name: 'Alewife', position: new google.maps.LatLng(42.395428, -71.142483), stop_id: 'place-alfcl'},
        {name: 'Davis Square', position: new google.maps.LatLng(42.39674, -71.121815), stop_id: 'place-davis'},
        {name: 'Porter Square', position: new google.maps.LatLng(42.3884, -71.11914899999999), stop_id: 'place-portr'},
        {name: 'Harvard Square', position: new google.maps.LatLng(42.373362, -71.118956), stop_id: 'place-harsq'},
        {name: 'Central Square', position: new google.maps.LatLng(42.365486, -71.103802), stop_id: 'place-cntsq'},
        {name: 'Kendall/MIT', position: new google.maps.LatLng(42.36249079, -71.08617653), stop_id: 'place-knncl'},
        {name: 'Charles/MGH', position: new google.maps.LatLng(42.361166, -71.070628), stop_id: 'place-chmnl'},
        {name: 'Park Street', position: new google.maps.LatLng(42.35639457, -71.0624242), stop_id: 'place-pktrm'},
        {name: 'Downtown Crossing', position: new google.maps.LatLng(42.355518, -71.060225), stop_id: 'place-dwnxg'},
        {name: 'Broadway', position: new google.maps.LatLng(42.342622, -71.056967), stop_id: 'place-brdwy'},
        {name: 'Andrew', position: new google.maps.LatLng(42.330154, -71.057655), stop_id: 'place-andrw'},
        {name: 'JFK/UMass',position: new google.maps.LatLng(42.320685, -71.052391), stop_id: 'place-jfk'},
        {name: 'North Quincy', position: new google.maps.LatLng(42.275275, -71.029583), stop_id: 'place-nqncy'},
        {name: 'Wollaston', position: new google.maps.LatLng(42.2665139, -71.0203369), stop_id: 'place-wlsta'},
        {name: 'Quincy Center', position: new google.maps.LatLng(42.251809, -71.005409), stop_id: 'place-qnctr'},
        {name: 'Quincy Adams', position: new google.maps.LatLng(42.233391, -71.007153), stop_id: 'place-qamnl'},
        {name: 'Braintree', position: new google.maps.LatLng(42.2078543, -71.0011385), stop_id: 'place-brntn'},
        {name: 'Savin Hill', position: new google.maps.LatLng(42.31129, -71.053331), stop_id: 'place-shmnl'},
        {name: 'Fields Corner', position: new google.maps.LatLng(42.300093, -71.061667), stop_id: 'place-fldcr'},
        {name: 'Shawmut', position: new google.maps.LatLng(42.29312583, -71.06573796000001), stop_id: 'place-smmnl'},
        {name: 'Ashmont', position: new google.maps.LatLng(42.284652, -71.06448899999999), stop_id: 'place-asmnl'},
    ];
    drawMap();
}

// drawMap() draws the polylines and calls on functions to create the markers at each station
function drawMap() {

    // Holds lat and lng coordinates of each station for the polyline
    var braintreeArray = new Array();
    var ashmontArray = new Array();
    
    // Fill braintreeArray and ashmontArray with coordinates to draw polyline and create markers for each station
    for (var i = 0; i < stations.length - 4; i++) {
        braintreeArray.push(stations[i].position);
        createMarker(i);
    }

    // Necessary to connect JFK/UMass station to the Ashmont path
    ashmontArray.push(stations[11].position);

    for (var j = stations.length - 4; j < stations.length; j++) {
        ashmontArray.push(stations[j].position);
        createMarker(j);
    }

    // Create the polyline object using position of each station for the braintree and ashmont paths
    var braintreePath = new google.maps.Polyline({
        path: braintreeArray,
        strokeColor: '#FF0000'
    });

    var ashmontPath = new google.maps.Polyline({
        path: ashmontArray,
        strokeColor: '#FF0000'
    });

    braintreePath.setMap(map);
    ashmontPath.setMap(map);

    getMyLocation(stations);
}

// createMarker() creates a marker for each station and adds a listener to create and populate an infowindow if a marker is clicked
function createMarker(i) {

    // Create a marker for the current station with a custom icon
    var stationMarker = new google.maps.Marker({
        position: stations[i].position,
        icon: 'tsymbol.png',
        map: map
    });

    // Extract stop id for JSON retrieval and name of station for the infowindow
    var curr_stop_id = stations[i].stop_id;
    var stationName = stations[i].name;

    // Anytime the station marker is clicked...
    google.maps.event.addListener(stationMarker, 'click', (function(curr_stop_id, stationName) {
        return function() {

            // Make instance of XHR object to make HTTP request after page is loaded
            request = new XMLHttpRequest();
            
            // Open the JSON file at remote location
            request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + curr_stop_id, true);

            // Set up callback for when HTTP response is returned
            request.onreadystatechange = (function(stationName) {
                return function() {

                    // Create empty strings for infowindow data
                    var arrivalTime = " ";
                    var direction = " ";

                    if (request.readyState == 4 && request.status == 200) {
                        // When we get JSON data back, parse it
                        theData = request.responseText;
                        stationInfo = JSON.parse(theData);
                        returnHTML = "This stop is: ";
                        
                        // If there is data for this station...
                        if (stationInfo["data"].length != 0) {
                            // Go through JSON object and extract arrival times and direction to place inside infowindow
                            for (var i = 0; i < stationInfo["data"].length; i++) {
                                if (stationInfo["data"][i]["attributes"]["arrival_time"] != null) {
                                    arrivalTime += stationInfo["data"][i]["attributes"]["arrival_time"].slice(11,16) + "<br/>";

                                    if (stationInfo["data"][i]["attributes"]["direction_id"] == 0) {
                                        direction += "Southbound" + "<br/>";
                                    } else {
                                        direction += "Northbound" + "<br/>";
                                    }
                                } else {
                                    arrivalTime += "TBD" + "<br/>";
                                    direction += "TBD" + "<br/>"
                                }
                            }

                            returnHTML = returnHTML + stationName + "<p>Here is the upcoming schedule: </p>" + "<p class='left'>" + "<u>Time of Arrival</u>" + "<br/>" + arrivalTime + "</p>"+ "<p class='right'>" + "<u>Direction</u>" + "<br/>" + direction + "</p>";
                        } else {
                            returnHTML = "Arrival times for this station are currently unavailable.";
                        }
                        infoWindow.setContent(returnHTML);
                        infoWindow.open(map, stationMarker);
                    }
                }
            })(stationName);
            
            // Send the request
            request.send();
        }
    })(curr_stop_id, stationName));
}

/**
 * getMyLocation() finds the user's current location, places a marker there, draws a polyline to the closest station, and creates an infowindow if marker is clicked
 * indicating the distance to that station in miles
 */
function getMyLocation() {

    // Find user's current location and place on map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            // Find user's current location
            var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
            // Place marker at user's current location
            var userMarker = new google.maps.Marker({
                position: currentLocation,
                map: map
            });

            // Center current location when found
            map.panTo(currentLocation);

            // Find which station is closest to user by calculating the shortest distance between user and each station
            var smallestDistance = google.maps.geometry.spherical.computeDistanceBetween(currentLocation, stations[0].position) * 0.000621371192;

            for (var i = 0; i < stations.length; i++) {
                if (google.maps.geometry.spherical.computeDistanceBetween(currentLocation, stations[i].position) * 0.000621371192 < smallestDistance) {
                    smallestDistance = google.maps.geometry.spherical.computeDistanceBetween(currentLocation, stations[i].position) * 0.000621371192;
                    closestStation = stations[i];
                }
            }

            // Create arrays to draw polyline between user's current position and closest station
            var closestStationArray = new Array();
            closestStationArray.push(currentLocation);
            closestStationArray.push(closestStation.position);

            var meToStation = new google.maps.Polyline({
                path: closestStationArray,
                strokeColor: '#000080'
            });

            // Rounds to four decimal places
            smallestDistance = Math.round(smallestDistance * 10000) / 10000;

            // Create infowindow for user's current location marker which, when clicked upon, indicates closest station
            infoWindowData = "You are closest to " + closestStation.name + " and it is " + smallestDistance + " miles away";

            google.maps.event.addListener(userMarker, 'click', function() {
                infoWindow.setContent(infoWindowData);
                infoWindow.open(map, userMarker);   
            });

            meToStation.setMap(map);
        });
    } else {
        alert("Error: The geolocation service failed");
    }
}