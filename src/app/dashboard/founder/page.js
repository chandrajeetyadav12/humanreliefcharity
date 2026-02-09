"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { UserInfo } from "../components/userInformations/UserInfo";
import { AvedanInfo } from "../components/AvedanInformations/AvedanInfo";
export default function FounderDashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "founder")) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return <div>
    <UserInfo panel="Founder Dashboard"/>
    <AvedanInfo role={user.role}/>
  </div>;
}
