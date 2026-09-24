import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, Clock, AlertTriangle, Info, CheckCircle2, ChevronRight } from "lucide-react";
import { fetchNotifications } from "../api";
import { useToast } from "../components/Toast";
import { SkeletonCard } from "../components/Skeleton";

export function Notifications() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchNotifications();
        if (res?.notifications) setNotifications(res.notifications);
      } catch (e) {
        console.error("Notifications fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read.", "success");
  };

  const handleMarkOne = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "All"
    ? notifications
    : notifications.filter((n) => n.category.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Bell size={28} style={{ color: "var(--gov-maroon)" }} />
            Notification Center
          </h1>
          <p className="page-header-subtitle">
            Direct operational alerts, field updates and inter-agency dispatches.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {unreadCount > 0 && (
            <span className="badge badge-critical">
              {unreadCount} Unread Notifications
            </span>
          )}
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["All", "Critical", "Action Required", "Warning", "Information"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`btn btn-sm ${filter === cat ? "btn-primary" : "btn-secondary"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: item.read ? "#ffffff" : "#fffdf8",
              borderLeft: item.read ? "1px solid var(--border-light)" : "5px solid var(--accent-gold)"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: item.category === "Critical" ? "#fee2e2" : "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.category === "Critical" ? "#b91c1c" : "#b45309",
                  flexShrink: 0
                }}
              >
                {item.category === "Critical" ? <AlertTriangle size={18} /> : <Info size={18} />}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span className={`badge badge-${item.category.toLowerCase().replace(" ", "")}`}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {item.time}
                  </span>
                </div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary-navy)" }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {item.message}
                </p>
              </div>
            </div>

            <div>
              {!item.read && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleMarkOne(item.id)}
                  title="Mark as read"
                >
                  <CheckCircle2 size={14} /> Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
