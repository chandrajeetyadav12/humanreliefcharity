"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function FounderPendingDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  //  Fetch pending donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/founder/donation/pending", {
        withCredentials: true,
      });
      setDonations(res.data.donations);
    } catch (err) {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  //  Approve / Reject handler
  const handleAction = async (action) => {
    if (!selectedDonation) return;

    if (action === "reject" && !rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      setActionLoading(true);

      await axios.patch(
        `/api/founder/donation/verify/${selectedDonation._id}`,
        {
          action,
          reason: rejectionReason,
        },
        { withCredentials: true }
      );

      toast.success(
        action === "approve"
          ? "Donation approved"
          : "Donation rejected"
      );

      setSelectedDonation(null);
      setRejectionReason("");
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="p-4">Loading donations...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Pending Donations (Admin Verified)</h3>

      {donations.length === 0 ? (
        <p>No pending donations</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Email</th>
                <th>Avedan</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((d) => (
                <tr key={d._id}>
                  <td>{d.donor?.name}</td>
                  <td>{d.donor?.email}</td>
                  <td>{d.avedan?.type}</td>
                  <td>₹{d.amount}</td>
                  <td>{d.paymentMode}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedDonation(d)}
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
      {selectedDonation && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 10000 }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Donation Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedDonation(null)}
                />
              </div>

              <div className="modal-body">
                <p><b>Donor:</b> {selectedDonation.donor?.name}</p>
                <p><b>Email:</b> {selectedDonation.donor?.email}</p>
                <p><b>Amount:</b> ₹{selectedDonation.amount}</p>
                <p><b>Payment Mode:</b> {selectedDonation.paymentMode}</p>
                <p><b>Transaction ID:</b> {selectedDonation.transactionId}</p>
                <p><b>Status:</b> {selectedDonation.status}</p>

                {selectedDonation.receipt?.url && (
                  <>
                    <hr />
                    <b>Receipt:</b><br />
                    <a
                      href={selectedDonation.receipt.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm mt-1"
                    >
                      View Receipt
                    </a>
                  </>
                )}

                <hr />
                <textarea
                  className="form-control"
                  placeholder="Rejection reason (required if rejecting)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={() => handleAction("approve")}
                >
                  Approve
                </button>

                <button
                  className="btn btn-danger"
                  disabled={actionLoading}
                  onClick={() => handleAction("reject")}
                >
                  Reject
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedDonation(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
