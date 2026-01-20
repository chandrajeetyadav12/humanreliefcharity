"use client";
import Link from "next/link";
// import { useContext } from "react";
// import { AuthContext } from "@/context/AuthContext";

export default function Header() {
    //   const { user, logout } = useContext(AuthContext);

    return (
        <header className="">
           
            <div className="topheader px-2">
                <div className="leftt_top_header">
                <p>address uttar pradesh allahabad</p>
                </div>
                <div className="rightheader">
                 <ul>
                    <li>facebook</li>
                    <li>twitter</li>
                    <li>instagram</li>
                 </ul>
                </div>
            </div>
            <div className="headerMain_Contianer px-2">
                <div className="logocontainer">Human Relief</div>
                <div className="mainheader_MenuContainer">
                    <Link href="#">About us</Link>
                    <Link href="#">Contact us</Link>
                    <Link href="#">Beti Vivah Sahyog Suchi</Link>
                    <Link href="#">Untimely Death Sahyog Suchi</Link>
                    <Link href="#">Registered members List</Link>
                    <Link href="/register">Registration</Link>
                    <Link href="/login">Login</Link>
                    <Link href="#">QR Code for Donation</Link>

                </div>
                {/* <div className="rightSideMenuContainer">
                <Link href="/">Human Relief</Link>
            </div> */}



                {/* {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link href="/login">Login</Link>
      )} */}
            </div>

        </header>
    );
}
