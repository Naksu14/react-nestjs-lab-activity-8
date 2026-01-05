import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// LOGIN
export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);

  localStorage.setItem("authToken", data.accessToken);

  return data;
};

// GET CURRENT USER FUNCTION
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");

  if (!token || token.split(".").length !== 3) {
    return null; // invalid or missing token
  }
  try {
    const { data } = await api.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

// REGISTER NEW USER
export const createNewUser = async (userInfo) => {
  const { data } = await api.post("/users", userInfo);
  return data;
};

// UPDATE CURRENT USER
export const updateCurrentUser = async (updateData) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.patch(`/users/me`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

