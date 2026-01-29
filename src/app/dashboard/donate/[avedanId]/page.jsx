"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function DonatePage() {
  const { avedanId } = useParams();
  const router = useRouter();

  const [avedan, setAvedan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvedan = async () => {
      try {
        const res = await axios.get(
          `/api/avedan/available/${avedanId}`,
          { withCredentials: true }
        );
        setAvedan(res.data.avedan);
      } catch (err) {
        console.error(err);
        alert("Avedan not available");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAvedan();
  }, [avedanId]);

  if (loading) return <p>Loading...</p>;
  if (!avedan) return null;

  return (
    <div className="container">
      <h3>{avedan.title}</h3>
      <p>{avedan.description}</p>

      <p><b>Required:</b> ₹{avedan.requiredAmount}</p>
      <p><b>Collected:</b> ₹{avedan.collectedAmount}</p>

      {/* <DonateForm avedanId={avedanId} /> */}
    </div>
  );
}
