"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import FounderApprovedAvedans from "../components/avedan/FounderApprovedAvedans";

export default function UserDashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "user") {
        // Redirect other roles
        if (user.role === "founder") router.replace("/dashboard/founder");
        else if (user.role === "admin") router.replace("/dashboard/admin");
        else router.replace("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) return <p>Loading dashboard...</p>;

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.name}</h2>

      {user.status !== "active" && (
        <div className="alert alert-warning mt-3">
          Your account is under verification by admin.
        </div>
      )}

      {user.status === "active" && (
        <div className="mt-4">
          <h4>जन-कल्याण सहायता आवेदन</h4>
          <div className="d-flex gap-3 mt-3">
            <Link href="/dashboard/user/avedan/apply?type=beti_vivah">
              <button className="btn btn-success">
                बेटी विवाह सहयोग हेतु आवेदन
              </button>
            </Link>
            <Link href="/dashboard/user/avedan/apply?type=untimely_death">
              <button className="btn btn-warning text-white">
                आकस्मिक (असमय) निधन हेतु आवेदन
              </button>
            </Link>
          </div>
        </div>
      )}

      <FounderApprovedAvedans />
    </div>
  );
}
