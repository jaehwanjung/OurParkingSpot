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
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class BookingServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		String msg = "";
		if (user != null) {
			long id = Long.parseLong(req.getParameter("spotId"));
			String hostUser = req.getParameter("hostUser");
			Date bookFrom = new Date(req.getParameter("bookFrom"));
			Date bookTo = new Date(req.getParameter("bookTo"));
			Key parentKey = KeyFactory.createKey("HostedSpots", hostUser);
			Key spotKey = KeyFactory.createKey(parentKey, "HostedSpots", id);
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			String latitude = "";
			String longitude = "";
			try {
				Entity spot = datastore.get(spotKey);
				latitude = (String) spot.getProperty("latitude");
				longitude = (String) spot.getProperty("longitude");

				Query q = new Query("Bookings");
				PreparedQuery pq = datastore.prepare(q);
				boolean canBook = true;
				for (Entity booking : pq.asIterable()) {
					Date existingFrom = (Date) booking.getProperty("bookFrom");
					Date existingTo = (Date) booking.getProperty("bookTo");
					if (booking.getParent().getParent().equals(spotKey)) {
						System.out.println(booking);
						if (bookFrom.after(existingFrom) && bookFrom.before(existingTo)) {
							System.out.println("Case  1");
							canBook = false;
							break;
						}
						if (bookTo.after(existingFrom) && bookTo.before(existingTo)) {
							System.out.println("Case  2");
							canBook = false;
							break;
						}
						if (bookFrom.before(existingFrom) && bookTo.after(existingTo)) {
							System.out.println("Case  3");
							canBook = false;
							break;
						}
					}
				}
				System.out.println(canBook);
				if (canBook) {
					Key bookingKey = KeyFactory.createKey(spotKey, "Bookings", user.getNickname());

					Entity booking = new Entity("Bookings", bookingKey);
					booking.setProperty("spot", spot);
					booking.setProperty("bookedBy", user);
					booking.setProperty("bookFrom", bookFrom);
					booking.setProperty("bookTo", bookTo);
					booking.setProperty("bookedDate", new Date());
					datastore.put(booking);
					System.out.println("putting : " + booking);
					msg = "Successfully booked!";
				} else {
					msg = "Can't book during the specified time. Choose different time!";
				}

			} catch (EntityNotFoundException e) {
				msg = "Spot not found.";
			}
			resp.sendRedirect(String.format("/main.jsp?lat=%s&lon=%s&created=%s&msg=%s", latitude, longitude, "true",
					msg));
		} else {
			resp.sendRedirect(String.format("/main.jsp?error=%s", "No User"));
		}

	}
}
