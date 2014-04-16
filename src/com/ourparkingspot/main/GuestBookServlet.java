package com.ourparkingspot.main;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class GuestBookServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		if (user != null) {
			String reviewMsg = (String) req.getParameter("reviewMsg");
			String hostUser = (String) req.getParameter("hostUser");
			long spotId = Long.parseLong(req.getParameter("spotId"));
			Key parentKey = KeyFactory.createKey("HostedSpots", hostUser);
			Key spotKey = KeyFactory.createKey(parentKey, "HostedSpots", spotId);
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Entity spot = null;
			try {
				spot = datastore.get(spotKey);
			} catch (EntityNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String latitude = (String) spot.getProperty("latitude");
			String longitude = (String) spot.getProperty("longitude");
			Key reviewKey = KeyFactory.createKey("Review", user.getNickname());
			Entity review = new Entity("Review", reviewKey);
			review.setProperty("reviewMsg", reviewMsg);
			review.setProperty("writer", user);
			review.setProperty("reviewSpotKey", spot.getKey());
			review.setProperty("reviewDate", new Date());
			datastore.put(review);

			resp.sendRedirect(String.format("/main.jsp?lat=%s&lon=%s&created=%s", latitude, longitude, "true"));
		} else {
			resp.sendRedirect(String.format("/main.jsp?error=%s", "No User"));
		}

	}
}
