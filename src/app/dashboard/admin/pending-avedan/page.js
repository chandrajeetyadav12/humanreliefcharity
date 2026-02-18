"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PendingAvedanPage() {
  const [avedans, setAvedans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedAvedan, setSelectedAvedan] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingAvedans = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/avedan/pending", {
        withCredentials: true,
      });
      setAvedans(res.data.avedans);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAvedans();
  }, []);

  // VERIFY API
  const verifyAvedan = async () => {
    if (!selectedAvedan) return;

    try {
      setActionLoading(true);
      const res = await axios.patch(
        "/api/admin/avedan/verify",
        { avedanId: selectedAvedan._id },
        { withCredentials: true }
      );

      alert(res.data.message);
      closeModal();
      fetchPendingAvedans();
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setActionLoading(false);
    }
  };

  // REJECT API
  const rejectAvedan = async () => {
    if (!rejectReason.trim()) {
      return alert("Rejection reason is required");
    }

    try {
      setActionLoading(true);
      const res = await axios.patch(
        "/api/admin/avedan/reject",
        {
          avedanId: selectedAvedan._id,
          reason: rejectReason,
        },
        { withCredentials: true }
      );

      alert(res.data.message);
      closeModal();
      fetchPendingAvedans();
    } catch (err) {
      alert(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedAvedan(null);
    setRejectReason("");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Pending Avedan</h2>

      {avedans.length === 0 ? (
        <p>No pending Avedan.</p>
      ) : (
        <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              {/* <th>Amount</th> */}
              <th>Created</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {avedans.map((a) => (
              <tr key={a._id}>
                <td>
                  {a.applicant?.name} <br />
                  {a.applicant?.mobile}
                </td>
                <td>{a.type}</td>
                {/* <td>₹{a.requiredAmount}</td> */}
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedAvedan(a)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedAvedan && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Avedan Details</h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body">
                <p><strong>Description:</strong> {selectedAvedan.description}</p>
                {/* <p><strong>Required Amount:</strong> ₹{selectedAvedan.requiredAmount}</p> */}
                <p><strong>Applicant Name: </strong>{selectedAvedan.applicant?.name}</p>

                <hr />
                <h6>Uploaded Documents</h6>
                <ul>
                  {selectedAvedan.documents.map((doc, i) => (
                    <li key={i}>
                      {doc.label} —{" "}
                      <a href={doc.file.url} target="_blank">
                        View Document
                      </a>
                    </li>
                  ))}
                </ul>

                <hr />
                <h6>Rejection Reason (only if rejecting)</h6>
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>

                <button
                  className="btn btn-danger"
                  disabled={actionLoading}
                  onClick={rejectAvedan}
                >
                  Reject
                </button>

                <button
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={verifyAvedan}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}
    </div>
  );
}
