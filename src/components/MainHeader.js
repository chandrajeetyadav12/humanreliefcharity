"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Niyamwali from "@/app/Niyamawali/page";
export const MainHeader = () => {
    const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
    // console.log(user?.role)
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const getDashboardLink = () => {
        if (!user) return "/";

        switch (user.role) {
            case "admin":
                return "/dashboard/admin";
            case "founder":
                return "/dashboard/founder";
            case "user":
                return "/dashboard/user";
            default:
                return "/";
        }
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
    if (loading) {
        return null;
    }
    return (
        <>
            {/* MAIN HEADER */}
            <header className="mainHeader py-4">
                <div className="logo center">
                            <Image
                              src="/hrct_logo.jpeg"
                              alt="My Image"
                              width={90}
                              height={90}
                            //   className="img-fluid"
                            />
                </div>




                {/* DESKTOP MENU */}
                {!isMobile && (
                    <nav className="desktopMenu">
                        <Link href="/aboutus">About us</Link>
                        <Link href="/contact">Contact us</Link>
                        <Link href="/sahyog/beti_vivah">Beti Vivah Sahyog Suchi</Link>
                        <Link href="/sahyog/untimely_death">Untimely Death Sahyog Suchi</Link>
                        <Link href="/member">Registered Members</Link>
                        <Link href="/Niyamawali">Niyamawali</Link>
                        {/* AUTH SECTION */}
                        {loading ? (
                            // while auth is checking
                            <>
                                <span className="skeleton">Login</span>
                                <span className="skeleton">Register</span>
                            </>
                        ) : isAuthenticated ? (
                            // logged in
                            <>
                                <Link href={getDashboardLink()}>Dashboard</Link>
                                <button className="logoutBtn" onClick={logout}>Logout</button>
                            </>
                        ) : (
                            // not logged in
                            <>
                                <Link href="/register">Registration</Link>
                                <Link href="/login">Login</Link>
                            </>
                        )}
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
                <Link href="/aboutus">About us</Link>
                <Link href="/contact">Contact us</Link>
                <Link href="/Niyamawali">Niyamawali</Link>
                <Link href="/sahyog/beti_vivah">Beti Vivah Sahyog Suchi</Link>
                <Link href="/sahyog/untimely_death">Untimely Death Sahyog Suchi</Link>
                <Link href="/member">Registered Members</Link>
                {loading ? (
                    // while auth is checking
                    <>
                        <span className="skeleton">Login</span>
                        <span className="skeleton">Register</span>
                    </>
                ) : isAuthenticated ? (
                    // logged in
                    <>
                        <Link href={getDashboardLink()}>Dashboard</Link>
                        <button className="logoutBtn" onClick={logout}>Logout</button>
                    </>
                ) : (
                    // not logged in
                    <>
                        <Link href="/register">Registration</Link>
                        <Link href="/login">Login</Link>
                    </>
                )}
                {/* <Link href="#">QR Code</Link> */}
            </aside>
        </>
    )
}
