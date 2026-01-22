"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MembersPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/members")
      .then((res) => {
        console.log(res)
        setMembers(res.data.users)
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Our Members List</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>S.N</th>
              <th>Name</th>
              <th>occupation</th>
              <th>status</th>
              <th>Location</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No active members yet.
                </td>
              </tr>
            ) : (
              members.map((m, i) => (
                <tr key={m._id}>
                  <td>{i + 1}</td>
                  <td>{m.name ? m.name : "Member"}</td>
                  <td>{m.occupation}</td>
                  <td>{m.status}</td>

                  <td>
                    {m.district ? m.district + ", " : ""}
                    {m.state || ""}
                  </td>
                  <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
