"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminProfile() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();
    console.log(user);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push("/login");
            } else if (user?.role !== "admin") {
                router.push("/unauthorized");
            }
        }
    }, [loading, isAuthenticated, user]);

    if (loading) return <p>Loading...</p>;

    return (
      <div className="container mt-4">
  <div className="row justify-content-center">
    <div className="col-12 col-sm-10 col-md-8 col-lg-6">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white text-center">
          <h5 className="mb-0">Admin Profile</h5>
        </div>

        <div className="card-body text-center">

          {/* Admin Profile Image */}
          <img
            src={user?.profileImage || "/file.svg"}
            alt="Admin Profile"
            className="rounded-circle mb-3 border"
            width="120"
            height="120"
            style={{ objectFit: "cover" }}
          />

          <div className="row mb-3 text-start">
            <div className="col-4 fw-bold">Name</div>
            <div className="col-8 text-break">
              {user?.name}
            </div>
          </div>

          <div className="row mb-3 text-start">
            <div className="col-4 fw-bold">Email</div>
            <div className="col-8 text-break">
              {user?.email}
            </div>
          </div>

          <div className="row mb-3 text-start">
            <div className="col-4 fw-bold">Mobile</div>
            <div className="col-8">
              {user?.mobile || "-"}
            </div>
          </div>

          <div className="row text-start">
            <div className="col-4 fw-bold">Status</div>
            <div className="col-8">
              <span className="badge bg-success text-uppercase">
                {user?.status}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>


    );
}
