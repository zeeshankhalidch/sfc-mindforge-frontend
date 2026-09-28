import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

import Sidebar from "../components/Sidebar/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import API from "../api/axios";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch (e) {}
    }
  }, []);

  // Har route change pe unread count refresh karo
  useEffect(() => {
    fetchUnread();
  }, [location.pathname]);

  const fetchUnread = async () => {
    try {
      const res = await API.get("/notifications/unread-count");
      setUnreadCount(res.data.count || 0);
    } catch (error) {
      // silent fail
    }
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="dashboard-layout">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button
              type="button"
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <span>Campus Coin</span>
          </div>

          <div className="dashboard-header-right">
            <button
              type="button"
              className="notification-button"
              onClick={handleNotificationClick}
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="profile-avatar" title={user?.name || "User"}>
              {avatarLetter}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Breadcrumbs variant="student" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;