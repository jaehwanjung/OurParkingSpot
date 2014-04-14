var isLoggedIn;
var map;
//====================================================================================================================

function adjustMapHeight() {
	document.getElementById("map-canvas").style.height= screen.height - 300 + "px";
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//====================================================================================================================

function centerMapOnUser()
{		
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
	        var longitude = position.coords.longitude;
	        var geolocation = new google.maps.LatLng(latitude, longitude);
	        addUserMarker(geolocation, map, isLoggedIn);
	        centerMapOn(geolocation, map);	        
		},showError,{timeout:5000, enableHighAccuracy: true});
	}
	else
	{
	  	handleNoGeolocationSupport();
	}
}

function addUserMarkerOnMap()
{		
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
	        var longitude = position.coords.longitude;
	        var geolocation = new google.maps.LatLng(latitude, longitude);
	        addUserMarker(geolocation, map, isLoggedIn);
		},showError,{timeout:5000, enableHighAccuracy: true});
	}
	else
	{
	  	handleNoGeolocationSupport();
	}
}

function centerMapOnSearch(latitude, longitude, isCreated)
{		
	if (navigator.geolocation)
	{
		var geolocation = new google.maps.LatLng(latitude, longitude);
		if (!isCreated)
		{
			addSearchedMarker(geolocation, map, isLoggedIn);			
		}
		centerMapOn(geolocation, map);		
	}
	else
	{
	  	handleNoGeolocationSupport();
	}
}

function centerMapOn(location) 
{
	map.setCenter(location);
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
 
function addUserMarker(userLocation) {
	var userIcon = '/resources/user.png'
	var marker = new google.maps.Marker({position: userLocation,
										 map: map,
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

function addSearchedMarker(searchLocation) {
	var userIcon = '/resources/search.png';
	var marker = new google.maps.Marker({position: searchLocation,
										 map: map,
										 icon: userIcon,
										 title: 'Searched Position'});	
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

function loadMarkers() {
	try {
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.onreadystatechange = httpCallBackFunction_loadMarkers;
		xmlHttpReq.open('GET', "/markerQuery", true);
    	xmlHttpReq.send(null);
	} catch (e) {
    	alert("Error: " + e);
	}		
}

function httpCallBackFunction_loadMarkers() {
	if (xmlHttpReq.readyState == 4){
		
		var xmlDoc = null;

		if(xmlHttpReq.responseXML){
			xmlDoc = xmlHttpReq.responseXML;
		}else if(xmlHttpReq.responseText){
			var parser = new DOMParser();
		 	xmlDoc = parser.parseFromString(xmlHttpReq.responseText,"text/xml");			 	
		}

		if(xmlDoc){										
			var markerElements = xmlDoc.getElementsByTagName('marker');
			var contentString = "";
			for(mE = 0; mE < markerElements.length; mE++) {
				var markerElement = markerElements[mE];
				var hostUser = markerElement.getAttribute("hostUser");
				var title = markerElement.getAttribute("title");
				var rate = markerElement.getAttribute("rate");
				var hostedDate = markerElement.getAttribute("hostedDate");
				var msg = markerElement.getAttribute("msg");
				var latitude = markerElement.getAttribute("latitude");
				var longitude = markerElement.getAttribute("longitude");
				var bookedDate = markerElement.getAttribute("bookedDate");
				var bookedBy = markerElement.getAttribute("bookedBy");
				var bookedFrom = markerElement.getAttribute("bookedFrom");
				var bookedTo = markerElement.getAttribute("bookedTo");
				
				if (isLoggedIn) 
				{
					contentString = '<div class="HostMarkerInfo">' +
										'<p>Hosted by : ' + hostUser + '</p><br>' +
										'<p>Title : ' + title + '</p><br>' +
										'<p>Rate : ' + rate + '</p><br>' +
										'<p>Hosted on : ' + hostedDate + '</p><br>' +
										'<p>Description : ' + msg + '</p><br>' +
										'<p>Latitude : ' + latitude + '</p><br>' +
										'<p>Longitude : ' + longitude + '</p><br>' +
										'<p>Booked on : ' + bookedDate + '</p><br>' +
										'<p>Booked by : ' + bookedBy + '</p><br>' +
										'<p>Booked from : ' + bookedFrom + '</p><br>' +
										'<p>Booked to : ' + bookedTo + '</p><br>'
									'</div>';
				} else {
					contentString = '<div class="HostMarkerInfo">' +
										'<p>Please log in to book this spot.</p>' +
									'</div>';
				}
														
				var spotIcon;
				
				if (bookedBy == "") {
					spotIcon = '/resources/unbookedSpot.png';
				} else {
					spotIcon = '/resources/bookedSpot.png';
				}
				
				var geolocation = new google.maps.LatLng(latitude, longitude);
				var marker = new google.maps.Marker({position: geolocation,
													 map: map,
													 icon: spotIcon,
													 title: title});	
				
				addInfowindow(marker, contentString);
			}			
		}else{
			alert("No data.");
		}	
	}		
}
