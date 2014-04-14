package com.ourparkingspot.main;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class MarkerQueryServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		if (user != null) {
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Query q = new Query("HostedSpots");
			PreparedQuery pq = datastore.prepare(q);

			for (Entity spot : pq.asIterable()) {
				String userStr = (String) spot.getProperty("user");
				String title = (String) spot.getProperty("title");
				String rate = (String) spot.getProperty("rate");
				String date = (String) spot.getProperty("date");
				String msg = (String) spot.getProperty("msg");
				String latitude = (String) spot.getProperty("latitude");
				String longitude = (String) spot.getProperty("longitude");
				String bookedDate = (String) spot.getProperty("bookedDate");
				String bookedBy = (String) spot.getProperty("bookedBy");
				String bookedFrom = (String) spot.getProperty("bookedFrom");
				String bookedTo = (String) spot.getProperty("bookedTo");

				System.out.println(userStr + " " + title);
			}
		} else {
			resp.sendRedirect(String.format("/main.jsp?error=%s", "No User"));
		}

	}
}
