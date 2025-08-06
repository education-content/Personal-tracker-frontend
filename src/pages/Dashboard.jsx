// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom"; // ✅ Outlet added
import Sidebar from "@/components/Sidebar";
import usePreventBackNavigation from "@/hooks/usePreventNavigation";

export default function Dashboard() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  usePreventBackNavigation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login", { replace: true });
    } else {
      setUser(JSON.parse(storedUser));
    }

    const handlePopState = () => {
      if (!window.location.pathname.startsWith("/dashboard")) {
        navigate("/dashboard", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <Sidebar
        onLogout={handleLogout}
        showLogoutDialog={showLogoutDialog}
        setShowLogoutDialog={setShowLogoutDialog}
      />

      <div className="flex-1 p-4">
        {/* ✅ Outlet to render nested route content */}
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
