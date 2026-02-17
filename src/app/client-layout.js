"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className={`app-wrapper ${isDashboard?"dashboard":"public"}`}>
      {!isDashboard && <Header />}
      <main className="main-content">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
}
