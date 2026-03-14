"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { rajasthanDistricts } from "@/constants/rajasthanDistricts";

export default function UserVerificationPage() {
    const [users, setUsers] = useState([]);
    const { user, loading } = useContext(AuthContext);
    const [previewImage, setPreviewImage] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    //  NEW STATES
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const updateUser = async () => {
        const res = await fetch(`/api/users/${editUser._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editUser),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("User updated successfully");
            setShowEditModal(false);
            fetchUsers(); // reload list
        } else {
            toast.error(data.message || "Failed to update user")
        }
    };

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

    const confirmDelete = (id) => {
        toast(
            <div>
                <p className="mb-2">Are you sure you want to delete this user?</p>
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                            toast.dismiss();
                            deleteUser(id);
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        );
    };

    const deleteUser = async (id) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("User deleted successfully");
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };


    if (loading) return <p>Loading...</p>;

    //  SEARCH FILTER
    const filteredUsers = users
        .filter((u) => u.status !== "deleted")
        .filter(
            (u) =>
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.adharNumber?.includes(search)
        );

    //  PAGINATION
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;

    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    //  RESET PAGE WHEN SEARCH
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);
    //  PAGE NUMBERS
    const getPageNumbers = () => {
        const pages = [];
        const siblingCount = 1;

        const leftSibling = Math.max(currentPage - siblingCount, 1);
        const rightSibling = Math.min(currentPage + siblingCount, totalPages);

        pages.push(1);

        if (leftSibling > 2) pages.push("...");

        for (let i = leftSibling; i <= rightSibling; i++) {
            if (i !== 1 && i !== totalPages) pages.push(i);
        }

        if (rightSibling < totalPages - 1) pages.push("...");

        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };
    return (
        <div className="container my-5">
            <h3 className="mb-4">
                {user?.role === "founder"
                    ? "Founder – User Verification"
                    : "Admin – User Verification"}
            </h3>
            {/*  SEARCH */}
            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search by Name or Aadhaar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="bg-white p-3 rounded shadow-sm border">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>S.N</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Adhaar Number</th>
                                <th>Block Number</th>
                                <th>created date</th>
                                <th>district</th>
                                <th>state</th>

                                <th>DOB</th>
                                <th>fatherorhusbandname</th>
                                <th>gender</th>
                                <th>governmentDepartment</th>
                                <th>mobile</th>
                                <th>nomineeMobile</th>
                                <th>nomineeName</th>
                                <th>nomineeRelation</th>
                                <th>occupation</th>
                                <th>office Address</th>
                                <th>role</th>
                                <th>permanentAddress</th>
                                <th>Status</th>
                                <th>Action</th>
                                <th>Transaction Image</th>
                                <th>Transaction Id</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentUsers.filter((u) => u.status !== "deleted")
                                .map((u, i) => {
                                    return (
                                        <tr key={u._id}>
                                            <td> {(currentPage - 1) * usersPerPage + i + 1}</td>
                                            <td>{u?.name}</td>
                                            <td>{u?.email}</td>
                                            <td>{u?.adharNumber}</td>
                                            <td>{u?.blockNumber || "-"}</td>
                                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td>{u?.district || "-"}</td>
                                            <td>{u?.state || "-"}</td>

                                            <td>{u?.dob || "-"}</td>
                                            <td>{u?.fatherorhusbandname || "-"}</td>
                                            <td>{u?.gender || "-"}</td>
                                            <td>{u?.governmentDepartment || "-"}</td>
                                            <td>{u?.mobile || "-"}</td>
                                            <td>{u?.nomineeMobile || "-"}</td>
                                            <td>{u?.nomineeName || "-"}</td>
                                            <td>{u?.nomineeRelation || "-"}</td>
                                            <td>{u?.occupation || "-"}</td>

                                            <td>{u?.officeNameAddress || "-"}</td>

                                            <td>{u?.role || "-"}</td>

                                            <td>{u?.permanentAddress || "-"}</td>

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
                                                            className="btn btn-danger btn-sm my-2"
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
                                            <td>
                                                <IconButton
                                                    onClick={() => {
                                                        setEditUser(u);
                                                        setShowEditModal(true);
                                                    }}>
                                                    <EditIcon color="success" />
                                                </IconButton>
                                            </td>
                                            <td>
                                                <IconButton
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => confirmDelete(u._id)}
                                                >
                                                    <DeleteIcon color="error" />
                                                </IconButton>


                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (

                    <nav className="mt-3">
                        <ul className="pagination justify-content-center flex-wrap">

                            {/* PREVIOUS */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                >
                                    <FiChevronLeft />
                                </button>
                            </li>

                            {getPageNumbers().map((page, index) => (
                                <li
                                    key={index}
                                    className={`page-item 
                    ${currentPage === page ? "active" : ""} 
                    ${page === "..." ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            page !== "..." && setCurrentPage(page)
                                        }
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}

                            {/* NEXT */}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                >
                                    <FiChevronRight />
                                </button>
                            </li>

                        </ul>
                    </nav>
                )}
            </div>
            {showEditModal && editUser && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowEditModal(false)}
                    />

                    <div className="modal fade show d-block" style={{ zIndex: 10001 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5>Edit User</h5>
                                    <button className="btn-close" onClick={() => setShowEditModal(false)} />
                                </div>

                                <div className="modal-body">
                                    <label className="form-label fw-semibold">Name</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.name || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, name: e.target.value })
                                        }
                                        placeholder="Name"
                                    />
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.email || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, email: e.target.value })
                                        }
                                        placeholder="Email"
                                    />
                                    <label className="form-label fw-semibold">Mobile</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.mobile || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, mobile: e.target.value })
                                        }
                                        placeholder="Mobile"
                                    />

                                    <hr />
                                    <label className="form-label fw-semibold">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        value={editUser.dob || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, dob: e.target.value })
                                        }
                                    />
                                    <label className="form-label fw-semibold">Gender</label>
                                    <select
                                        className="form-control mb-2"
                                        value={editUser.gender || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, gender: e.target.value })
                                        }
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <label className="form-label fw-semibold">Father / Husband Name</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.fatherorhusbandname || ""}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                fatherorhusbandname: e.target.value,
                                            })
                                        }
                                        placeholder="Father/Husband Name"
                                    />
                                    <label className="form-label fw-semibold">Occupation</label>
                                    <select
                                        className="form-control mb-2"
                                        value={editUser.occupation || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, occupation: e.target.value })
                                        }
                                    >
                                        <option value="">Select Occupation</option>
                                        <option value="government">Government</option>
                                        <option value="private">Private</option>
                                        <option value="business">Business</option>
                                        <option value="agriculture">Agriculture</option>
                                        <option value="housewife">Housewife</option>
                                        <option value="student">Student</option>
                                        <option value="contract">Contract</option>
                                        <option value="public_representative">Public Representative</option>
                                    </select>
                                    <label className="form-label fw-semibold">Government Department</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.governmentDepartment || ""}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                governmentDepartment: e.target.value,
                                            })
                                        }
                                        placeholder="Government Department"
                                    />
                                    <label className="form-label fw-semibold">District</label>
                                    <select
                                        className="form-control mb-2"
                                        value={editUser.district || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, district: e.target.value })
                                        }
                                    >
                                        <option value="">Select District</option>
                                        {rajasthanDistricts.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="form-label fw-semibold">Block</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.block || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, block: e.target.value })
                                        }
                                        placeholder="Block"
                                    />
                                    <label className="form-label fw-semibold">Permanent Address</label>
                                    <textarea
                                        className="form-control mb-2"
                                        value={editUser.permanentAddress || ""}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                permanentAddress: e.target.value,
                                            })
                                        }
                                        placeholder="Permanent Address"
                                    />
                                    <label className="form-label fw-semibold">Office Address</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.officeNameAddress || ""}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                officeNameAddress: e.target.value,
                                            })
                                        }
                                        placeholder="Office Address"
                                    />

                                    <label className="form-label fw-semibold">Transaction ID</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.transactionId || ""}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                transactionId: e.target.value,
                                            })
                                        }
                                        placeholder="Transaction ID"
                                    />
                                    <label className="form-label fw-semibold">Nominee Name</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.nomineeName || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, nomineeName: e.target.value })
                                        }
                                        placeholder="Nominee Name"
                                    />
                                    <label className="form-label fw-semibold">Nominee Relation</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.nomineeRelation || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, nomineeRelation: e.target.value })
                                        }
                                        placeholder="Nominee Relation"
                                    />
                                    <label className="form-label fw-semibold">Nominee Mobile</label>
                                    <input
                                        className="form-control mb-2"
                                        value={editUser.nomineeMobile || ""}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, nomineeMobile: e.target.value })
                                        }
                                        placeholder="Nominee Mobile"
                                    />
                                    <label className="form-label fw-semibold">New Password (Optional)</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="New Password (optional)"
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, password: e.target.value })
                                        }
                                    />
                                    <div className="mb-3">
                                        <label className="form-label fw-bold my-2">Status</label>
                                        <select
                                            className="form-control"
                                            value={editUser.status || "pending"}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, status: e.target.value })
                                            }
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="deleted">Deleted</option>
                                        </select>
                                    </div>


                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-success"
                                        onClick={updateUser}
                                    >
                                        Update
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}


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
