package com.ourparkingspot.main;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class SearchServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String latitude = req.getParameter("latitude");
		String longitude = req.getParameter("longitude");
		resp.sendRedirect(String.format("/main.jsp?lat=%s&lon=%s", latitude,
				longitude));
	}
}
