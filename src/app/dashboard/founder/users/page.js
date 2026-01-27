"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

export default function UserVerificationPage() {
    const [users, setUsers] = useState([]);
    const { user, loading } = useContext(AuthContext);
    const [previewImage, setPreviewImage] = useState(null);

    //   const router = useRouter();

    //  Role protection (Admin + Founder)
    //   useEffect(() => {
    //     if (!loading && !["admin", "founder"].includes(user?.role)) {
    //       router.push("/unauthorized");
    //     }
    //   }, [loading, user, router]);

    const fetchUsers = async () => {
        const res = await axios.get("/api/admin/users", {
            withCredentials: true,
        });
        setUsers(res.data.users);
    };

    useEffect(() => {
        if (user) fetchUsers();
    }, [user]);

    const updateStatus = async (id, status) => {
        await axios.patch(
            `/api/admin/users/${id}`,
            { status },
            { withCredentials: true }
        );
        fetchUsers();
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container my-5">
            <h3 className="mb-4">
                {user?.role === "founder"
                    ? "Founder – User Verification"
                    : "Admin – User Verification"}
            </h3>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>S.N</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Transaction Image</th>
                            <th>Transaction Id</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u, i) => (
                            <tr key={u._id}>
                                <td>{i + 1}</td>
                                <td>{u?.name}</td>
                                <td>{u?.email}</td>

                                <td>
                                    <span
                                        className={`badge ${u?.status === "active"
                                            ? "bg-success"
                                            : u?.status === "pending"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                            }`}
                                    >
                                        {u?.status}
                                    </span>
                                </td>

                                <td>
                                    {u?.status === "pending" && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => updateStatus(u._id, "active")}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => updateStatus(u._id, "rejected")}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>

                                <td>
                                    {u?.paymentReceipt?.url ? (
                                        <img
                                            src={u.paymentReceipt.url}
                                            alt="payment slip"
                                            width="100"
                                            height="50"
                                            style={{ objectFit: "cover" }}
                                            onClick={() => setPreviewImage(u.paymentReceipt.url)}
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>{u?.transactionId || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {previewImage && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Payment Receipt</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setPreviewImage(null)}
                                />
                            </div>

                            <div className="modal-body text-center">
                                <img
                                    src={previewImage}
                                    alt="receipt full"
                                    className="img-fluid"
                                    style={{ maxHeight: "70vh" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
