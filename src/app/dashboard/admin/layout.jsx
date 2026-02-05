
"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const router = useRouter();

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
    <div className="d-block d-lg-flex flex-grow-1 min-vh-100 admin-main">
      {/* SIDEBAR */}
      <aside className="p-3 border-end bg-light userLayoutAside">
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
      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}


