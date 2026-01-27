"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
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

  const viewUser = async (id) => {
    const res = await axios.get(`/api/users/${id}`, {
      withCredentials: true,
    });
    setSelectedUser(res.data.user);
    setShowModal(true);
  };
  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/users", {
      withCredentials: true,
    });
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [showModal]);


  const updateStatus = async (id, status) => {
    await axios.patch(
      `/api/admin/users/${id}`,
      { status },
      { withCredentials: true }
    );
    fetchUsers();
  };
  return (
    <div className="container my-5">
      <h3>Admin – User Verification</h3>

      <div className="table-responsive ">
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
              <th>View</th>
              <th>Edit</th>

            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => {
              console.log(u)
              return (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u?.name}</td>
                  <td>{u?.email}</td>
                  <td>
                    <span
                      className={`badge ${u?.status === "active"
                        ? "bg-success"
                        : u.status === "pending"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                        }`}
                    >
                      {u?.status}
                    </span>
                  </td>
                  <td>
                    {u.status === "pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => updateStatus(u?._id, "active")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => updateStatus(u?._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <img width="100px" height="50px"
                      src={u?.paymentReceipt?.url}
                      onClick={() => setPreviewImage(u.paymentReceipt.url)}
                      alt="paymentslip" />
                  </td>
                  <td>{u?.transactionId}</td>
                  <td>
                    <IconButton
                      sx={{
                        color: "success.main",
                      }}
                      onClick={() => viewUser(u._id)}>
                      <VisibilityIcon color="green" />
                    </IconButton>

                  </td>
                  <td>
                    <IconButton
                      onClick={() => {
                        setEditUser(u);
                        setShowEditModal(true);
                      }}>
                      <EditIcon

                      />
                    </IconButton>
                  </td>
                </tr>
              )

            })}
          </tbody>
        </table>
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

                  <input
                    className="form-control mb-2"
                    value={editUser.name || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    placeholder="Name"
                  />

                  <input
                    className="form-control mb-2"
                    value={editUser.email || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    placeholder="Email"
                  />

                  <input
                    className="form-control mb-2"
                    value={editUser.mobile || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, mobile: e.target.value })
                    }
                    placeholder="Mobile"
                  />

                  <hr />

                  <input
                    className="form-control mb-2"
                    value={editUser.nomineeName || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, nomineeName: e.target.value })
                    }
                    placeholder="Nominee Name"
                  />

                  <input
                    className="form-control mb-2"
                    value={editUser.nomineeRelation || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, nomineeRelation: e.target.value })
                    }
                    placeholder="Nominee Relation"
                  />

                  <input
                    className="form-control mb-2"
                    value={editUser.nomineeMobile || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, nomineeMobile: e.target.value })
                    }
                    placeholder="Nominee Mobile"
                  />

                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password (optional)"
                    onChange={(e) =>
                      setEditUser({ ...editUser, password: e.target.value })
                    }
                  />

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

      {showModal && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}


          />

          {/* Modal */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000, //  higher than header
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
              >
                <div className="modal-header">
                  <h5 className="modal-title">Member Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">

                  <h6 className="text-primary">Basic Info</h6>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>

                  <hr />

                  <h6 className="text-primary">Transaction</h6>
                  <p><strong>Transaction ID:</strong> {selectedUser.transactionId}</p>

                  {selectedUser.paymentReceipt?.url && (
                    <img
                      src={selectedUser.paymentReceipt.url}
                      className="img-fluid border rounded mb-3"
                      style={{ cursor: "zoom-in", maxHeight: "200px" }}
                      onClick={() =>
                        setPreviewImage(selectedUser.paymentReceipt.url)
                      }
                    />
                  )}

                  <hr />

                  <h6 className="text-primary">Nominee Details</h6>
                  <p><strong>Name:</strong> {selectedUser.nomineeName}</p>
                  <p><strong>Relation:</strong> {selectedUser.nomineeRelation}</p>
                  <p><strong>Mobile:</strong> {selectedUser.nomineeMobile}</p>

                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
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
