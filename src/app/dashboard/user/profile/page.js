"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MemberDashboard() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();
    // console.log(user)
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
           <div className="row justify-content-center">
  <div className="col-12 col-md-10 col-lg-8">
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white text-center">
        <h5 className="mb-0">User Profile</h5>
      </div>

      <div className="card-body text-center">

        {/* Profile Image */}
        <img
          src={user?.userImage?.url || "/file.svg"}
          alt="User Profile"
          className="rounded-circle mb-3 border"
          width="120"
          height="120"
          style={{ objectFit: "cover" }}
        />

        <h4 className="card-title mb-4">
          <span className="text-primary text-uppercase">
            {user?.name}
          </span>
        </h4>

        <div className="text-start">
          <div className="row mb-2">
            <div className="col-sm-4 fw-bold">Email</div>
            <div className="col-sm-8 text-break">{user?.email}</div>
          </div>

          <div className="row mb-2">
            <div className="col-sm-4 fw-bold">Aadhar Number</div>
            <div className="col-sm-8">{user?.adharNumber || "-"}</div>
          </div>

          <div className="row mb-2">
            <div className="col-sm-4 fw-bold">Occupation</div>
            <div className="col-sm-8">{user?.occupation || "-"}</div>
          </div>

          <div className="row mb-2">
            <div className="col-sm-4 fw-bold">Nominee Name</div>
            <div className="col-sm-8">{user?.nomineeName || "-"}</div>
          </div>

          <div className="row mb-2">
            <div className="col-sm-4 fw-bold">Nominee Relation</div>
            <div className="col-sm-8">{user?.nomineeRelation || "-"}</div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-4 fw-bold">Transaction ID</div>
            <div className="col-sm-8 text-break">
              {user?.transactionId || "-"}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 fw-bold">Status</div>
            <div className="col-sm-8">
              <span
                className={`badge ${
                  user?.status === "active"
                    ? "bg-success"
                    : user?.status === "pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {user?.status}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>


        </div>

    );
}
