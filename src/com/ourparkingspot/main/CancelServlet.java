package com.ourparkingspot.main;

import java.io.IOException;
import java.util.Date;

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
			Date currentDate = new Date();
			Query q = new Query("Bookings");
			PreparedQuery pq = datastore.prepare(q);
			for (Entity booking : pq.asIterable()) {
				if ((booking.getKey().getId() == bookingKey) && currentDate.after((Date) booking.getProperty("bookFrom")) && currentDate.before((Date) booking.getProperty("bookTo"))) {
					resp.sendRedirect(String.format("/main.jsp?msg=%s", "Booking has already begun, can not cancel booking"));
				}
				
				else if ((booking.getKey().getId() == bookingKey) && (currentDate.before((Date) booking.getProperty("bookFrom")) || currentDate.after((Date) booking.getProperty("bookTo")))){
					datastore.delete(booking.getKey());
				    resp.sendRedirect(String.format("/main.jsp?msg=%s", "Booking cancelled/deleted"));
				}
			}

		} else {
			resp.sendRedirect(String.format("/main.jsp?error=%s", "No User"));
		}

	}
}
