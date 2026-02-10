"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MyDonationsPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user donations
    const fetchMyDonations = async () => {
        try {
            const res = await axios.get("/api/users/donation/my", {
                withCredentials: true,
            });
            setDonations(res.data.donations);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDonations();
    }, []);

    // Group donations by avedan type
    const grouped = donations.reduce((acc, d) => {
        const type = d.avedan?.type || "Other";
        if (!acc[type]) acc[type] = [];
        acc[type].push(d);
        return acc;
    }, {});

    // Status badge
    const statusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="badge bg-warning">Pending</span>;
            case "admin_verified":
                return <span className="badge bg-info">Admin Verified</span>;
            case "founder_approved":
                return <span className="badge bg-success">Approved</span>;
            case "rejected":
                return <span className="badge bg-danger">Rejected</span>;
            default:
                return status;
        }
    };

    if (loading) return <p className="p-4">Loading donations...</p>;

    return (
        <div className="container mt-4">

            {/* ===== Summary Cards ===== */}
            <h3 className="mb-3">Summary</h3>
            <div className="row mb-4">
                {Object.keys(grouped).map((type) => {
                    const validDonations = grouped[type].filter(
                        (d) => {
                            console.log(d.status)
                            return d.status !== "rejected"&& d.status!=="admin_verified"&& d.status!=="pending"
                        }
                    );

                    const total = validDonations.reduce(
                        (sum, d) => sum + d.amount,
                        0
                    );
                    //   const total = grouped[type].reduce((sum, d) => sum + d.amount, 0);
                    return (
                        <div key={type} className="col-md-4 mb-3">
                            <div className="card shadow-sm">
                                <div className="card-body text-center">
                                    <h5 className="card-title">{type.replace("_", " ")}</h5>
                                    <p className="card-text">
                                        You helped <b>{validDonations.length}</b> donation(s)
                                    </p>
                                    <p className="card-text">
                                        <b>Total:</b> ₹{total}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== Detailed Donations ===== */}
            <h3 className="mb-3">All Donations</h3>
            {donations.length === 0 ? (
                <p>You haven’t made any donations yet.</p>
            ) : (
                Object.keys(grouped).map((type) => (
                    <div key={type} className="mb-4">
                        <h5>{type.replace("_", " ")}</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Applicant</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grouped[type].map((d) => (
                                        <tr key={d._id}>
                                            <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {d.avedan?.applicant?.name}
                                                <br />
                                                <small>{d.avedan?.applicant?.mobile}</small>
                                                <br />
                                                <small>{d.avedan?.applicant?.address}</small>
                                            </td>
                                            <td>₹{d.amount}</td>
                                            <td>{d.paymentMode}</td>
                                            <td>
                                                {statusBadge(d.status)}
                                                <div className="small mt-1">
                                                    {d.status === "rejected" && (
                                                        <>Reason: {d.rejectionReason}</>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {d.receipt?.url ? (
                                                    <a
                                                        href={d.receipt.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        View
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
