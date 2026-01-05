import React from "react";
import { UserPlus } from "lucide-react";
import { addMembersToChatRoom } from "../../services/chatRoomService";
import { getCurrentUser } from "../../services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const JoinChatRoomModal = ({
  isOpen,
  onClose,
  roomId,
  roomName,
  memberCount,
  roomType,
}) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  const handleJoinChatRoom = async () => {
    try {
      await addMembersToChatRoom({
        chat_room_id: roomId,
        user_id: Number(currentUser.id),
      });

      // Refresh room lists so UI updates after joining
      queryClient.invalidateQueries(["myChatRooms"]);
      queryClient.invalidateQueries(["allChatRooms"]);
    } catch (err) {
      console.error("handleJoinChatRoom failed:", err);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="p-6 text-center">
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Join {roomName}?
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            You are about to join this conversation. You'll be able to see
            messages and participate in the chat.
          </p>

          {/* Room Stats info */}
          <div
            className="flex items-center justify-center gap-4 py-3 rounded-xl mb-6"
            style={{ backgroundColor: "var(--bg-main)" }}
          >
            <div className="text-center flex gap-1 items-center justify-center">
              <p className="text-xs uppercase font-bold tracking-wider opacity-60">
                Members
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--accent-color)" }}
              >
                {memberCount}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-500/20"></div>
            <div className="text-center flex gap-1 items-center justify-center">
              <p className="text-xs uppercase font-bold tracking-wider opacity-60">
                Type
              </p>
              <p
                className="text-sm font-bold uppercase"
                style={{ color: "var(--accent-color)" }}
              >
                {roomType}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleJoinChatRoom}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-500/20"
            >
              <UserPlus size={18} />
              Confirm Join
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold transition-colors hover:bg-gray-500/50"
              style={{ color: "var(--text-primary)" }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinChatRoomModal;
