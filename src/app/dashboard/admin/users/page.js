"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/users", {
      withCredentials: true,
    });
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
                    <img width="100px" height="50px"src={u?.paymentReceipt?.url} alt="paymentslip"/></td>
                    <td>{u?.transactionId}</td>
                </tr>
              )

            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
