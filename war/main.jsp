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
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="description" content="">
	    <meta name="author" content="">
	    
	    <title>OurParkingSpot</title>
	    
    	<link rel="shortcut icon" href="http://getbootstrap.com/assets/ico/favicon.ico">
    	<!-- Bootstrap core CSS -->
    	<link type="text/css" href="./css/bootstrap.css" rel="stylesheet">
    	<!-- Custom styles for Bootstrap Carousel -->
    	<link type="text/css" href="./css/carousel.css" rel="stylesheet">
		
	</head>
	
	<body> 
	
	<div class="navbar-wrapper">
    	<div class="container">
        	<div class="navbar navbar-inverse navbar-static-top" role="navigation">
          		<div class="container">
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
			                <li class="dropdown">
			                	<a href="#" class="dropdown-toggle" data-toggle="dropdown">Host<b class="caret"></b></a>
			                  	<ul class="dropdown-menu">
				                    <li><a href="#">Host A New Spot</a></li>
				                    <li><a href="#">Manage Hosted Spots</a></li>
			                  	</ul>                  
			                </li>     
			                <li class="dropdown">
			                	<a href="#" class="dropdown-toggle" data-toggle="dropdown">Client<b class="caret"></b></a>
			                  	<ul class="dropdown-menu">
				                    <li><a href="#">Book A New Spot</a></li>
				                    <li><a href="#">Manage Bookings</a></li>
			                 	</ul>                  
			                </li>         
              			</ul>
            		</div>
          		</div>
        	</div>
      	</div>
    </div>
    
    <!-- Bootstrap core JavaScript -->
    <script src="./js/jquery-1.11.0.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <script src="./js/docs.min.js"></script>
	
	</body>
	
</html>
