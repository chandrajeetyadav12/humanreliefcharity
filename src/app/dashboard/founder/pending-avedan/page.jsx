"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FounderPendingAvedanPage() {
    const [avedans, setAvedans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedAvedan, setSelectedAvedan] = useState(null);
    const [loadingView, setLoadingView] = useState(false);
    const openViewModal = async (avedanId) => {
        try {
            setLoadingView(true);
            const res = await axios.get(`/api/avedan/${avedanId}`, {
                withCredentials: true,
            });

            setSelectedAvedan(res.data.avedan);
            setShowModal(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to load details");
        } finally {
            setLoadingView(false);
        }
    };

    const fetchPendingAvedans = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/founder/avedan/pending", { withCredentials: true });
            setAvedans(res.data.avedans);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch");
        } finally {
            setLoading(false);
        }
    };

    const decideAvedan = async (avedanId, decision) => {
        if (!confirm(`Are you sure you want to ${decision} this Avedan?`)) return;

        try {
            const res = await axios.patch("/api/founder/avedan/decision", { avedanId, decision }, { withCredentials: true });
            alert(res.data.message);
            fetchPendingAvedans(); // refresh list
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Action failed");
        }
    };

    useEffect(() => {
        fetchPendingAvedans();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>Verified Avedan Pending Founder Decision</h2>
            {avedans.length === 0 ? (
                <p>No verified Avedan for approval.</p>
            ) : (
                <div>
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
                            {avedans.map(a => (
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
                                        <button className="btn btn-success me-2" onClick={() => decideAvedan(a._id, "approved")}>Approve</button>
                                        <button className="btn btn-danger" onClick={() => decideAvedan(a._id, "rejected")}>Reject</button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => openViewModal(a._id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showModal && (
                        <div className="modal fade show d-block" style={{ zIndex: 10001, background: "rgba(0,0,0,.5)" }}>
                            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">Avedan Details</h5>
                                        <button className="btn-close" onClick={() => setShowModal(false)} />
                                    </div>

                                    <div className="modal-body">
                                        {loadingView ? (
                                            <p>Loading...</p>
                                        ) : (
                                            selectedAvedan && (
                                                <>
                                                    {/* APPLICANT INFO */}
                                                    <h6>Applicant</h6>
                                                    <p>
                                                        <b>Name:</b> {selectedAvedan.applicant.name}<br />
                                                        <b>Email:</b> {selectedAvedan.applicant.email}<br />
                                                        <b>Mobile:</b> {selectedAvedan.applicant.mobile}<br />
                                                        <b>Aadhaar:</b> {selectedAvedan.applicant.adharNumber}
                                                    </p>

                                                    <hr />

                                                    {/* AVEDAN INFO */}
                                                    <h6>Avedan</h6>
                                                    <p>
                                                        <b>Type:</b> {selectedAvedan.type}<br />
                                                        <b>Description:</b> {selectedAvedan.description}<br />
                                                        <b>Status:</b> {selectedAvedan.status}
                                                    </p>

                                                    <hr />

                                                    {/* DOCUMENTS */}
                                                    <h6>Documents</h6>
                                                    <ul>
                                                        {selectedAvedan.documents.map((doc, i) => (
                                                            <li key={i}>
                                                                <b>{doc.label}</b>{" "}
                                                                {doc.verified ? "✅" : "❌"} <br />
                                                                <a href={doc.file.url} target="_blank">
                                                                    View Document
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <hr />

                                                    {/* BANK DETAILS (Founder Approved Only) */}
                                                    {selectedAvedan.status === "founder_approved" && (
                                                        <>
                                                            <h6>Bank Details</h6>
                                                            <p>
                                                                <b>Account Holder:</b> {selectedAvedan.bankDetails.accountHolderName}<br />
                                                                <b>Bank:</b> {selectedAvedan.bankDetails.bankName}<br />
                                                                <b>Account No:</b> {selectedAvedan.bankDetails.accountNumber}<br />
                                                                <b>IFSC:</b> {selectedAvedan.bankDetails.ifsc}
                                                            </p>

                                                            <img
                                                                src={selectedAvedan.bankDetails.upiQrUrl}
                                                                alt="UPI QR"
                                                                width={180}
                                                            />
                                                        </>
                                                    )}
                                                </>
                                            )
                                        )}
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>

                                        {/* ADMIN ACTION */}
                                        {selectedAvedan?.status === "pending" && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => verifyAvedan(selectedAvedan._id)}
                                            >
                                                Verify
                                            </button>
                                        )}

                                        {/* FOUNDER ACTION */}
                                        {selectedAvedan?.status === "admin_verified" && (
                                            <>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => decideAvedan(selectedAvedan._id, "approved")}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => decideAvedan(selectedAvedan._id, "rejected")}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
