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

@SuppressWarnings("serial")
public class ClearAll extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query("Bookings");
		PreparedQuery pq = datastore.prepare(q);
		for (Entity booking : pq.asIterable()) {
			datastore.delete(booking.getKey());
		}
		q = new Query("HostedSpots");
		pq = datastore.prepare(q);
		for (Entity hostedSpots : pq.asIterable()) {
			datastore.delete(hostedSpots.getKey());
		}

		resp.sendRedirect(String.format("/main.jsp"));

	}
}
