import React from "react";
import { AlertCircle, LogOut, X } from "lucide-react";
import { leaveToChatRoom } from "../../services/chatRoomService";
import { useQueryClient } from "@tanstack/react-query";

const LeaveChatRoomModal = ({
  isOpen,
  onClose,
  roomId,
  roomName,
  isLoading,
}) => {
  const queryClient = useQueryClient();

  const handleLeaveChatRoom = async () => {
    try {
      await leaveToChatRoom(roomId);
      // Refresh room lists so UI updates after leaving
      queryClient.invalidateQueries(["myChatRooms"]);
      queryClient.invalidateQueries(["allChatRooms"]);
    } catch (err) {
      console.error("handleLeaveChatRoom failed:", err);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border animate-in zoom-in duration-300"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Warning Header */}
        <div className="pt-8 pb-4 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h3
            className="text-xl font-bold px-6 text-center"
            style={{ color: "var(--text-primary)" }}
          >
            Leave Room?
          </h3>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-10 text-center">
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Are you sure you want to leave{" "}
            <span className="font-bold text-red-500">{roomName}</span>? You will
            no longer receive updates or see new messages here.
          </p>

          <div className="space-y-3">
            {/* Primary Action: Leave */}
            <button
              className="w-full py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-500/25 disabled:opacity-70"
              onClick={handleLeaveChatRoom}
              disabled={isLoading}
            >
              {isLoading ? (
                "Leaving..."
              ) : (
                <>
                  <LogOut size={18} />
                  <span>Leave Conversation</span>
                </>
              )}
            </button>

            {/* Secondary Action: Cancel */}
            <button
              className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:bg-gray-500/5"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              onClick={onClose}
              disabled={isLoading}
            >
              Stay in Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveChatRoomModal;
