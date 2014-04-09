<!DOCTYPE html>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreService" %>
<%@ page import="com.google.appengine.api.datastore.Query" %>
<%@ page import="com.google.appengine.api.datastore.Entity" %>
<%@ page import="com.google.appengine.api.datastore.FetchOptions" %>
<%@ page import="com.google.appengine.api.datastore.Key" %>
<%@ page import="com.google.appengine.api.datastore.KeyFactory" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<html>

	<head>

	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="description" content="">
	    <meta name="author" content="">
	    
	    <title>OurParkingSpot</title>
	    
	    <link rel="shortcut icon" href="http://getbootstrap.com/assets/ico/favicon.ico">
	    <link type="text/css" href="./css/myCss.css" rel="stylesheet">
        <link type="text/css" href="./css/bootstrap.css" rel="stylesheet">
        
	    <script type="text/javascript" src="/js/myJs.js"></script>        
	    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDh0t8xGJIIHStBk-MN3wYzC-nn8SJ09U4&sensor=true"> </script> 
	    <script type="text/javascript"> 
	      
	        function initialize() {
	                    
	            var myLatlng = new google.maps.LatLng(37.33152141760375,-122.04732071026367);   
	           
	            var mapOptions = {
	              center: myLatlng,
	              zoom: 12
	            };
	            
	            map = new google.maps.Map(document.getElementById("map-canvas"),
	              mapOptions);      
	
	            var mrkID = "0";
	            var gstBkNm = guestbookNameString; //"default";
	            var msgbox = "msgbox_"+mrkID;       
	            var msglist = "msglist_"+mrkID;
	                                    
	            var contentString  = '#' + mrkID + '<div id="content">' +  '<div class ="kitten"><div class ="boxbackground">' +    
	                  '<div class="msglist" id="'+ msglist +'"></div></div></div>' + '</div>' +
	                  '<textarea id="'+ msgbox +'" rows="2" cols="50"></textarea>' +              
	                  '<input type="button" value="Post" onclick="postAjaxRequest('+ 
	                    "'" + msgbox + "', '" + mrkID + "', '" + gstBkNm + "', '" + msglist + "'" +')"/>';  
	            
	            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
	            var icons = {
	                parking: {
	                    icon: iconBase + 'parking_lot_maps.png'
	                },
	                library: {
	                    icon: iconBase + 'library_maps.png'
	                },
	                info: {
	                    icon: iconBase + 'info-i_maps.png'
	                }
	            };
	                           
	            var marker = new google.maps.Marker({       
	              position: myLatlng,
	              map: map,
	              icon: icons['parking'].icon,            
	              title: ''+mrkID
	            });    
	            
	            addInfowindow(marker, contentString);
	                    
	            // Load the selected markers            
	            loadMarkers();       
	        }      
	    
	        google.maps.event.addDomListener(window, 'load', initialize);
	    </script>
	    
    	
		
	</head>
	
<!-- ============================================================================================================================= -->
    <body>
        <div class="container">
<!-- ============================================================================================================================= -->
            <!--  Navbar  -->
                <div class="navbar-wrapper navbar-fixed-top" style="margin-top:10px">
                    <div class="container">
                        <div class="navbar navbar-inverse" role="navigation">
                            <div class="container-fluid">
                                <div class="navbar-header">
                                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
										<span class="sr-only">Toggle navigation</span>
										<span class="icon-bar"></span>
										<span class="icon-bar"></span>
										<span class="icon-bar"></span>
									</button>
                                    <a class="navbar-brand" href="#">OurParkingSpot</a>
                                </div>
                                <div class="navbar-collapse collapse">
									<ul class="nav navbar-nav">
										<li class="active"><a href="#">Home</a></li>
										<li><a href="#">About</a></li>
										<li><a href="#">Manage Bookings</a></li>	                
									</ul>
									<form class="navbar-form navbar-left" role="search">
										<div class="form-group">
										<input type="text" class="form-control" placeholder="Type in address to book a spot">
										</div>
										<button type="submit" class="btn btn-default">Search</button>
									</form>
									<ul class="nav navbar-nav">
										<li class="dropdown">
											<a href="#" class="dropdown-toggle" data-toggle="dropdown">Are You A Host ? <b class="caret"></b></a>
											<ul class="dropdown-menu">
												<li><a href="#">Host A New Spot</a></li>
												<li><a href="#">Manage Hosted Spots</a></li>
											</ul>                  			                  	
										</li>     		                
									</ul>
                                    <ul class="nav navbar-nav navbar-right">
									<% 
										UserService userService = UserServiceFactory.getUserService();
										User user = userService.getCurrentUser();
										if (user != null) {
										pageContext.setAttribute("user", user);	
									%>
										<li><a href="<%= userService.createLogoutURL(request.getRequestURI())%>">
										<span class="glyphicon glyphicon-log-out"></span> Logged as ${fn:escapeXml(user.nickname)}</a>
										</li>    
									<%
									   } else {
									%>   
										<li><a href="<%= userService.createLoginURL(request.getRequestURI())%>">
										<span class="glyphicon glyphicon-log-in"></span> LOGIN</a>
										</li>   
									<%
									   }
									%>      				
									</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <!-- End of Navbar -->
<!-- ============================================================================================================================= -->
            <!-- Main Page -->                
                <div class="jumbotron mainPage">
                    <div id="map-canvas" class="mapCanvas"></div>
                </div>
                <script>
                    adjustMapHeight();
                </script>
            <!-- End of Main Page -->
<!-- ============================================================================================================================= -->
        </div>

	<!-- Bootstrap core JavaScript -->
	<script src="./js/jquery-1.11.0.js"></script>
	<script src="./js/bootstrap.min.js"></script>

</body>
<!-- ============================================================================================================================= -->
	
</html>
