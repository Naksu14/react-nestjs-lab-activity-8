import React from "react";
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from "lucide-react";

const SignUpCreatedModal = ({
  visible,
  onClose,
  onGoToLogin,
  onAutoLogin,
  isLoading,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div
        className="w-full max-w-sm rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in duration-300"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >

        {/* Content Section */}
        <div className="p-8 text-center">
          <h3
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome Aboard!
          </h3>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Your account has been created successfully. How would you like to
            start your journey?
          </p>

          <div className="space-y-3">
            {/* Primary Action: Auto Login */}
            <button
              className="w-full py-3.5 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-500/25 disabled:opacity-70"
              onClick={onAutoLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span> Enter Chat Room </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Secondary Action: Go to Login */}
            <button
              className="w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all hover:bg-gray-500/5"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              onClick={onGoToLogin}
              disabled={isLoading}
            >
              Login to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCreatedModal;
