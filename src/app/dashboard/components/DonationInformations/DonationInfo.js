"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaDonate,
  FaClock,
  FaTimesCircle,
  FaRupeeSign,
} from "react-icons/fa";

export default function DonationInfo({ role }) {
  const [donations, setDonations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/dashboard/donationinfo", {
        withCredentials: true,
      })
      .then((res) => {
        setDonations(res.data.donations);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!donations) return <p className="text-center mt-5">No data</p>;

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-capitalize">
         Donation Details
      </h4>

      <div className="row g-3">
        <StatCard icon={<FaDonate />} title="Total" value={donations.total} />
        <StatCard icon={<FaClock />} title="Pending" value={donations.pending} />
        <StatCard icon={<FaTimesCircle />} title="Rejected" value={donations.rejected} />
        <StatCard
          icon={<FaRupeeSign />}
          title="Approved Amount"
          value={`₹ ${donations.amount}`}
        />
      </div>

      {/* ROLE BASED UI */}
      {role === "admin" && (
        <div className="alert alert-info mt-4">
          Admin: Monitoring all donations
        </div>
      )}

      {role === "founder" && (
        <div className="alert alert-success mt-4">
          Founder: Final approval authority
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="col-md-3">
      <div className="card shadow-sm border-0 text-center">
        <div className="card-body">
          <div className="text-primary fs-3 mb-2">{icon}</div>
          <h6>{title}</h6>
          <h4>{value}</h4>
        </div>
      </div>
    </div>
  );
}
