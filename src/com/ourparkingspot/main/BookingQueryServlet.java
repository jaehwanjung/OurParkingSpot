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
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class BookingQueryServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		String responseStr = "";
		if (user != null) {

			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Query q = new Query("Bookings");
			PreparedQuery pq = datastore.prepare(q);
			responseStr += "<div>";
			for (Entity booking : pq.asIterable()) {
				Key bookedSpotKey = (Key) booking.getProperty("bookedSpotKey");
				User bookedUser = (User) booking.getProperty("bookedBy");
				Date bookFrom = (Date) booking.getProperty("bookFrom");
				Date bookTo = (Date) booking.getProperty("bookTo");
				Date bookedDate = (Date) booking.getProperty("bookedDate");

				Entity bookedSpot = null;
				try {
					bookedSpot = datastore.get(bookedSpotKey);
				} catch (EntityNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				String title = (String) bookedSpot.getProperty("title");
				String msg = (String) bookedSpot.getProperty("msg");
				String rate = (String) bookedSpot.getProperty("rate");
				String lat = (String) bookedSpot.getProperty("latitude");
				String lon = (String) bookedSpot.getProperty("longitude");

				if (bookedUser.equals(user)) {
					responseStr += "<div class=\"well\">" + "Title: " + title + "<br>" + "rate: " + rate + "<br>"
							+ "msg: " + msg + "<br>" + "Location: Latitude [" + lat + "] Longitude [" + lon + "]<br>"
							+ "Booked from:" + bookFrom.toString() + "<br>" + "Booked to:" + bookTo.toString() + "<br>"
							+ "Booked on:" + bookedDate.toString() + "<br>"
							+ "<form class=\"navbar-form navbar-left\" action=\"/cancel\">"
							+ "<input type=\"hidden\" id=\"bookingKey\" value=\"" + booking.getKey().getId()
							+ "\"name=\"bookingKey\">"
							+ "<button type=\"submit\" class=\"btn btn-default\">Cancel</button>" + "</form>"
							+ "</div>";
				}
				System.out.println(responseStr);
			}
			responseStr += "</div>";

		} else {
			responseStr = "Please log in to see your bookings";
		}
		System.out.println(responseStr);
		resp.setContentType("text/html");
		resp.getWriter().println(responseStr);
	}
}
