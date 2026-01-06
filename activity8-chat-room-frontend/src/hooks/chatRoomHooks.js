import { useState, useEffect, useRef } from "react";
import { joinRoom, leaveRoom } from "../socket/chatSocket";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser } from "../services/authService";
import {
  getMyChatRooms,
  getAllChatRooms,
  sendMessage,
  updateChatRoom,
} from "../services/chatRoomService";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const useChatRoom = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchRoom, setSearchRoom] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("joined");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedJoinRoomId, setSelectedJoinRoomId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isUserActive, setIsUserActive] = useState(true);
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef(null);
  const messageEndRef = useRef(null);

  const currentRoomIdRef = useRef(null);

  // Handle joining/leaving rooms when selectedRoomId changes
  useEffect(() => {
    if (!selectedRoomId) return;
    if (
      currentRoomIdRef.current &&
      currentRoomIdRef.current !== selectedRoomId
    ) {
      leaveRoom(currentRoomIdRef.current);
    }

    // join the newly selected room
    joinRoom(selectedRoomId);
    currentRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });
  if (userLoading) {
  }
  if (userError) {
  }

  const {
    data: myChatRooms,
    isLoading: roomsLoading,
    isError: roomsError,
  } = useQuery({
    queryKey: ["myChatRooms"],
    queryFn: () => getMyChatRooms(),
  });
  if (roomsLoading) {
  }
  if (roomsError) {
  }

  const {
    data: allChatRooms,
    isLoading: allRoomsLoading,
    isError: allRoomsError,
  } = useQuery({
    queryKey: ["allChatRooms"],
    queryFn: () => getAllChatRooms(),
  });
  if (allRoomsLoading) {
  }
  if (allRoomsError) {
  }

  useEffect(() => {
    const INACTIVE_DELAY = 5000;
    const timer = { current: null };

    const setActive = (active) => {
      clearTimeout(timer.current);

      if (active) {
        setIsUserActive(true);
      } else {
        timer.current = setTimeout(
          () => setIsUserActive(false),
          INACTIVE_DELAY
        );
      }
    };

    const handleVisibility = () =>
      setActive(document.visibilityState === "visible");

    window.addEventListener("focus", () => setActive(true));
    window.addEventListener("blur", () => setActive(false));
    document.addEventListener("visibilitychange", handleVisibility);

    // initial check
    handleVisibility();

    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("focus", () => setActive(true));
      window.removeEventListener("blur", () => setActive(false));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // user active/inactive status in the database
  useEffect(() => {
    // Only attempt to update when we know who the user is
    if (!currentUser) return;

    const syncActivityStatus = async () => {
      try {
        await updateCurrentUser({ isActive: isUserActive });
        // Refresh current user data in cache
        queryClient.invalidateQueries(["currentUser"]);
      } catch (error) {
        console.error("Failed to update user activity status:", error);
      }
    };

    syncActivityStatus();
  }, [isUserActive, currentUser, queryClient]);

  const handleSendMessage = async () => {
    if (!selectedRoomId || !messageText.trim()) return;
    try {
      await sendMessage({
        chat_room_id: selectedRoomId,
        text_message: messageText,
      });
      setMessageText("");
      // refresh rooms/messages
      queryClient.invalidateQueries(["myChatRooms"]);
      queryClient.invalidateQueries(["allChatRooms"]);
    } catch (err) {
      console.error("sendMessage failed:", err);
    }
  };

  const handleUpdateRoomDetails = async (updateData) => {
    if (!selectedRoomId) return;
    try {
      await updateChatRoom(selectedRoomId, updateData);
      queryClient.invalidateQueries(["myChatRooms"]);
      queryClient.invalidateQueries(["allChatRooms"]);
    } catch (error) {
      console.error("Failed to update chat room:", error);
    }
  };

  useEffect(() => {
    const handleNewMessage = () => {
      queryClient.invalidateQueries(["myChatRooms"]);
    };

    socket.on("onMessage", handleNewMessage);

    return () => {
      socket.off("onMessage", handleNewMessage);
    };
  }, [queryClient]);

  const getInitials = (firstname, lastname) => {
    if (!firstname && !lastname) return "U";
    const firstInitial = firstname ? firstname[0] : "";
    const lastInitial = lastname ? lastname[0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Simple helper to find a room by id from an array safely
  const findRoomById = (rooms, id) => {
    return (rooms || []).find((r) => r.id === id);
  };

  const getRoomLastActivityDate = (room) =>
    room?.messages?.length
      ? new Date(Math.max(...room.messages.map((m) => new Date(m.created_at))))
      : new Date(room?.updated_at || 0);

  // compute sorted messages for the selected room (oldest -> newest)
  const selectedRoom = findRoomById(myChatRooms, selectedRoomId);
  const sortedMessages = (selectedRoom?.messages || [])
    .slice()
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  useEffect(() => {
    if (messageEndRef.current) {
      try {
        messageEndRef.current.scrollIntoView({
          // behavior: "smooth",
          block: "end",
        });
      } catch (e) {
        // ignore scroll errors
      }
    }
  }, [selectedRoomId, sortedMessages.length]);

  const selectedJoinRoom = findRoomById(allChatRooms, selectedJoinRoomId);

  const handleLogout = () => {
    setIsModalOpen(false);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return {
    isDarkMode,
    setIsDarkMode,
    isProfileOpen,
    setIsProfileOpen,
    searchRoom,
    setSearchRoom,
    isModalOpen,
    setIsModalOpen,
    activeSidebarTab,
    setActiveSidebarTab,
    isCreateRoomOpen,
    setIsCreateRoomOpen,
    isJoinModalOpen,
    setIsJoinModalOpen,
    isAddMemberOpen,
    setIsAddMemberOpen,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    isRoomDetailsOpen,
    setIsRoomDetailsOpen,
    selectedRoomId,
    setSelectedRoomId,
    selectedJoinRoomId,
    selectedJoinRoom,
    setSelectedJoinRoomId,
    messageText,
    setMessageText,
    isUserActive,
    currentUser,
    myChatRooms,
    allChatRooms,
    handleSendMessage,
    getInitials,
    sortedMessages,
    messagesContainerRef,
    messageEndRef,
    selectedRoom,
    getRoomLastActivityDate,
    handleUpdateRoomDetails,
    handleLogout,
  };
};
