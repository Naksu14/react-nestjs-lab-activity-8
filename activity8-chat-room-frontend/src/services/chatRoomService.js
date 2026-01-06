import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Chat Room Services
export const createChatRoom = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.post(`${API_URL}/chat-rooms`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Add members to chat room
export const addMembersToChatRoom = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.post(`${API_URL}/chat-rooms/members`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Leave chat room
export const leaveToChatRoom = async (chatRoomId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.delete(`${API_URL}/chat-rooms/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { chat_room_id: chatRoomId },
  });
  return data;
};

// Get my chat rooms
export const getMyChatRooms = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(`${API_URL}/chat-rooms/my-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // return empty array on error so callers don't receive undefined
    console.error("getMyChatRooms failed:", error?.response || error);
    return [];
  }
};

// Get all chat rooms
export const getAllChatRooms = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(`${API_URL}/chat-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send message
export const sendMessage = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.post(`${API_URL}/chat-rooms/messages`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};


// update chat room details
export const updateChatRoom = async (chatRoomId, updateData) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.patch(
    `${API_URL}/chat-rooms/${chatRoomId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};