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
	
	<!--  Navbar  -->
		<div class="navbar-wrapper">
	    	<div class="container">
	        	<div class="navbar navbar-inverse navbar-static-top" role="navigation">
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
						          <input type="text" class="form-control"  style="width: 300px;" placeholder="Type in address to book a spot">
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
		              			<li><a href="#"><span class="glyphicon glyphicon-log-in"></span> LOGIN</a></li>              				
	              			</ul>
	            		</div>
	          		</div>
	        	</div>
	      	</div>
	    </div>
    <!-- End of Navbar -->
    
    <!-- Carousel -->
	    <div id="myCarousel" class="carousel slide" data-ride="carousel">
	      <!-- Indicators -->
	      <ol class="carousel-indicators">
	        <li data-target="#myCarousel" data-slide-to="0" class=""></li>
	        <li data-target="#myCarousel" data-slide-to="1" class=""></li>
	        <li data-target="#myCarousel" data-slide-to="2" class="active"></li>
	      </ol>
	      <div class="carousel-inner">
	        <div class="item active">
	          <div class="container">
	            <div class="carousel-caption">
	              <h1>Example headline.</h1>
	              <p>Note: If you're viewing this page via a <code>file://</code> URL, the "next" and "previous" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.</p>
	              <p><a class="btn btn-lg btn-primary" href="http://getbootstrap.com/examples/carousel/#" role="button">Sign up today</a></p>
	            </div>
	          </div>
	        </div>
	      </div>
	      <a class="left carousel-control" href="http://getbootstrap.com/examples/carousel/#myCarousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>
	      <a class="right carousel-control" href="http://getbootstrap.com/examples/carousel/#myCarousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>
	    </div>
	<!-- End of Carousel -->
    
    <!-- Bootstrap core JavaScript -->
    <script src="./js/jquery-1.11.0.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <script src="./js/docs.min.js"></script>
	
	</body>
	
</html>
