package com.ourparkingspot.main;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class BookingQueryServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		// String responseStr;
		// DatastoreService datastore =
		// DatastoreServiceFactory.getDatastoreService();
		// Query q = new Query("Bookings");
		// PreparedQuery pq = datastore.prepare(q);
		// responseStr = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";
		// responseStr += "<markers>";
		// for (Entity booking : pq.asIterable()) {
		// Key key = booking.getKey();
		// User hostUser = (User) spot.getProperty("user");
		// String title = (String) spot.getProperty("title");
		// String rate = (String) spot.getProperty("rate");
		// Date hostedDate = (Date) spot.getProperty("hostedDate");
		// String msg = (String) spot.getProperty("msg");
		// String latitude = (String) spot.getProperty("latitude");
		// String longitude = (String) spot.getProperty("longitude");
		// String bookedDate = (String) spot.getProperty("bookedDate");
		// String bookedBy = (String) spot.getProperty("bookedBy");
		// String bookedFrom = (String) spot.getProperty("bookedFrom");
		// String bookedTo = (String) spot.getProperty("bookedTo");
		// responseStr += "<marker " + "id=\"" + id + "\" " + "hostUser=\"" +
		// hostUser + "\" " + "title=\"" + title
		// + "\" " + "rate=\"" + rate + "\" " + "hostedDate=\"" + hostedDate +
		// "\" " + "msg=\"" + msg + "\" "
		// + "latitude=\"" + latitude + "\" " + "longitude=\"" + longitude +
		// "\" " + "></marker>";
		// }
		// responseStr += "</markers>";
		//
		// System.out.println(responseStr);
		// resp.setContentType("text/html");
		// resp.getWriter().println(responseStr);
	}
}
