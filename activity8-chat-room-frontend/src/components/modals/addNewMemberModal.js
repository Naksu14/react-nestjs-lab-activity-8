import React, { useState } from "react";
import { X, Search, UserPlus, Users } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMembersToChatRoom,
  getAllUsers,
} from "../../services/chatRoomService";
import { getCurrentUser } from "../../services/authService";

const AddNewMemberModal = ({
  isOpen,
  onClose,
  currentRoom,
  currentRoomId,
  currentRoomName,
}) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchMember, setSearchMember] = useState("");

  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });
  const { data: allUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(),
  });

  const handleAddMembers = async () => {
    try {
      if (selectedMembers.length > 0) {
        await Promise.all(
          selectedMembers.map((id) =>
            addMembersToChatRoom({
              chat_room_id: currentRoomId,
              user_id: Number(id),
            })
          )
        );
      }

      // Refresh room members list so UI updates after adding members
      queryClient.invalidateQueries(["chatRoomMembers", currentRoomId]);

      setSelectedMembers([]);
      onClose();
    } catch (err) {
      console.error("handleAddMembers failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg h-[50vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
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
            <Users size={18} className="text-violet-500" />
            <h2
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Add to {currentRoomName}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-4 text-gray-400" size={20} />
            <input
              type="text"
              value={searchMember}
              maxLength={50}
              onChange={(e) => setSearchMember(e.target.value)}
              placeholder="Search specific user..."
              className="w-full border rounded-lg py-3 pl-9 pr-4 text-md focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              style={{
                backgroundColor: "var(--bg-main)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* User List */}
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            <p
              className="text-left text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Suggested
            </p>
            {(() => {
              const existingMemberIds = (currentRoom?.members || []).map(
                (member) => member.user?.id
              );

              return (allUsers || [])
                .filter(
                  (user) =>
                    currentUser &&
                    user.id !== currentUser.id &&
                    !existingMemberIds.includes(user.id)
                )
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
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-500/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center text-xs font-bold">
                          {(user.firstname?.charAt(0) || "") +
                            (user.lastname?.charAt(0) || "")}
                        </div>
                        <span
                          className="text-sm font-medium"
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
                });
            })()}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t text-center"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button
            onClick={handleAddMembers}
            disabled={selectedMembers.length === 0}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMemberModal;
