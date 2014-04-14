var map;
var xmlHttpReq = null;
var selectedMarkerID;
var guestbookNameString = "";

//====================================================================================================================

function adjustMapHeight() {
	document.getElementById("map-canvas").style.height= screen.height - 300 + "px";
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//====================================================================================================================

function centerMapOnUser(currentMap, isLoggedIn)
{		
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
	        var longitude = position.coords.longitude;
	        var geolocation = new google.maps.LatLng(latitude, longitude);
	        centerMapOn(geolocation, currentMap);
	        addUserMarker(geolocation, currentMap, isLoggedIn);
		},showError,{timeout:5000, enableHighAccuracy: true});
	}
	else
	{
	  	handleNoGeolocationSupport();
	}
}

function addUserMarkerOnMap(currentMap, isLoggedIn)
{		
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
	        var longitude = position.coords.longitude;
	        var geolocation = new google.maps.LatLng(latitude, longitude);
	        addUserMarker(geolocation, currentMap, isLoggedIn);
		},showError,{timeout:5000, enableHighAccuracy: true});
	}
	else
	{
	  	handleNoGeolocationSupport();
	}
}

function centerMapOnSearch(currentMap, latitude, longitude, isCreated, isLoggedIn)
{		
	if (navigator.geolocation)
	{
		var geolocation = new google.maps.LatLng(latitude, longitude);
		if (!isCreated)
		{
			addSearchedMarker(geolocation, currentMap, isLoggedIn);			
		}
		centerMapOn(geolocation, currentMap);		
	}
	else
	{
	  	handleNoGeolocationSupport();
	}
}

function centerMapOn(location, currentMap) 
{
	currentMap.setCenter(location);
}

function showError(error)
{
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
	      geoField.value="User denied the request for Geolocation."
	      break;
	    case error.POSITION_UNAVAILABLE:
	      geoField.value="Location information is unavailable."
	      break;
	    case error.TIMEOUT:
	      geoField.value="The request to get user location timed out."
	      break;
	    case error.UNKNOWN_ERROR:
	      geoField.value="An unknown error occurred."
	      break;
    }
}

function handleNoGeolocationSupport() 
{
	alert("Geolocation not supported by your browser. User location not found.");
}

//====================================================================================================================
 
function addUserMarker(userLocation, currentMap, isLoggedIn) {
	var userIcon = '/resources/user.png'
	var marker = new google.maps.Marker({position: userLocation,
										 map: currentMap,
										 icon: userIcon,
										 title: 'Your Position'});	
	var lat = userLocation.lat();
	var lon = userLocation.lng();
	var contentString = "";	
	if (isLoggedIn) 
	{
		contentString = '<div class="HostMarkerInfo">' +
								'<form action="/hosting">' +
									'<div style="margin-bottom:10px">' +
										'Title<br>' + 
										'<input class="form-control" type="text" name="hostTitle"><br>' +
										'Rate ($/Hour)<br>' + 
										'<input class="form-control" type="number" name="rate"><br>' +
										'Description<br>' + 
										'<textarea class="form-control" name="hostMsg" rows="3" cols="30"></textarea>' +
									'</div>' +
									'<div>' +
										'<input type="submit" class="btn btn-success" value="Host This Location">' +
										'<input type="hidden" id="hostLatitude" value="' + lat + '" name="latitude">' +
								        '<input type="hidden" id="hostLongitude" value="' + lon + '" name="longitude">' +
							        '</div>' +
								'</form>' +
							'</div>';
	} else {
		contentString = '<div class="HostMarkerInfo">' +
							'<p>This is where you are.</p>' +
							'<p>Please log in to host this spot.</p>' +
						'</div>';
	}
	addInfowindow(marker, contentString);
}

function addSearchedMarker(searchLocation, currentMap, isLoggedIn) {
	var userIcon = '/resources/search.png';
	var marker = new google.maps.Marker({position: searchLocation,
										 map: currentMap,
										 icon: userIcon,
										 title: 'Your Position'});	
	var lat = searchLocation.lat();
	var lon = searchLocation.lng();
	var contentString = "";	
	if (isLoggedIn) 
	{
		contentString = '<div class="HostMarkerInfo">' +
								'<form action="/hosting">' +
									'<div style="margin-bottom:10px">' +
										'Title<br>' + 
										'<input class="form-control" type="text" name="hostTitle"><br>' +
										'Rate ($/Hour)<br>' + 
										'<input class="form-control" type="number" name="rate"><br>' +
										'Description<br>' + 
										'<textarea class="form-control" name="hostMsg" rows="3" cols="30"></textarea>' +
									'</div>' +
									'<div>' +
										'<input type="submit" class="btn btn-success" value="Host This Location">' +
										'<input type="hidden" id="hostLatitude" value="' + lat + '" name="latitude">' +
								        '<input type="hidden" id="hostLongitude" value="' + lon + '" name="longitude">' +
							        '</div>' +
								'</form>' +
							'</div>';
	} else {
		contentString = '<div class="HostMarkerInfo">' +
							'<p>This is where you searched.</p>' +
							'<p>Please log in to host this spot.</p>' +
						'</div>';
	}
	addInfowindow(marker, contentString);
}

function addAddressMarker(location, currentMap) {
	var addressIcon = 'https://maps.gstatic.com/mapfiles/ms2/micons/red-pushpin.png'
	var marker = new google.maps.Marker({position: location,
										 map: currentMap,
										 icon: addressIcon,
										 title: 'Your Position'});	
	var contentString = '<p>This is the address location</p>';
	addInfowindow(marker, contentString);
}

function addInfowindow(marker, content) {
	var infowindow = new google.maps.InfoWindow({
			content: content
	});
	google.maps.event.addListener(marker, 'click', function() {
		selectedMarkerID = marker.getTitle();
		infowindow.setContent(""+content);
		infowindow.setPosition(marker.getPosition());
		infowindow.open(marker.get('map'), marker);		
	});
}


//====================================================================================================================

