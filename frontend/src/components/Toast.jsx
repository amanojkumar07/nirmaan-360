import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.type === "success" && <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />}
            {t.type === "warning" && <AlertTriangle size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />}
            {t.type === "critical" && <AlertTriangle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />}
            {t.type === "info" && <Info size={18} style={{ color: "#d9a441", flexShrink: 0 }} />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: "transparent", border: "none", color: "#9fb3c8", cursor: "pointer", display: "flex", padding: 2 }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { addToast: (msg) => console.log("[Toast]", msg) };
  }
  return ctx;
}
