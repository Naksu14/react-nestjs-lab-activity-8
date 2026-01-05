import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatRoom from "../../assets/images/chatRoom.png";
import { createNewUser, login } from "../../services/authService";
import SignUpCreatedModal from "../../components/modals/signUpCreatedModal";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPostSignupModal, setShowPostSignupModal] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    createNewUser({
      firstname: firstName,
      lastname: lastName,
      email,
      password,
      isActive: true,
    })
      .then(() => {
        // show modal asking whether to auto-login or go to login
        setShowPostSignupModal(true);
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        const msg =
          error?.response?.data?.message || error?.message || "Signup failed";
        setErrorMessage(msg);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleAutoLogin = () => {
    setErrorMessage("");
    setIsSubmitting(true);
    login({ email, password })
      .then(() => {
        setShowPostSignupModal(false);
        navigate("/chat");
      })
      .catch((err) => {
        console.error("Auto-login failed:", err);
        const msg =
          err?.response?.data?.message || err?.message || "Auto-login failed";
        setErrorMessage(msg);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleGoToLogin = () => {
    setShowPostSignupModal(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <div className="w-[32rem] bg-[#FAFBFC] border border-[#D1D9E0] p-8 rounded-lg shadow-sm">
        <img src={ChatRoom} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
        <h2 className="text-base font-semibold text-center">
          Create Your Account
        </h2>
        <p className="text-xs mb-6 text-center">
          Join the Chat Room to start messaging.
        </p>
        <hr className=" bg-[#D1D9E0] mb-6" />

        <form className="text-left" onSubmit={handleSignup}>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* For input validation remove or add hidden in className */}
          <div
            className={`flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md -mt-4 mb-2 ${
              errorMessage ? "block" : "hidden"
            }`}
            id="error-message"
          >
            {errorMessage}
          </div>
          <button
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition duration-200"
            type="submit"
            onClick={handleSignup}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>

      <div className="w-[32rem] bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
        <p className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Sign In.
          </a>
        </p>
      </div>
      <SignUpCreatedModal
        visible={showPostSignupModal}
        onClose={() => setShowPostSignupModal(false)}
        onGoToLogin={handleGoToLogin}
        onAutoLogin={handleAutoLogin}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Signup;
