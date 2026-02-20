"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AvedanCard } from "./AvedanCard";
import {
  FaFileAlt,
  FaClock,
  FaUserCheck,
  FaCrown,
  FaTimesCircle,
  FaFemale,
  FaHeartbeat,
  FaCheckDouble,
  FaHourglassHalf,
} from "react-icons/fa"
export const AvedanInfo = ({ role }) => {
     const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
    axios
      .get("/api/admin/dashboard/avedans/states", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);
    if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }
    if (!stats) {
    return (
      <div className="text-center mt-5 text-danger">
        Failed to load Avedan stats
      </div>
    );
  }
 return (
    <div className="container mt-4">
      <h4 className="mb-4">Avedan Dashboard</h4>

      <div className="row g-4">
        {/* COMMON */}
        <AvedanCard title="Total Avedan" value={stats.total} icon={<FaFileAlt />} color="primary" />
        <AvedanCard title="Beti Vivah" value={stats.betiVivah} icon={<FaFemale />} color="secondary" />
        <AvedanCard title="Untimely Death" value={stats.untimelyDeath} icon={<FaHeartbeat />} color="dark" />

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <>
            <AvedanCard title="Pending" value={stats.pending} icon={<FaClock />} color="warning" />
            <AvedanCard title="Rejected" value={stats.rejected} icon={<FaTimesCircle />} color="danger" />
          </>
        )}

        {/* ADMIN + FOUNDER */}
        {["admin", "founder"].includes(role) && (
          <AvedanCard
            title="Admin Verified"
            value={stats.adminVerified}
            icon={<FaUserCheck />}
            color="info"
          />
        )}

        {/* FOUNDER ONLY */}
        {role === "founder" && (
          <>
            <AvedanCard
              title="Founder Approved"
              value={stats.founderApproved}
              icon={<FaCrown />}
              color="success"
            />
            <AvedanCard
              title="Completed"
              value={stats.completed}
              icon={<FaCheckDouble />}
              color="success"
            />
            <AvedanCard
              title="Ongoing"
              value={stats.ongoing}
              icon={<FaHourglassHalf />}
              color="warning"
            />
          </>
        )}
      </div>
    </div>
  );

}
