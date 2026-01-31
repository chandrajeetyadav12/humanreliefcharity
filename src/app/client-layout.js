"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname.startsWith("/dashboard");

  return (
    <div className="app-wrapper">
      {!hideHeaderFooter && <Header />}
      <main className="main-content">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
