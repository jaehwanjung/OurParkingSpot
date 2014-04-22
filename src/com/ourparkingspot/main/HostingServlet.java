package com.ourparkingspot.main;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class HostingServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		if (user != null) {
			String title = req.getParameter("hostTitle");
			String rate = req.getParameter("rate");
			String msg = req.getParameter("hostMsg");
			String latitude = req.getParameter("latitude");
			String longitude = req.getParameter("longitude");

			Key hostKey = KeyFactory.createKey("HostedSpots", user.getEmail());
			Entity spot = new Entity("HostedSpots", hostKey);
			spot.setProperty("user", user);
			spot.setProperty("title", title);
			spot.setProperty("rate", rate);
			spot.setProperty("hostedDate", new Date());
			spot.setProperty("msg", msg);
			spot.setProperty("latitude", latitude);
			spot.setProperty("longitude", longitude);

			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			datastore.put(spot);
			resp.sendRedirect(String.format("/main.jsp?lat=%s&lon=%s&created=%s", latitude, longitude, "true"));
		} else {
			resp.sendRedirect(String.format("/main.jsp?error=%s", "No User"));
		}

	}
}
