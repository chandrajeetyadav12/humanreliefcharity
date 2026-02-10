"use client";

import { useContext, useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BiSolidDonateBlood } from "react-icons/bi";
export default function UserLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <aside  className={`userLayoutAside ${sidebarOpen ? "open" : ""}`}>
                {/* Close button (mobile) */}
        <button
          className="closeBtn d-lg-none"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
        <h5 className="mb-3 text-white">Member Panel</h5>

        <ul className="list-unstyled userAsideUL">
          <li className="mb-2">
            <MdDashboard color="#fff"/><a href="/dashboard/user">Dashboard</a>
          </li>

          <li className="mb-2">
            <CgProfile color="#fff"/><a href="/dashboard/user/profile">Profile</a>
          </li>

          <li className="mb-2">
            {/* <a href="/dashboard/user/status">Application Status</a> */}
          </li>
          <li className="mb-2">
           <BiSolidDonateBlood color="#fff"/><a href="/dashboard/user/my-donations">My Donations</a>
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
      <main className="userLayoutMain">{children}</main>
    </div>
  );
}
