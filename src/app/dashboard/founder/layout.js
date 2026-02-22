"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiPassPendingFill } from "react-icons/ri";
import { FaUsersBetweenLines } from "react-icons/fa6";
export default function FounderLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } =
    useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      }

      if (isAuthenticated && user?.role !== "founder") {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "founder") return null;

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
        <h5 className="mb-3 text-white">Founder Panel</h5>

        <ul className="list-unstyled userAsideUL">
          <li>
            <MdDashboard color="#fff" /> <Link href="/dashboard/founder">Dashboard</Link>
          </li>
          <li>
            <CgProfile color="#fff" /><Link href="/dashboard/founder/profile">My Profile</Link>
          </li>
          <li>
            <RiPassPendingFill color="#fff" /> <Link href="/dashboard/founder/pending-avedan">
              Pending Avedan
            </Link>
          </li>
            {/* <li>
            <RiPassPendingFill color="#fff" /> <Link href="/dashboard/founder/avedan/approved">
              All Avedan
            </Link>
            </li> */}
          {/* <li>
            <Link href="/dashboard/founder/admins">Admins</Link>
          </li> */}
          <li>
            <FaUsersBetweenLines color="#fff" /> <Link href="/dashboard/founder/users">Users</Link>
          </li>
          <li>
            <MdOutlinePendingActions color="#fff" /><Link href="/dashboard/founder/donations">Pending Donations</Link>
          </li>
          {/* <li>
            <Link href="/dashboard/founder/settings">
              System Settings
            </Link>
          </li> */}
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
        <div className="profileContainer">
          <img
            src={user?.userImage?.url || "/file.svg"}
            alt="Profile"
            className="rounded-circle"
            width="40"
            height="40"
            onClick={() => setOpen(!open)}
            style={{ objectFit: "cover", cursor: "pointer" }}
          />
          {open && (
            <div className="profileDropdown">
              <Link href="/dashboard/founder/profile" className="dropdownItem">
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


