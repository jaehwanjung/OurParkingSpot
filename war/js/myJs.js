var map;
var xmlHttpReq = null;
var selectedMarkerID;
var guestbookNameString = "";

//====================================================================================================================

function adjustMapHeight() {
	document.getElementById("map-canvas").style.height= screen.height - 300 + "px";
}

//====================================================================================================================

function centerMapOnUser(currentMap)
{		
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
	        var longitude = position.coords.longitude;
	        var geolocation = new google.maps.LatLng(latitude, longitude);
	        centerMapOn(geolocation, currentMap);
	        addUserMarker(geolocation, currentMap);
		},showError,{timeout:5000, enableHighAccuracy: true});
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
 
function addUserMarker(userLocation, currentMap) {
	var userIcon = 'https://maps.gstatic.com/mapfiles/ms2/micons/ltblue-dot.png'
	var marker = new google.maps.Marker({position: userLocation,
										 map: currentMap,
										 icon: userIcon,
										 title: 'Your Position'});	
	var contentString = '<p>This is your location</p>';
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

function addInfoWindow(marker, content) {
	var infowindow = new google.maps.InfoWindow({content: content});
	google.maps.event.addListener(marker, 'click', function() {
		selectedMarkerID = marker.getTitle();
		infowindow.setContent(""+content);
		infowindow.setPosition(marker.getPosition());
		infowindow.open(marker.get('map'), marker);		 
	});
}

//====================================================================================================================

function loadMarkers() {
	//alert("loadMarkers");
	try {
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.onreadystatechange = httpCallBackFunction_loadMarkers;
		var url = "/resources/markers.xml";
	
		xmlHttpReq.open('GET', url, true);
    	xmlHttpReq.send(null);
    	
    	//alert();
    	
	} catch (e) {
    	alert("Error: " + e);
	}	
}

function httpCallBackFunction_loadMarkers() {
	//alert("httpCallBackFunction_loadMarkers");
	
	if (xmlHttpReq.readyState == 1){
		//updateStatusMessage("<blink>Opening HTTP...</blink>");
	}else if (xmlHttpReq.readyState == 2){
		//updateStatusMessage("<blink>Sending query...</blink>");
	}else if (xmlHttpReq.readyState == 3){ 
		//updateStatusMessage("<blink>Receiving...</blink>");
	}else if (xmlHttpReq.readyState == 4){
		var xmlDoc = null;

		if(xmlHttpReq.responseXML){
			xmlDoc = xmlHttpReq.responseXML;
		}else if(xmlHttpReq.responseText){
			var parser = new DOMParser();
		 	xmlDoc = parser.parseFromString(xmlHttpReq.responseText,"text/xml");			 	
		}

		if(xmlDoc){				
			//alert(xmlHttpReq.responseText);	
						
			var markerElements = xmlDoc.getElementsByTagName('marker');
			//alert(markerElements[0].getAttribute("srl"));	
			//alert(markerElements.length);
			
			for(mE = 0; mE < markerElements.length; mE++) {
				var markerElement = markerElements[mE];
				
				//alert(markerElement.getAttribute("srl"));
				
				var lat = parseFloat(markerElement.getAttribute("lat"));
				var lng = parseFloat(markerElement.getAttribute("lng"));
				var srl = markerElement.getAttribute("srl");
							
				var myLatlng = new google.maps.LatLng(lat, lng);
								
				var mrkID = ""+srl;
				var msgbox = "msgbox_"+mrkID;				
				var msglist = "msglist_"+mrkID; 
				var gstBkNm = guestbookNameString; // "default"; 
				
				var contentString  = '#' + mrkID + '<div id="content">' + '<div class ="kitten"><div class ="boxbackground">' + 	
				  '<div class="msglist" id="'+ msglist +'"></div></div>' + '</div>' + '</div>' +
				  '<textarea id="'+ msgbox +'" rows="2" cols="50"></textarea>' +			  
				  '<input type="button" value="Post" onclick="postAjaxRequest('+ 
					"'" + msgbox + "', '" + mrkID + "', '" + gstBkNm + "', '" + msglist + "'" +')"/>';  
														
				var marker = new google.maps.Marker({       
					position: myLatlng,
					map: map,
					title: ''+mrkID
				});
								
				addInfowindow(marker, contentString);
			}			
		}else{
			alert("No data.");
		}	
	}		
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
		getAjaxRequest(); 
	});
}

