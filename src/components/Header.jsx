"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1026);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const openSidebar = () => {
    setSidebarOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.classList.remove("no-scroll");
  };

  return (
    <>
      {/* TOP HEADER */}
      <div className="topheader">
        <ul>
          <li><CallIcon /> <span>+91 98765 43210</span></li>
          <li><EmailIcon /> hrct@gmail.com</li>
          <li><HomeIcon /> Varanasi (UP) - 270093</li>
        </ul>
      </div>

      {/* MAIN HEADER */}
      <header className="mainHeader">
        <div className="logo">Human Relief</div>

        {/* DESKTOP MENU */}
        {!isMobile && (
          <nav className="desktopMenu">
            <Link href="#">About us</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="#">Beti Vivah Sahyog Suchi</Link>
            <Link href="#">Untimely Death Sahyog Suchi</Link>
            <Link href="/member">Registered Members</Link>
                      {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <Link href="/register">Registration</Link>
              <Link href="/login">Login</Link>
            </>
          )}
                    {/* LOGGED IN USER */}
          {isAuthenticated && user?.role === "user" && (
            <>
              <Link href="/dashboard/user">Dashboard</Link>
              <button onClick={handleLogout} className="logoutBtn">
                Logout
              </button>
            </>
          )}
                    {/* LOGGED IN ADMIN */}
          {isAuthenticated && user?.role === "admin" && (
            <>
              <Link href="/dashboard/admin">Admin Panel</Link>
              <button onClick={handleLogout} className="logoutBtn">
                Logout
              </button>
            </>
          )}
            {/* <Link href="/register">Registration</Link> */}
            {/* <Link href="/login">Login</Link> */}
            <Link href="#">QR Code</Link>
          </nav>
        )}

        {/* MOBILE ICON */}
        {isMobile && (
          <div className="hamburger">
            {sidebarOpen ? (
              <IoMdClose size={26} onClick={closeSidebar} />
            ) : (
              <GiHamburgerMenu size={26} onClick={openSidebar} />
            )}
          </div>
        )}
      </header>

      {/* OVERLAY */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* MOBILE SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? "active" : ""}`}
      >
        <Link href="/">Home</Link>
        <Link href="#">About us</Link>
        <Link href="/contact">Contact us</Link>
        <Link href="#">Beti Vivah Sahyog Suchi</Link>
        <Link href="#">Untimely Death Sahyog Suchi</Link>
        <Link href="/member">Registered Members</Link>
                  {!isAuthenticated && (
            <>
              <Link href="/register">Registration</Link>
              <Link href="/login">Login</Link>
            </>
          )}
                    {/* LOGGED IN USER */}
          {isAuthenticated && user?.role === "user" && (
            <>
              <Link href="/dashboard/user">Dashboard</Link>
              <button onClick={handleLogout} className="logoutBtn">
                Logout
              </button>
            </>
          )}
                    {isAuthenticated && user?.role === "admin" && (
            <>
              <Link href="/dashboard/admin">Admin Panel</Link>
              <button onClick={handleLogout} className="logoutBtn">
                Logout
              </button>
            </>
          )}
     
        <Link href="#">QR Code</Link>
      </aside>
    </>
  );
}
