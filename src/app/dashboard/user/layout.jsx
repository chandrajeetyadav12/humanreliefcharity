"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function UserLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      }

      if (isAuthenticated && user?.role !== "user") {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "user") return null;

  return (
    <div className="d-block d-lg-flex flex-grow-1 min-vh-100">
      {/* SIDEBAR */}
      <aside className="p-3 border-end bg-light userLayoutAside">
        <h5 className="mb-3">Member Panel</h5>

        <ul className="list-unstyled userAsideUL">
          <li className="mb-2">
            <a href="/dashboard/user">Dashboard</a>
          </li>

          <li className="mb-2">
            <a href="/dashboard/user/profile">Profile</a>
          </li>

          <li className="mb-2">
            {/* <a href="/dashboard/user/status">Application Status</a> */}
          </li>
           <li className="mb-2">
            <a href="/dashboard/user/my-donations">My Donations</a>
          </li>
        </ul>

        {/* LOGOUT */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}
