import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import ChatRoom from "../../assets/images/chatRoom.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    login({ email, password })
      .then((user) => {
        const token = user?.token;
        if (token) {
          localStorage.setItem("authToken", token);
        }
        navigate("/chat");
      })
      .catch((error) => {
        const msg =
          error?.response?.data?.message || error?.message || "Login failed";
        setErrorMessage(msg);
      });
  };

  return (
    <div
      className="flex flex-col gap-4 justify-center items-center h-screen "
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="w-96 border p-8 rounded-lg shadow-sm"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <img src={ChatRoom} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
        <h2 className="text-base font-semibold mb-6 text-center">
          Sign in to Access Chat Room
        </h2>
        <hr className=" bg-[#D1D9E0] mb-6" />

        <form className="text-left" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                backgroundColor: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                backgroundColor: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {errorMessage ? (
            <div className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md mb-2 -mt-2">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex items-center justify-between mb-6">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label className="text-sm">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition duration-200"
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>

      <div
        className="w-96 border p-4 rounded-lg shadow-sm"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:underline"
          >
            Create an Account.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
