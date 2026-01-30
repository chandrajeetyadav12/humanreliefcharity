"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function FounderApprovedAvedans() {
  const [avedans, setAvedans] = useState([]);
  const [loading, setLoading] = useState(true);
 const router=useRouter()
  useEffect(() => {
    const fetchAvedans = async () => {
      try {
        const res = await axios.get("/api/avedan/available", { withCredentials: true, });
        setAvedans(res.data.avedans || []);
        // console.log("avail:", res)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvedans();
  }, []);
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center">वर्तमान में उपलब्ध सहायता आवेदन</h3>

      {avedans.length === 0 && (
        <div className="alert alert-info text-center">
          No Avedans available
        </div>
      )}

      <div className="row">
        {avedans.map((av) => (
          <div key={av._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <p className="card-text">{av.description}</p>

                <p className="fw-bold text-success">
                  Required Amount: ₹{av?.requiredAmount}
                </p>

                <hr />

                <h6 className="fw-bold mb-2">Bank Details</h6>
                <p className="mb-1">
                  <b>Account Holder:</b> {av?.bankDetails.accountHolderName}
                </p>
                <p className="mb-1">
                  <b>Account No:</b> {av?.bankDetails.accountNumber}
                </p>
                <p className="mb-1">
                  <b>Bank:</b> {av?.bankDetails.bankName}
                </p>
                <p className="mb-2">
                  <b>IFSC:</b> {av?.bankDetails.ifsc}
                </p>

                {av?.bankDetails?.upiQrUrl && (
                  <div>
                    <b>QR code:</b>
                    <div className=" my-3 text-center">
                      <img
                        src={av.bankDetails.upiQrUrl}
                        alt="UPI QR Code"
                        className="img-fluid rounded border"
                        style={{ maxWidth: "140px" }}
                      />
                    </div>
                  </div>

                )}

                <button
                  className="btn btn-primary mt-auto w-100"
                  onClick={() =>router.push(`/dashboard/donate/${av._id}`)}
                >
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
