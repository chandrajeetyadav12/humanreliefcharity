"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

/* ---------------- VALIDATION SCHEMA ---------------- */
const donationSchema = yup.object({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),

  paymentMode: yup
    .string()
    .oneOf(["upi", "bank_transfer", "cash"])
    .required(),

  transactionId: yup.string().when("paymentMode", {
    is: (val) => val !== "cash",
    then: (schema) => schema.required("Transaction ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  receipt: yup
    .mixed()
    .test("fileSize", "File is too large (max 5MB)", (value) => {
      if (!value?.length) return true;
      return value[0].size <= 5 * 1024 * 1024;
    }),
});

export default function DonatePage() {
  const { avedanId } = useParams();
  const router = useRouter();

  const [avedan, setAvedan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- REACT HOOK FORM ---------------- */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(donationSchema),
  });

  const paymentMode = watch("paymentMode");

  /* ---------------- FETCH AVEDAN ---------------- */
  const fetchAvedan = async () => {
    try {
      const res = await axios.get(
        `/api/avedan/available/${avedanId}`,
        { withCredentials: true }
      );
      setAvedan(res.data.avedan);
    } catch (err) {
      alert("Avedan not available");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (avedanId) {
      fetchAvedan();
    }
  }, [avedanId]);

  /* ---------------- SUBMIT HANDLER ---------------- */
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("avedanId", avedanId);
      formData.append("amount", data.amount);
      formData.append("paymentMode", data.paymentMode);
      formData.append("transactionId", data.transactionId || "");

      if (data.receipt?.length > 0) {
        formData.append("receipt", data.receipt[0]);
      }

      const res = await axios.post("/api/donation/create", formData, {
        withCredentials: true,
      });
      const donation = res.data.donation;

      toast.success(
        `You donated ₹${donation.amount} for ${donation.avedan.type.replace(
          "_",
          " "
        )} (${donation.avedan.applicantName})`
      );

      await fetchAvedan(); // refresh amounts
      // router.push("/dashboard/my-donations");
    } catch (error) {
      console.error(error);
       toast.error("Donation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!avedan) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          {/* AVEDAN DETAILS */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="card-title">{avedan.title}</h3>
              <p className="card-text">{avedan.description}</p>

              <div className="d-flex justify-content-between mt-3">
                <span><strong>Required:</strong> ₹{avedan.requiredAmount}</span>
                <span><strong>Collected:</strong> ₹{avedan.collectedAmount}</span>
              </div>
            </div>
          </div>

          {/* DONATION FORM */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Make a Donation</h5>

              <form onSubmit={handleSubmit(onSubmit)}>

                {/* Amount */}
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                    placeholder="Enter amount"
                    {...register("amount")}
                  />
                  <div className="invalid-feedback">
                    {errors.amount?.message}
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="mb-3">
                  <label htmlFor="paymentMode" className="form-label">
                    Payment Mode
                  </label>
                  <select
                    id="paymentMode"
                    className={`form-select ${errors.paymentMode ? "is-invalid" : ""}`}
                    {...register("paymentMode")}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                  <div className="invalid-feedback">
                    {errors.paymentMode?.message}
                  </div>
                </div>

                {/* Transaction ID */}
                {paymentMode !== "cash" && (
                  <div className="mb-3">
                    <label htmlFor="transactionId" className="form-label">
                      Transaction ID
                    </label>
                    <input
                      id="transactionId"
                      type="text"
                      className={`form-control ${errors.transactionId ? "is-invalid" : ""}`}
                      placeholder="Enter transaction ID"
                      {...register("transactionId")}
                    />
                    <div className="invalid-feedback">
                      {errors.transactionId?.message}
                    </div>
                  </div>
                )}

                {/* Receipt */}
                <div className="mb-4">
                  <label htmlFor="receipt" className="form-label">
                    Upload Receipt
                  </label>
                  <input
                    id="receipt"
                    type="file"
                    className={`form-control ${errors.receipt ? "is-invalid" : ""}`}
                    accept="image/*,application/pdf"
                    {...register("receipt")}
                  />
                  <div className="invalid-feedback">
                    {errors.receipt?.message}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Confirm Donation"}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}
