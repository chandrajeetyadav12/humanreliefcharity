"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminPendingDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchPendingDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/donation/pending", {
        withCredentials: true,
      });
      setDonations(res.data.donations);
    } catch (err) {
      toast.error("Failed to load pending donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const handleAction = async (action) => {
    if (!selectedDonation) return;

    if (action === "reject" && !rejectionReason.trim()) {
      toast.error("Rejection reason required");
      return;
    }

    try {
      await axios.patch(
        `/api/admin/donation/verify/${selectedDonation._id}`,
        { action, rejectionReason },
        { withCredentials: true }
      );

      toast.success(`Donation ${action}d`);
      setSelectedDonation(null);
      setRejectionReason("");
      fetchPendingDonations();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <p>Loading pending donations...</p>;

  return (
    <div className="container mt-4">
      <h2>Pending Donations</h2>

      {donations.length === 0 ? (
        <p>No pending donations</p>
      ) : (
        <div className="table-responsive">
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Email</th>
              <th>Avedan</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.donor?.name}</td>
                <td>{donation.donor?.email}</td>
                <td>{donation.avedan?.type.replace("_", " ")}</td>
                <td>₹{donation.amount}</td>
                <td>{donation.paymentMode}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedDonation(donation)}
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

      {/* MODAL */}
      {selectedDonation && (
        <div className="modal d-block" style={{ zIndex: 10001, background: "rgba(0,0,0,.5)" }}>
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
                <p><b>Donor:</b> {selectedDonation.donor.name}</p>
                <p><b>Email:</b> {selectedDonation.donor.email}</p>
                <p><b>Transaction ID:</b> {selectedDonation.transactionId}</p>
                <p><b>Avedan:</b> {selectedDonation.avedan.type}</p>
                <p><b>Amount:</b> ₹{selectedDonation.amount}</p>
                <p><b>Payment Mode:</b> {selectedDonation.paymentMode}</p>
                <p><b>Status:</b> {selectedDonation.status}</p>

                {selectedDonation.receipt?.url && (
                  <>
                    <hr />
                    <p><b>Receipt:</b></p>
                    <ul>
                      {selectedDonation.receipt && (
                        <li>
                          <b>Payment Receipt</b>{" "}
                          {selectedDonation.verifiedByAdmin ? "✔" : "❌"}
                          <br />
                          <a
                            href={selectedDonation.receipt.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Document
                          </a>
                        </li>
                      )}
                    </ul>

                    {/* <img
                      src={selectedDonation.receipt.url}
                      alt="Receipt"
                      className="img-fluid rounded border"
                    /> */}
                  </>
                )}

                <hr />
                <textarea
                  className="form-control"
                  placeholder="Rejection reason (only if rejecting)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => handleAction("approve")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
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
