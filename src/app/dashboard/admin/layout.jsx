
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      }

      if (isAuthenticated && user?.role !== "admin") {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="userLayout">
      {/* HAMBURGER (mobile only) */}
      <button
        className="hamburgerBtn d-lg-none"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>
                  {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebarOverlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* SIDEBAR */}
      <aside className={`userLayoutAside ${sidebarOpen ? "open" : ""}`}>
                <button
          className="closeBtn d-lg-none"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
        <h5>Admin Panel</h5>

        <ul className="list-unstyled userAsideUL">
          <li><a href="/dashboard/admin/users">Users</a></li>
          <li><a href="/dashboard/admin/profile">Profile</a></li>
          <li><a href="/dashboard/admin/pending-avedan">Pending Avedan</a></li>
          <li><a href="/dashboard/admin/donations/pending">Pending Donations</a></li>
        </ul>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 mt-3"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="userLayoutMain">{children}</main>
    </div>
  );
}


