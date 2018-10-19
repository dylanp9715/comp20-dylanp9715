var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 42.352271, lng: -71.05524200000001},
		zoom:14
	});

	var stations = [
		{
			name: 'Alewife',
			position: new google.maps.LatLng(42.395428, -71.142483)
		},
		{
			name: 'Davis',
			position: new google.maps.LatLng(42.39674, -71.121815)
		},
		{
			name: 'Porter',
			position: new google.maps.LatLng(42.3884, -71.11914899999999)
		},
		{
			name: 'Harvard',
			position: new google.maps.LatLng(42.373362, -71.118956)
		},
		{
			name: 'Central',
			position: new google.maps.LatLng(42.365486, -71.103802)
		},
		{
			name: 'Kendall/MIT',
			position: new google.maps.LatLng(42.36249079, -71.08617653)
		},
		{
			name: 'Charles/MGH',
			position: new google.maps.LatLng(42.361166, -71.070628)
		},
		{
			name: 'Park Street',
			position: new google.maps.LatLng(42.35639457, -71.0624242)
		},
		{
			name: 'Downtown Crossing',
			position: new google.maps.LatLng(42.355518, -71.060225)
		},
		{
			name: 'Broadway',
			position: new google.maps.LatLng(42.342622, -71.056967)
		},
		{
			name: 'Andrew',
			position: new google.maps.LatLng(42.330154, -71.057655)
		},
		{
			name: 'JFK/UMass',
			position: new google.maps.LatLng(42.320685, -71.052391)
		},
		{
			name: 'North Quincy',
			position: new google.maps.LatLng(42.275275, -71.029583)
		},
		{
			name: 'Wollaston',
			position: new google.maps.LatLng(42.2665139, -71.0203369)
		},
		{
			name: 'Quincy Center',
			position: new google.maps.LatLng(42.251809, -71.005409)
		},
		{
			name: 'Quincy Adams',
			position: new google.maps.LatLng(42.233391, -71.007153)
		},
		{
			name: 'Braintree',
			position: new google.maps.LatLng(42.2078543, -71.0011385)
		},
		{
			name: 'Savin Hill',
			position: new google.maps.LatLng(42.31129, -71.053331)
		},
		{
			name: 'Fields Corner',
			position: new google.maps.LatLng(42.300093, -71.061667)
		},
		{
			name: 'Shawmut',
			position: new google.maps.LatLng(42.29312583, -71.06573796000001)
		},
		{
			name: 'Ashmont',
			position: new google.maps.LatLng(42.284652, -71.06448899999999)
		},
	];

	drawMap(stations);
}

function drawMap(stations) {
	// Holds lat and lng coordinates of each station for the polyline
	var coordArr = new Array();

	// Fill coordArr to draw polyline and create markers for each station
	for (var i = 0; i < stations.length; i++) {
		coordArr.push(stations[i].position);
		var stationMarker = new google.maps.Marker({
			position: stations[i].position,
			icon: 'tsymbol.png',
			map: map
		});
	}

	// Create the polyline object using position of each station
	var redLinePath = new google.maps.Polyline({
		path: coordArr,
		strokeColor: '#FF0000'
	});

	
	// Find user's current location and place on map
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			
			var currentLocation = new google.maps.LatLng(position.coords.latitude, 
														 position.coords.longitude);
			
			var userMarker = new google.maps.Marker({
				position: currentLocation,
				map: map

			});

		});
	} else {
		alert("Error: The geolocation service failed");
	}

	// Set map with red polyline and markers for both user and station locations
	redLinePath.setMap(map);
	stationMarker.setMap(map);
	userMarker.setMap(map);

	generateInfoWindow(stationMarker);
}

function generateInfoWindow(stationMarker) {

	stationMarker.addEventListener('onclick', function() {
		request = new XMLHttpRequest();
		request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=stop_id", true);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				theData = request.responseText;
				
			}
		}
		
		var infoWindow = new google.maps.InfoWindow({
			content: contentString
		});
	})
}