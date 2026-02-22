"use client";

import { useEffect, useState } from "react";

export default function FounderApprovedPage() {
    const [avedans, setAvedans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [closingId, setClosingId] = useState(null);

    // Fetch Founder Approved Avedans
    const fetchApproved = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/founder/avedan/approved");
            const data = await res.json();
            setAvedans(data.avedans || []);
        } catch (error) {
            alert("Failed to fetch avedans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApproved();
    }, []);

    // Close Avedan
    const handleClose = async (id) => {
        const confirmClose = confirm(
            "Are you sure you want to close this Avedan?"
        );

        if (!confirmClose) return;

        try {
            setClosingId(id);

            const res = await fetch("/api/founder/avedan/close", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avedanId: id }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error closing avedan");
                return;
            }

            alert("Avedan closed successfully");
            fetchApproved(); // refresh list
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setClosingId(null);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Founder Approved Avedan</h3>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary"></div>
                </div>
            ) : avedans.length === 0 ? (
                <div className="alert alert-info">
                    No founder approved avedans found.
                </div>
            ) : (
                <div className="bg-white p-3 rounded shadow-sm border">

                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>No.</th>
                                    <th>Applicant</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {avedans.map((a, index) => (
                                    <tr key={a._id}>
                                        <td>{index + 1}</td>
                                        <td>{a.applicant?.name}</td>
                                        <td>{a.type}</td>
                                        <td>{a.description}</td>
                                        <td>
                                            <span className="badge bg-success">
                                                {a.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                disabled={closingId === a._id}
                                                onClick={() => handleClose(a._id)}
                                            >
                                                {closingId === a._id
                                                    ? "Closing..."
                                                    : "Close"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}