function getAjaxRequest() {
	//alert("getAjaxRequest");
	try {
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.onreadystatechange = httpCallBackFunction_getAjaxRequest;
		var url = "/queryprocessor/?markerID="+selectedMarkerID+"&guestbookName="+guestbookNameString;
		
		xmlHttpReq.open('GET', url, true);
    	xmlHttpReq.send(null);
    	
    	//alert();
    	
	} catch (e) {
    	alert("Error: " + e);
	}	
}

function httpCallBackFunction_getAjaxRequest() {
	//alert("httpCallBackFunction_getAjaxRequest");
	
	if (xmlHttpReq.readyState == 1){
		//updateStatusMessage("<blink>Opening HTTP...</blink>");
	}else if (xmlHttpReq.readyState == 2){
		//updateStatusMessage("<blink>Sending query...</blink>");
	}else if (xmlHttpReq.readyState == 3){ 
		//updateStatusMessage("<blink>Receiving...</blink>");
	}else if (xmlHttpReq.readyState == 4){
		var xmlDoc = null;

		if(xmlHttpReq.responseXML){
			xmlDoc = xmlHttpReq.responseXML;
		}else if(xmlHttpReq.responseText){
			var parser = new DOMParser();
		 	xmlDoc = parser.parseFromString(xmlHttpReq.responseText,"text/xml");			 	
		}

		if(xmlDoc){				
			//alert(xmlHttpReq.responseText);			
			document.getElementById("msglist_"+selectedMarkerID).innerHTML=xmlHttpReq.responseText;					
		}else{
			alert("No data.");
		}	
	}		
}

function postAjaxRequest(postMsg, markerID, guestbookName, rspMsgList) {
	//alert("postAjaxRequest");
	try {
		xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.onreadystatechange = httpCallBackFunction_postAjaxRequest;
		var url = "/sign";
	
		xmlHttpReq.open("POST", url, true);
		xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');		
		
		var postMsgValue = document.getElementById(postMsg).value;
		var markerIDValue = markerID; 
		var guestbookNameValue = guestbookName; 
    	
		xmlHttpReq.send("postMsg="+postMsgValue+"&markerID="+markerIDValue+"&guestbookName="+guestbookNameValue);
    	
    	//alert();
    	
	} catch (e) {
    	alert("Error: " + e);
	}	
}

function httpCallBackFunction_postAjaxRequest() {
	//alert("httpCallBackFunction_postAjaxRequest");
	
	if (xmlHttpReq.readyState == 1){
		//updateStatusMessage("<blink>Opening HTTP...</blink>");
	}else if (xmlHttpReq.readyState == 2){
		//updateStatusMessage("<blink>Sending query...</blink>");
	}else if (xmlHttpReq.readyState == 3){ 
		//updateStatusMessage("<blink>Receiving...</blink>");
	}else if (xmlHttpReq.readyState == 4){
		var xmlDoc = null;

		if(xmlHttpReq.responseXML){
			xmlDoc = xmlHttpReq.responseXML;			
		}else if(xmlHttpReq.responseText){
			var parser = new DOMParser();
		 	xmlDoc = parser.parseFromString(xmlHttpReq.responseText,"text/xml");		 		
		}
		
		if(xmlDoc){				
			//alert(xmlHttpReq.responseText);			
			document.getElementById("msglist_"+selectedMarkerID).innerHTML=xmlHttpReq.responseText;
			document.getElementById("msgbox_"+selectedMarkerID).value = "";
		}else{
			alert("No data.");
		}	
	}		
}