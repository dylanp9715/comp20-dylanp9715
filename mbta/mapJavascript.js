var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 42.352271, lng: -71.05524200000001},
		zoom:14
	});

	var stations = [
		{
			name: 'Alewife',
			position: new google.maps.LatLng(42.395428, -71.142483),
			stop_id: 'place-alfcl'
		},
		{
			name: 'Davis Square',
			position: new google.maps.LatLng(42.39674, -71.121815),
			stop_id: 'place-davis'
		},
		{
			name: 'Porter Square',
			position: new google.maps.LatLng(42.3884, -71.11914899999999),
			stop_id: 'place-portr'
		},
		{
			name: 'Harvard Square',
			position: new google.maps.LatLng(42.373362, -71.118956),
			stop_id: 'place-harsq'
		},
		{
			name: 'Central Square',
			position: new google.maps.LatLng(42.365486, -71.103802),
			stop_id: 'place-cntsq'
		},
		{
			name: 'Kendall/MIT',
			position: new google.maps.LatLng(42.36249079, -71.08617653),
			stop_id: 'place-knncl'
		},
		{
			name: 'Charles/MGH',
			position: new google.maps.LatLng(42.361166, -71.070628),
			stop_id: 'place-chmnl'
		},
		{
			name: 'Park Street',
			position: new google.maps.LatLng(42.35639457, -71.0624242),
			stop_id: 'place-pktrm'
		},
		{
			name: 'Downtown Crossing',
			position: new google.maps.LatLng(42.355518, -71.060225),
			stop_id: 'place-dwnxg'
		},
		{
			name: 'Broadway',
			position: new google.maps.LatLng(42.342622, -71.056967),
			stop_id: 'place-brdwy'
		},
		{
			name: 'Andrew',
			position: new google.maps.LatLng(42.330154, -71.057655),
			stop_id: 'place-andrw'
		},
		{
			name: 'JFK/UMass',
			position: new google.maps.LatLng(42.320685, -71.052391),
			stop_id: 'place-jfk'
		},
		{
			name: 'North Quincy',
			position: new google.maps.LatLng(42.275275, -71.029583),
			stop_id: 'place-nqncy'
		},
		{
			name: 'Wollaston',
			position: new google.maps.LatLng(42.2665139, -71.0203369),
			stop_id: 'place-wlsta'
		},
		{
			name: 'Quincy Center',
			position: new google.maps.LatLng(42.251809, -71.005409),
			stop_id: 'place-qnctr'
		},
		{
			name: 'Quincy Adams',
			position: new google.maps.LatLng(42.233391, -71.007153),
			stop_id: 'place-qamnl'
		},
		{
			name: 'Braintree',
			position: new google.maps.LatLng(42.2078543, -71.0011385),
			stop_id: 'place-brntn'
		},
		{
			name: 'Savin Hill',
			position: new google.maps.LatLng(42.31129, -71.053331),
			stop_id: 'place-shmnl'
		},
		{
			name: 'Fields Corner',
			position: new google.maps.LatLng(42.300093, -71.061667),
			stop_id: 'place-fldcr'
		},
		{
			name: 'Shawmut',
			position: new google.maps.LatLng(42.29312583, -71.06573796000001),
			stop_id: 'place-smmnl'
		},
		{
			name: 'Ashmont',
			position: new google.maps.LatLng(42.284652, -71.06448899999999),
			stop_id: 'place-asmnl'
		},
	];

	drawMap(stations);
}

function drawMap(stations) {
	// Holds lat and lng coordinates of each station for the polyline
	var coordArr = new Array();

	var infoWindow = new google.maps.InfoWindow();
	var stationMarker, i;
	

	// Fill coordArr with coordinates to draw polyline and create markers for each station
	for (i = 0; i < stations.length; i++) {
		coordArr.push(stations[i].position);
		stationMarker = new google.maps.Marker({
			position: stations[i].position,
			icon: 'tsymbol.png',
			map: map
		});

		var curr_stop_id = stations[i].stop_id;
		google.maps.event.addListener(stationMarker, 'click', (function(curr_stop_id) {
			return function() {
				var url = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + curr_stop_id;

				request = new XMLHttpRequest();
				request.open("GET", url, true);
				console.log(url);

				console.log(request.readyState);

				request.onreadystatechange = function() {
					if (request.readyState == 4 && request.status == 200) {
						console.log("HERE");
						theData = request.responseText;
						stationInfo = JSON.parse(theData);
						console.log(stationInfo);
						returnHTML = "<ul>";
						for (var i = 0; i < stationInfo.length; i++) {
							console.log(i);
							returnHTML += stationInfo["arrival_time"];
						}
						returnHTML += "</ul";
					
						infoWindow.setContent(returnHTML);
						infoWindow.open(map, stationMarker);
					}
				}
				request.send();
			}
		})(curr_stop_id));
	}

	// Create the polyline object using position of each station
	var redLinePath = new google.maps.Polyline({
		path: coordArr,
		strokeColor: '#FF0000'
	});

	
	// Find user's current location and place on map
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			
			var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			
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
}

