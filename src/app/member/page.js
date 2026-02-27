"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  console.log(members)
  const [currentPage, setCurrentPage] = useState(1);

  const membersPerPage = 10;
  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get("/api/members")
        .then(res => setMembers(res.data.users))
        .catch(err => {
          if (err?.response?.status !== 404) console.error(err);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  // Show only active members
  const activeMembers = members.filter(
    (m) => m.status === "active"
  );
  // If search is empty → show all active members
  // If search has value → filter by name OR adharNumber
  const displayedMembers =
    search.trim() === ""
      ? activeMembers
      : activeMembers.filter(
        (m) =>
          m.name?.toLowerCase().includes(search.toLowerCase()) ||
          m.adharNumber?.includes(search)
      );
  // Pagination logic
  const totalPages = Math.ceil(displayedMembers.length / membersPerPage);

  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;

  const currentMembers = displayedMembers.slice(
    indexOfFirst,
    indexOfLast
  );

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Generate page numbers with dots
  const getPageNumbers = () => {
    const pages = [];

    const siblingCount = 1; // how many pages before & after current
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    // Always show first page
    pages.push(1);

    // Show left dots
    if (leftSibling > 2) {
      pages.push("...");
    }

    // Middle pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Show right dots
    if (rightSibling < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page (if more than 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Our Members List</h3>
      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Aadhaar Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-white p-3 rounded shadow-sm border">
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
            {/* <tbody>
              {displayedMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No members found.
                  </td>
                </tr>
              ) : (
                displayedMembers.map((m, i) => (
                  <tr key={m._id}>
                    <td>{i + 1}</td>
                    <td>{m.name || "Member"}</td>
                    <td>{m.occupation}</td>
                    <td>{m.status}</td>
                    <td>
                      {m.district ? `${m.district}, ` : ""}
                      {m.state || ""}
                    </td>
                    <td>
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody> */}
            <tbody>
              {currentMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No members found.
                  </td>
                </tr>
              ) : (
                currentMembers.map((m, i) => (
                  <tr key={m._id}>
                    <td>
                      {(currentPage - 1) * membersPerPage + i + 1}
                    </td>
                    <td>{m.name || "Member"}</td>
                    <td>{m.occupation}</td>
                    <td>{m.status}</td>
                    <td>
                      {m.district ? `${m.district}, ` : ""}
                      {m.state || ""}
                    </td>
                    <td>
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center flex-wrap">

              {/* Left Arrow */}
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link d-flex align-items-center justify-content-center pagination-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <FiChevronLeft size={18} />
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

              {/* Right Arrow */}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link d-flex align-items-center justify-content-center pagination-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <FiChevronRight size={18} />
                </button>
              </li>

            </ul>
          </nav>
        )}

      </div>
    </div>
  );
}
