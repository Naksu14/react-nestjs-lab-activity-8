import React, { useState } from "react";
import { X, Users, Lock, Search, UserPlus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/authService";
import {
  createChatRoom,
  addMembersToChatRoom,
  getAllUsers,
} from "../../services/chatRoomService";

const CreateRoomModal = ({ isOpen, onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchMember, setSearchMember] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("private");

  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  const { data: allUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(),
  });

  const handleCreateRoom = async () => {
    try {
      const newRoom = await createChatRoom({
        chat_room_name: roomName,
        type: roomType,
      });

      // backend expects a single user_id per request, so add members individually
      if (selectedMembers.length > 0) {
        await Promise.all(
          selectedMembers.map((id) =>
            addMembersToChatRoom({
              chat_room_id: newRoom.id,
              user_id: Number(id),
            })
          )
        );
      }

      // Refresh room lists so UI updates after creating
      queryClient.invalidateQueries(["myChatRooms"]);
      queryClient.invalidateQueries(["allChatRooms"]);

      setRoomName("");
      setSelectedMembers([]);
      setRoomType("private");
      onClose();
    } catch (err) {
      console.error("handleCreateRoom failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg text-left min-h-[60vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
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
          <div className="flex items-center gap-2">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              New Chat Room
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-500/10"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-5 overflow-y-auto">
          {/* Room Basic Info: Name and Avatar */}
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter name..."
                className="w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Room Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRoomType("public")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition-all ${
                roomType === "public"
                  ? "border-violet-500 bg-violet-500/10 text-violet-500"
                  : "opacity-60"
              }`}
              style={{
                backgroundColor: roomType === "public" ? "" : "var(--bg-main)",
              }}
            >
              <Users size={16} />
              <span className="text-xs font-bold">Public</span>
            </button>
            <button
              onClick={() => setRoomType("private")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition-all ${
                roomType === "private"
                  ? "border-violet-500 bg-violet-500/10 text-violet-500"
                  : "opacity-60"
              }`}
              style={{
                backgroundColor: roomType === "private" ? "" : "var(--bg-main)",
              }}
            >
              <Lock size={16} />
              <span className="text-xs font-bold">Private</span>
            </button>
          </div>

          <hr style={{ borderColor: "var(--border-color)" }} />

          {/* ADD USERS SECTION */}
          <div className="space-y-3">
            <label
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Add Members
            </label>

            {/* User Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={14}
              />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search specific user..."
                className="w-full border rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Simulated User List for Selection */}
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {(allUsers || [])
                .filter((user) => user.id !== currentUser.id)
                .filter((user) => {
                  const fullName =
                    `${user.firstname} ${user.lastname}`.toLowerCase();
                  return fullName.includes(searchMember.toLowerCase());
                })
                .map((user) => {
                  const isSelected = selectedMembers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                        isSelected ? "bg-violet-500/10" : "hover:bg-gray-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-violet-500/20 rounded-full flex items-center justify-center text-[10px] font-bold text-violet-500">
                          {(user.firstname?.charAt(0) || "") +
                            (user.lastname?.charAt(0) || "")}
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedMembers((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((mid) => mid !== user.id)
                              : [...prev, user.id]
                          )
                        }
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                          isSelected
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "text-violet-500 hover:bg-violet-500/10"
                        }`}
                      >
                        {isSelected ? "Remove" : <UserPlus size={14} />}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer Actions (sticks to bottom of modal) */}
        <div
          className="p-4 bg-gray-500/5 border-t flex gap-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-bold rounded-xl"
            style={{
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || selectedMembers.length === 0}
            className="flex-1 py-2 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create & Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
