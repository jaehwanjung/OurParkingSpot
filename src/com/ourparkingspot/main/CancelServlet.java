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
public class CancelServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		if (user != null) {
			long bookingKey = Long.parseLong(req.getParameter("bookingKey"));

			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Query q = new Query("Bookings");
			PreparedQuery pq = datastore.prepare(q);
			for (Entity booking : pq.asIterable()) {
				if (booking.getKey().getId() == bookingKey)
					datastore.delete(booking.getKey());
			}

			resp.sendRedirect(String.format("/main.jsp"));
		} else {
			resp.sendRedirect(String.format("/main.jsp?error=%s", "No User"));
		}

	}
}
