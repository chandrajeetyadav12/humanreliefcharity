"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PendingAvedanPage() {
  const [avedans, setAvedans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingAvedans = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/avedan/pending", { withCredentials: true });
      setAvedans(res.data.avedans);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const verifyAvedan = async (avedanId) => {
    if (!confirm("Are you sure you want to verify this Avedan?")) return;

    try {
      const res = await axios.patch("/api/admin/avedan/verify", { avedanId }, { withCredentials: true });
      alert(res.data.message);
      fetchPendingAvedans(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    fetchPendingAvedans();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Pending Avedan</h2>
      {avedans.length === 0 ? (
        <p>No pending Avedan.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Action</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {avedans.map((a) => (
              <tr key={a._id}>
                <td>
                  {a.applicant?.name} <br />
                  {a.applicant?.email} <br />
                  {a.applicant?.mobile}
                </td>
                <td>{a.type}</td>
                <td>{a.description}</td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => verifyAvedan(a._id)}
                  >
                    Verify
                  </button>
                </td>
                <td>view</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
