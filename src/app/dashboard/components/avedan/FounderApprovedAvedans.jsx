"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FounderApprovedAvedans() {
  const [avedans, setAvedans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvedans = async () => {
      try {
        const res = await axios.get("/api/avedan/available",{withCredentials: true,});
        setAvedans(res.data.avedans || []);
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
    <div>
      <h3>Available Avedans for Donation</h3>

      {avedans.length === 0 && <p>No Avedans available</p>}

      {avedans.map((av) => (
        <div key={av._id} className="card">
          <h4>{av.title}</h4>
          <p>{av.description}</p>
          <p><b>Required:</b> ₹{av.amountRequired}</p>

          <button
            onClick={() => window.location.href = `/donate/${av._id}`}
          >
            Donate Now
          </button>
        </div>
      ))}
    </div>
  );
}
