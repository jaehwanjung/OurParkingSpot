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
<!-- ============================================================================================================================= -->
<!-- ============================================================================================================================= -->
	<head>
<!-- ============================================================================================================================= -->
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="description" content="">
	    <meta name="author" content="">
	    
	    <title>OurParkingSpot</title>
	    
	    <link rel="shortcut icon" href="http://getbootstrap.com/assets/ico/favicon.ico">
	    <link type="text/css" href="./css/myCss.css" rel="stylesheet">
        <link type="text/css" href="./css/bootstrap.css" rel="stylesheet">
<!-- ============================================================================================================================= -->
    <!-- Javascripts -->
	    <script type="text/javascript" src="/js/myJs.js"></script>        
	    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDh0t8xGJIIHStBk-MN3wYzC-nn8SJ09U4&sensor=true"> </script> 
	    <script type="text/javascript"> 	      
	        function initialize() {	  
	            var vancouverLatLng = new google.maps.LatLng(49.2842,-123.1211);  
	            var mapOptions = {
	              center: vancouverLatLng,
	              zoom: 10
	            };	  
	            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);	
	            var isCreated = getParameterByName('created');
	            var latitude = getParameterByName('lat');
	            var longitude = getParameterByName('lon');	       
	            var msg = getParameterByName('msg');     
	            if (latitude && longitude) {	  
	               addUserMarkerOnMap();             
	               centerMapOnSearch(latitude, longitude, isCreated);
	            }
	            else {
	               centerMapOnUser();
	            }	            
	            if (msg) {
	               alert(msg);
	            }
	        }
	        
	        google.maps.event.addDomListener(window, 'load', initialize);
	    </script>
<!-- ============================================================================================================================= -->
	</head>	
<!-- ============================================================================================================================= -->
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
										<li class="active"><a href="#map-canvas" data-toggle="tab">Home</a></li>
										<li><a href="#about" data-toggle="tab">About</a></li>
										<li><a href="#manageBookings" data-toggle="tab">Manage Bookings</a></li>	                
									</ul>
									<%
									    String searchedLatitude = request.getParameter("lat");
									    String searchedLongitude = request.getParameter("lon");
									    String searchedLatitudeString = searchedLatitude == null ? "Latitude" : searchedLatitude + " (Lat)";
									    String searchedLongitudeString = searchedLongitude == null ? "Longitude" : searchedLongitude + " (Lon)";
									    String defaultLatitude = "";
									    String defaultLongitude = "";
									    pageContext.setAttribute("searchedLatitude", searchedLatitude);
									    pageContext.setAttribute("searchedLongitude", searchedLongitude);
									%>
									<form class="navbar-form navbar-left" action="/search" role="search">
										<div class="form-group">
											<input type="text"  name="latitude" style="width:100px" class="form-control"
                                                placeholder="latitude" value="<%=searchedLatitude == null ? defaultLatitude : searchedLatitude%>">
											<input type="text"  name="longitude" style="width:100px" class="form-control" 
                                                placeholder="longitude" value="<%=searchedLongitude == null ? defaultLongitude : searchedLongitude%>">
										</div>
										<button type="submit" class="btn btn-default"><img src="/resources/search.png" alt="" style="height:20px;width:20px;"> Search</button>										
									</form>					
									<div class="navbar-form navbar-left" action="/search" role="search">				
									    <button type="button" class="btn btn-default" onclick="centerMapOnUser();"><img src="/resources/user.png" alt="" style="height:20px;width:20px;"> Locate Me</button>
									</div>
                                    <ul class="nav navbar-nav navbar-right">
									<% 
										UserService userService = UserServiceFactory.getUserService();
										User user = userService.getCurrentUser();
										if (user != null) {
										pageContext.setAttribute("user", user);	
									%>
									   <script>
									       isLoggedIn = true;
									   </script>
										<li><a href="<%= userService.createLogoutURL(request.getRequestURI())%>">
										<span class="glyphicon glyphicon-log-out"></span> ${fn:escapeXml(user.nickname)}</a>
										</li>    
									<%
									   } else {
									%>   
									   <script>
                                           isLoggedIn = false;
                                       </script>
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
                    <div class="tab-content">
	                    <div class="mapCanvas tab-pane active" id="map-canvas"></div>
	                    <div class="tab-pane" id="about">
	                       <div>
	                           <p>Final Project developed for EECE 417 @ UBC</p>
	                           Group 14 Members:
	                               <ul>
	                                   <li>Jae-Hwan Jung</li>
	                                   <li>Vincent Chiu</li>
	                                   <li>Jon Leung</li>
	                               </ul>	                            
	                       </div>
	                    </div>
	                    <div class="tab-pane" id="manageBookings">
	                    </div>
	                </div>
                </div>
                <script>
                    adjustMapHeight();
                </script>
            <!-- End of Main Page -->
<!-- ============================================================================================================================= -->
        </div>
        
        <script>
            loadMarkers();
        </script>

	<!-- Bootstrap core JavaScript -->
	<script src="./js/jquery-1.11.0.js"></script>
	<script src="./js/bootstrap.min.js"></script>

</body>
<!-- ============================================================================================================================= -->
<!-- ============================================================================================================================= -->
</html>
