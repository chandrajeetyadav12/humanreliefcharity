"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Include credentials to send cookie
        const res = await axios.get("/api/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!user) return <p>Please login first.</p>;

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.name}</h2>

      {/* USER NOT ACTIVE */}
      {user.role === "user" && user.status !== "active" && (
        <div className="alert alert-warning mt-3">
          Your account is under verification by admin.
        </div>
      )}

      {/* USER ACTIVE → SHOW AVEDAN APPLY */}
      {user.role === "user" && user.status === "active" && (
        <div className="mt-4">
          <h4>Apply for Avedan</h4>

          <div className="d-flex gap-3 mt-3">
            <Link href="/dashboard/user/avedan/apply?type=beti_vivah">
              <button className="btn btn-success">
                Apply Beti Vivah Avedan
              </button>
            </Link>

            <Link href="/dashboard/user/avedan/apply?type=untimely_death">
              <button className="btn btn-warning">
                Apply Untimely Death Avedan
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
