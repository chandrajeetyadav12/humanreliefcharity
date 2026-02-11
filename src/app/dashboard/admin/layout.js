
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiPassPendingFill } from "react-icons/ri";
import { MdGroup } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
        <h5 className="text-white">Admin Panel</h5>

        <ul className="list-unstyled userAsideUL">
          {/* <li><MdDashboard color="#fff"/></li> */}
          <li><MdGroup color="#fff"/><a href="/dashboard/admin/users">Users</a></li>
          <li><CgProfile color="#fff"/><a href="/dashboard/admin/profile">Profile</a></li>
          <li><MdOutlinePendingActions color="#fff"/><a href="/dashboard/admin/pending-avedan">Pending Avedan</a></li>
          <li><RiPassPendingFill color="#fff"/><a href="/dashboard/admin/donations/pending">Pending Donations</a></li>
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
      <main className="userLayoutMain">
                <div className="text-end profileContainer">
          {/* <Link href="/dashboard/user/profile"> */}
          <img
            src={user?.userImage?.url || "/file.svg"}
            alt="Profile"
            className="rounded-circle"
            width="40"
            height="40"
            onClick={() => setOpen(!open)}
            style={{ objectFit: "cover", cursor: "pointer" }}
          />
          {/* </Link> */}
          {open && (
            <div className="profileDropdown">
              <Link href="/dashboard/admin/profile" className="dropdownItem">
                Profile
              </Link>
              <button onClick={handleLogout} className="dropdownItem logoutBtn">
                Logout
              </button>
            </div>
          )}
        </div>
        {children}
        </main>
    </div>
  );
}


