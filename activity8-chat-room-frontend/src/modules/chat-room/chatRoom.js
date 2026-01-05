import React from "react";
import {
  Send,
  LogOut,
  Search,
  MoreVertical,
  Paperclip,
  Moon,
  Sun,
  Plus,
  Hash,
  ArrowRightCircle,
} from "lucide-react";
import { useChatRoom } from "../../hooks/chatRoomHooks";
import LogOutModal from "../../components/modals/logOutModal";
import UserAccountModal from "../../components/modals/userAccountModal";
import CreateRoomModal from "../../components/modals/createNewChatRoomModal";
import JoinChatRoomModal from "../../components/modals/joinChatRoomModal";
import AddNewMemberModal from "../../components/modals/addNewMemberModal";
import LeaveChatRoomModal from "../../components/modals/leaveChatRoomModal";

const ChatRoom = () => {
  const {
    isDarkMode,
    setIsDarkMode,
    isProfileOpen,
    setIsProfileOpen,
    searchRoom,
    setSearchRoom,
    isModalOpen,
    setIsModalOpen,
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
    selectedJoinRoom,
    selectedJoinRoomId,
    setSelectedJoinRoomId,
    messageText,
    setMessageText,
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
    handleLogout,
  } = useChatRoom();

  return (
    <div
      className="flex flex-col h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      {/* Top Navigation */}
      <header
        className="flex justify-between items-center border-b px-6 py-3 shadow-sm transition-colors"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 cursor-pointer"
          title="User Profile"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
            {currentUser
              ? getInitials(currentUser.firstname, currentUser.lastname)
              : "U"}
          </div>
          <div className="flex flex-col text-left">
            <p className="text-sm font-semibold leading-none">
              {currentUser?.firstname + " " + currentUser?.lastname ||
                currentUser?.email ||
                "User Name"}
            </p>
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title="Toggle Dark/Light Mode"
            style={{ color: "var(--text-muted)" }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm hover:text-red-600 transition-colors duration-200 font-medium"
            title="Log Out"
            style={{ color: "var(--text-muted)" }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Replace your current <aside> with this version */}
        <aside
          className="hidden md:flex flex-col border rounded-xl w-1/4 shadow-sm overflow-hidden transition-colors"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Sidebar Header & Create Room Button */}
          <div
            className="p-4 border-b space-y-3"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="flex justify-between items-center">
              <h2
                className="font-bold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Chat Rooms
              </h2>

              {/* CREATE CHAT ROOM BUTTON */}
              <button
                className="p-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-all shadow-sm active:scale-95"
                title="Create New Room"
                onClick={() => setIsCreateRoomOpen(true)}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* SEARCH BAR (Used for Rooms and Users) */}
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5"
                size={16}
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={searchRoom}
                onChange={(e) => setSearchRoom(e.target.value)}
                placeholder="Search rooms or users..."
                className="w-full border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* SECTION 1: YOUR ROOMS (JOINED) */}
            <div className="py-2">
              <p
                className="px-4 py-2 text-left text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Joined Rooms
              </p>
              {(myChatRooms || [])
                .slice()
                .sort(
                  (a, b) =>
                    getRoomLastActivityDate(b) - getRoomLastActivityDate(a)
                )
                .filter(room => room.chat_room_name.toLowerCase().includes(searchRoom.toLowerCase()))
                .map((room) => {
                  // messages array may not be ordered. Ensure we pick the latest by created_at.
                  const lastMsg =
                    room.messages && room.messages.length > 0
                      ? room.messages
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          )[0]
                      : null;
                  const date = new Date(lastMsg?.created_at || room.updated_at);

                  const time = date.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  const preview = lastMsg
                    ? lastMsg.text_message
                    : "Start the conversation in this room.";
                  const isSelected = room.id === selectedRoomId;
                  return (
                    <div
                      key={`joined-${room.id}`}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`px-4 py-3 flex gap-3 cursor-pointer border-l-4 transition-colors ${
                        isSelected
                          ? "bg-violet-500/10 border-violet-500"
                          : "border-transparent hover:bg-gray-500/5"
                      }`}
                    >
                      <div className="w-10 h-10 bg-violet-500/20 rounded-lg shrink-0 flex items-center justify-center text-violet-500">
                        <Hash size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden text-left">
                        <div className="flex justify-between items-baseline">
                          <h4
                            className="text-sm font-semibold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {room.chat_room_name || `Room ${room.id}`}
                          </h4>
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {time}
                          </span>
                        </div>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {preview}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* SECTION 2: DISCOVER (OTHER ROOMS TO JOIN) */}
            <div
              className="py-2 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="px-4 py-2 text-left text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Explore Rooms
              </p>
              {(allChatRooms || [])
                .filter(
                  (r) =>
                    r.type === "group" &&
                    !(myChatRooms || []).some((mr) => mr.id === r.id) &&
                    r.members?.length > 0
                )
                .map((room) => (
                  <div
                    key={`discover-${room.id}`}
                    className="px-4 py-3 flex items-center gap-3 cursor-default group transition-colors hover:bg-gray-500/5"
                  >
                    <div className="w-10 h-10 bg-gray-500/10 rounded-lg shrink-0 flex items-center justify-center text-gray-400 group-hover:text-violet-400 transition-colors">
                      <Hash size={20} />
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <h4
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {room.chat_room_name}
                      </h4>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {room.members?.length ?? 0} members
                      </p>
                    </div>

                    {/* JOIN BUTTON */}
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-violet-500 hover:text-white transition-all text-violet-500"
                      title="Join Room"
                      onClick={() => {
                        setSelectedJoinRoomId(room.id);
                        setIsJoinModalOpen(true);
                      }}
                    >
                      <ArrowRightCircle size={24} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </aside>

        {/* Center: Main Chat Window */}
        <section
          className="flex flex-col border rounded-xl flex-1 shadow-sm overflow-hidden transition-colors"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className={`px-6 py-3 border-b flex justify-between items-center transition-colors ${!selectedRoomId ? "hidden" : ""}`}
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3 className="flex gap-2 items-center font-semibold text-sm">
              <div className="w-6 h-6 bg-violet-500/20 rounded-lg shrink-0 flex items-center justify-center text-violet-500">
                <Hash size={10} />
              </div>

              {selectedRoom?.chat_room_name ?? ""}
            </h3>
            <button
              type="button"
              onClick={() => setIsRoomDetailsOpen((prev) => !prev)}
              className="p-1 rounded hover:bg-gray-500/10 transition-colors cursor-pointer"
              title={
                isRoomDetailsOpen ? "Hide room details" : "Show room details"
              }
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
          >
            {sortedMessages.length === 0 && selectedRoom ? (
              <div className="flex items-center justify-center p-8 text-sm text-gray-400">
                Start a conversation in this room.
              </div>
            ) : (
              sortedMessages.map((msg) => {
                const senderId =
                  msg?.sender?.id ?? msg?.senderId ?? msg?.sender;
                const senderFirst = msg?.sender?.firstname ?? "";
                const senderLast = msg?.sender?.lastname ?? "";
                const isOwn = senderId === (currentUser?.id ?? null);
                const initials =
                  senderFirst || senderLast
                    ? `${(senderFirst || "")[0]}${
                        (senderLast || "")[0]
                      }`.toUpperCase()
                    : "U";
                const time = new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[80%] ${
                      isOwn ? "ml-auto flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-semibold">
                      {initials}
                    </div>
                    <div
                      className={`${
                        isOwn
                          ? "p-3 rounded-2xl rounded-tr-none text-sm text-white shadow-md"
                          : "p-3 rounded-2xl rounded-tl-none text-sm shadow-sm"
                      }`}
                      style={{
                        backgroundColor: isOwn
                          ? "var(--accent-color)"
                          : "var(--bg-main)",
                        border: isOwn
                          ? "none"
                          : "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        className={`text-xs text-gray-400 mb-1 ${
                          isOwn ? "text-right text-white" : " text-left"
                        }`}
                      >
                        {senderFirst} {senderLast} · {time}
                      </div>
                      <div className={`${isOwn ? "text-right" : " text-left"}`}>
                        {msg.text_message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Message Input */}
          <div
            className={`p-4 border-t ${!selectedRoomId ? "hidden" : ""}`}
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="flex items-center gap-2 border rounded-lg px-3 py-1 transition-all"
              style={{
                backgroundColor: "var(--bg-main)",
                borderColor: "var(--border-color)",
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 outline-none"
                style={{ color: "var(--text-primary)" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                className="p-1.5 rounded-md text-white transition-colors"
                title="Send Message"
                style={{ backgroundColor: "var(--accent-color)" }}
                onClick={handleSendMessage}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </section>

        {selectedRoomId && isRoomDetailsOpen && (
          <aside
            className="hidden lg:flex flex-col border rounded-xl w-1/4 shadow-sm p-6 transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Project Info Header */}
            <div className="text-center space-y-4">
              <div
                className="w-24 h-24 bg-gradient-to-tr from-violet-500 to-indigo-600 rounded-full mx-auto border-4 shadow-sm flex items-center justify-center text-white text-3xl font-black"
                style={{ borderColor: "var(--bg-main)" }}
              >
                {(selectedRoom?.chat_room_name || "R").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <h3
                  className="font-bold text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedRoom?.chat_room_name || "Room Name"}
                </h3>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Created by{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {selectedRoom?.created_by?.firstname || "Admin"}{" "}
                    {selectedRoom?.created_by?.lastname || ""}
                  </span>
                </p>
                <p
                  className="text-xs uppercase tracking-widest font-bold"
                  style={{ color: "var(--text-muted)", opacity: 0.8 }}
                >
                  {selectedRoom?.type === "group"
                    ? "Group Room"
                    : "Private Room"}
                </p>
              </div>
            </div>

            <hr
              className="my-6"
              style={{ borderColor: "var(--border-color)" }}
            />

            {/* Members Section with Add User capability */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Members
                </h4>
                {/* ADD USER BUTTON */}
                <button
                  className="text-xs font-bold px-2 py-1 rounded bg-violet-500/10 hover:bg-violet-500/20 transition-colors uppercase tracking-tight"
                  title="Add New Member"
                  style={{ color: "var(--accent-color)" }}
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {/* Member Item */}
                {selectedRoom?.members &&
                  selectedRoom.members
                    .sort((a, b) =>
                      a.user.firstname.localeCompare(b.user.firstname)
                    )
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center text-left gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">
                          {member?.user?.firstname?.charAt(0).toUpperCase() ||
                            ""}
                          {member?.user?.lastname?.charAt(0).toUpperCase() ||
                            ""}
                        </div>
                        <div
                          className="flex-1 text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {member?.user?.firstname} {member?.user?.lastname}
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                      </div>
                    ))}
              </div>
            </div>

            <div
              className="mt-auto pt-4 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              {/* LEAVE ROOM BUTTON */}
              <button
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all hover:bg-red-500/10"
                style={{ color: "#ef4444" }}
                onClick={() => setIsLeaveModalOpen(true)}
              >
                <LogOut size={16} />
                Leave Room
              </button>
            </div>
          </aside>
        )}
      </main>
      {/* Section For Modal */}
      <LogOutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
      <UserAccountModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
      />
      <JoinChatRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        roomId={selectedJoinRoomId}
        roomName={selectedJoinRoom?.chat_room_name}
        memberCount={selectedJoinRoom?.members?.length || 0}
        roomType={selectedJoinRoom?.type}
      />
      <AddNewMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        currentRoom={selectedRoom}
        currentRoomId={selectedRoomId}
        currentRoomName={selectedRoom?.chat_room_name}
      />
      <LeaveChatRoomModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        roomId={selectedRoomId}
        roomName={selectedRoom?.chat_room_name}
        isLoading={false}
      />
    </div>
  );
};

export default ChatRoom;
