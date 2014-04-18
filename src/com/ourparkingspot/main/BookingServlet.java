package com.ourparkingspot.main;

import java.io.IOException;
import java.text.SimpleDateFormat;
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
			Date bookFrom = null;
			Date bookTo = null;
			
			try {
			    SimpleDateFormat format =
			        new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			    bookFrom = format.parse(req.getParameter("bookFrom"));
			    bookTo =  format.parse(req.getParameter("bookTo"));
			}
			catch(Exception pe) {
			    throw new IllegalArgumentException();
			}
			System.out.println(bookFrom);
			System.out.println(bookTo);
			System.out.println(req.getParameter("bookFrom"));
			System.out.println(req.getParameter("bookTo"));

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
							canBook = false;
							break;
						}
						if (bookTo.after(existingFrom) && bookTo.before(existingTo)) {
							canBook = false;
							break;
						}
						if (bookFrom.before(existingFrom) && bookTo.after(existingTo)) {
							canBook = false;
							break;
						}
					}
				}
				System.out.println(canBook);
				if (canBook) {
					Key bookingKey = KeyFactory.createKey(spotKey, "Bookings", user.getNickname());

					Entity booking = new Entity("Bookings", bookingKey);
					booking.setProperty("bookedSpotKey", spot.getKey());
					booking.setProperty("bookedBy", user);
					booking.setProperty("bookFrom", bookFrom);
					booking.setProperty("bookTo", bookTo);
					booking.setProperty("bookedDate", new Date());
					datastore.put(booking);
					
					// Calculate cost
					long start = bookFrom.getTime(); // in ms
					long end = bookTo.getTime();
					double total = end - start; 
					total /= 3600000; // convert to hours
					String rateStr = (String) spot.getProperty("rate");
					long rate = Long.parseLong(rateStr);
					total *= rate;
					
					
					msg = "Successfully booked!";
					msg += " The total cost is $" + String.format("%.2f", total);
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
