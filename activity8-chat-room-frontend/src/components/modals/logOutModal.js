import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const LogOutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal Card */}
      <div 
        className="w-full max-w-sm rounded-2xl shadow-2xl border transform transition-all animate-in fade-in zoom-in duration-200"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        {/* Header */}
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-500/10" style={{ color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Sign Out
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Are you sure you want to log out? You will need to sign in again to access your chats.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={onConfirm}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Log Out
            </button>
            <button 
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-medium transition-colors border"
              style={{ 
                color: "var(--text-primary)", 
                backgroundColor: "var(--bg-main)",
                borderColor: "var(--border-color)"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;