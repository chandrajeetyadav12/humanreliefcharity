"use client";

import AuthProvider from "@/context/AuthProvider";
import ClientLayout from "./client-layout";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ClientLayout>{children}</ClientLayout>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
