import React, { useState } from "react";
import { X, Camera, Mail, User, Lock, Save } from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "../../services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const UserAccountModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  if (isCurrentUserLoading) return <div>Loading...</div>;
  if (isCurrentUserError) return <div>Error loading user data.</div>;

  // 1. Define a helper to check if anything actually changed
  const isUnchanged =
    (formData.firstname === "" ||
      formData.firstname === currentUser?.firstname) &&
    (formData.lastname === "" || formData.lastname === currentUser?.lastname) &&
    formData.password === "";

  const handleSave = async () => {
    // Use local variables to determine what to send
    const finalFirstname = formData.firstname.trim() || currentUser.firstname;
    const finalLastname = formData.lastname.trim() || currentUser.lastname;

    // Validation
    if (!finalFirstname || !finalLastname) {
      setErrorMessage("First and last names are required.");
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      // Only send the fields that were actually filled out/changed
      await updateCurrentUser({
        firstname: finalFirstname,
        lastname: finalLastname,
        ...(formData.password && { password: formData.password }),
      });
      // Refresh current user data in cache
      queryClient.invalidateQueries(["currentUser"]);
      // Clear any previous error
      setErrorMessage("");
      onClose(); // Optional: close modal on success
    } catch (err) {
      console.error("handleSave failed:", err);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-500/10"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6  text-left">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {currentUser.firstname?.charAt(0).toUpperCase()}
                {currentUser.lastname?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex gap-2 justify-between">
              <div className="space-y-1">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    defaultValue={currentUser.firstname}
                    maxLength={50}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    style={{
                      backgroundColor: "var(--bg-main)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Last Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    defaultValue={currentUser.lastname}
                    maxLength={50}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    style={{
                      backgroundColor: "var(--bg-main)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  disabled
                  defaultValue={currentUser.email}
                  maxLength={50}
                  className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-gray-500/10 cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "var(--border-color)" }} />

          {/* Password Section */}
          <div className="space-y-4">
            <h3
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Change Password
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="New Password"
                  maxLength={50}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="p-4 bg-gray-500/5 border-t flex justify-end gap-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-500/10 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUnchanged}
            className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-md 
              ${
                isUnchanged
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-violet-600 hover:bg-violet-700 text-white active:scale-95"
              }`}
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccountModal;
