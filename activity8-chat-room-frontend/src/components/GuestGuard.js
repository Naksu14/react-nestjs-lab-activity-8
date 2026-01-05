import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
  // Use the same key you used in your AuthGuard
  const token = localStorage.getItem("authToken");
  const isAuthenticated = token && token.split(".").length === 3;

  // IF user is logged in, REDIRECT them to the chat room
  // ELSE, let them see the login/signup pages (Outlet)
  return isAuthenticated ? <Navigate to="/chat" replace /> : <Outlet />;
};

export default GuestGuard;