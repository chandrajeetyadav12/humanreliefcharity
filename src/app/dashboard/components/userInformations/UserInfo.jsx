"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa"
import axios from "axios";
export const UserInfo =  ({panel}) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
  const getDashboardStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        withCredentials: true,
      });

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };
  getDashboardStats();
    }, []);
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }
    if (!stats) {
        return (
            <div className="container mt-5 text-center text-danger">
                Failed to load dashboard data
            </div>
        );
    }
    return (
        <div className="container mt-4">
            <h3 className="mb-4">{panel}</h3>

            <div className="row g-4">
                {/* TOTAL USERS */}
                <div className="col-lg-3 col-md-6 col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <FaUsers size={30} className="text-primary mb-2" />
                            <h6 className="text-muted">Total Users</h6>
                            <h3>{stats.totalUsers}</h3>
                        </div>
                    </div>
                </div>

                {/* ACTIVE USERS */}
                <div className="col-lg-3 col-md-6 col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <FaCheckCircle size={30} className="text-success mb-2" />
                            <h6 className="text-muted">Active Users</h6>
                            <h3>{stats.activeUsers}</h3>
                        </div>
                    </div>
                </div>

                {/* PENDING USERS */}
                <div className="col-lg-3 col-md-6 col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <FaClock size={30} className="text-warning mb-2" />
                            <h6 className="text-muted">Pending Users</h6>
                            <h3>{stats.pendingUsers}</h3>
                        </div>
                    </div>
                </div>

                {/* REJECTED USERS */}
                <div className="col-lg-3 col-md-6 col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <FaTimesCircle size={30} className="text-danger mb-2" />
                            <h6 className="text-muted">Rejected Users</h6>
                            <h3>{stats.rejectedUsers}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
