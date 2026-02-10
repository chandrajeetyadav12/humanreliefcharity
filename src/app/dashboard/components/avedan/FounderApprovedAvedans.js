"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FounderApprovedAvedans() {
  const [avedans, setAvedans] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAvedans = async () => {
      try {
        const res = await axios.get("/api/avedan/available", {
          withCredentials: true,
        });
        setAvedans(res.data.avedans || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvedans();
  }, []);
console.log(avedans)
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
        {avedans.map((av) => {
          console.log(av?.collectedAmount)
          //  NEW: remaining amount calculation
          const remainingAmount =
            av.requiredAmount - (av?.collectedAmount || 0);

          return (
            <div key={av._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <p className="card-text">{av.description}</p>

                  <p className="fw-bold text-success">
                    Required: ₹{av.requiredAmount}
                  </p>

                  {/*  NEW */}
                  <p className="fw-bold text-primary">
                    Collected: ₹{av.collectedAmount || 0}
                  </p>

                  {/*  NEW */}
                  <p className="fw-bold text-danger">
                    Remaining: ₹{remainingAmount}
                  </p>

                  <hr />

                  <h6 className="fw-bold mb-2">Bank Details</h6>
                  <p className="mb-1">
                    <b>Account Holder:</b>{" "}
                    {av?.bankDetails.accountHolderName}
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
                      <div className="my-3 text-center">
                        <img
                          src={av.bankDetails.upiQrUrl}
                          alt="UPI QR Code"
                          className="img-fluid rounded border"
                          style={{ maxWidth: "140px" }}
                        />
                      </div>
                    </div>
                  )}

                  {/*  UPDATED: disable if completed */}
                  <button
                    className="btn btn-primary mt-auto w-100"
                    disabled={remainingAmount <= 0}
                    onClick={() =>
                      router.push(
                        `/dashboard/user/donates/${av._id}`
                      )
                    }
                  >
                    {remainingAmount <= 0
                      ? "Target Completed"
                      : "Donate Now"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
