import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../modules/auth/login";
import Signup from "../modules/auth/signup";
import ForgotPassword from "../modules/auth/forgotpassword";
import ChatRoom from "../modules/chat-room/chatRoom";
import AuthGuard from "../components/AuthGuard";
import GuestGuard from "../components/GuestGuard"; // Import the new guard

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Only accessible if NOT logged in */}
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Chat Route (Only accessible if logged in) */}
        <Route element={<AuthGuard />}>
          <Route path="/chat" element={<ChatRoom />} />
        </Route>

        {/* Redirect root based on login status */}
        <Route path="/" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;