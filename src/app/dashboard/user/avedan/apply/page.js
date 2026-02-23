"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ----------------------
// Yup validation schema
// ----------------------
const schema = yup.object().shape({
  description: yup.string().required("Description is required"),
  // requiredAmount: yup
  //   .number()
  //   .typeError("Required amount must be a number")
  //   .positive("Amount must be greater than 0")
  //   .required("Required amount is required"),
  accountHolderName: yup.string().required("Account holder name is required"),
  bankName: yup.string().required("Bank name is required"),
  accountNumber: yup.string().required("Account number is required"),
  ifsc: yup.string().required("IFSC is required"),
});

export default function ApplyAvedanPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // beti_vivah / untimely_death

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileKey, setFileKey] = useState(Date.now());

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const onSubmit = async (formDataFields) => {
    const formData = new FormData();

    formData.append("type", type);
    formData.append("description", formDataFields.description);
    //  NEW: REQUIRED AMOUNT
    // formData.append("requiredAmount", formDataFields.requiredAmount);

    // Bank details
    formData.append("accountHolderName", formDataFields.accountHolderName);
    formData.append("bankName", formDataFields.bankName);
    formData.append("accountNumber", formDataFields.accountNumber);
    formData.append("ifsc", formDataFields.ifsc);

    // Documents
    if (type === "beti_vivah") {
      if (!files.aadhaar_applicant || !files.aadhaar_bride || !files.marriage_card) {
        setMessage("All required documents must be uploaded");
        return;
      }
      formData.append("aadhaar_applicant", files.aadhaar_applicant);
      formData.append("aadhaar_bride", files.aadhaar_bride);
      formData.append("marriage_card", files.marriage_card);
    } else if (type === "untimely_death") {
      if (!files.aadhaar_applicant || !files.death_certificate) {
        setMessage("All required documents must be uploaded");
        return;
      }
      formData.append("aadhaar_applicant", files.aadhaar_applicant);
      formData.append("death_certificate", files.death_certificate);
    }

    if (!files.upiQrFile) {
      setMessage("UPI QR is required");
      return;
    }
    formData.append("upiQrFile", files.upiQrFile);

    try {
      setLoading(true);
      const res = await axios.post("/api/avedan/apply", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(res)
      setMessage(res.data.message);
      reset();
      setFiles({});
      setFileKey(Date.now())
    } catch (err) {
      setMessage(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{type === "beti_vivah" ? "बेटी विवाह सहयोग हेतु आवेदन" : "आकस्मिक (असमय) निधन हेतु आवेदन"}</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        {/* Description */}
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            {...register("description")}
          />
          <div className="invalid-feedback">{errors.description?.message}</div>
        </div>
        {/* <div className="mb-3">
          <label>Required Amount (₹)</label>
          <input
            type="number"
            className={`form-control ${errors.requiredAmount ? "is-invalid" : ""}`}
            {...register("requiredAmount")}
          />
          <div className="invalid-feedback">
            {errors.requiredAmount?.message}
          </div>
        </div> */}


        <h5>Bank Details</h5>

        <div className="mb-3">
          <label>Account Holder Name</label>
          <input
            type="text"
            className={`form-control ${errors.accountHolderName ? "is-invalid" : ""}`}
            {...register("accountHolderName")}
          />
          <div className="invalid-feedback">{errors.accountHolderName?.message}</div>
        </div>

        <div className="mb-3">
          <label>Bank Name</label>
          <input
            type="text"
            className={`form-control ${errors.bankName ? "is-invalid" : ""}`}
            {...register("bankName")}
          />
          <div className="invalid-feedback">{errors.bankName?.message}</div>
        </div>

        <div className="mb-3">
          <label>Account Number</label>
          <input
            type="text"
            className={`form-control ${errors.accountNumber ? "is-invalid" : ""}`}
            {...register("accountNumber")}
          />
          <div className="invalid-feedback">{errors.accountNumber?.message}</div>
        </div>

        <div className="mb-3">
          <label>IFSC</label>
          <input
            type="text"
            className={`form-control ${errors.ifsc ? "is-invalid" : ""}`}
            {...register("ifsc")}
          />
          <div className="invalid-feedback">{errors.ifsc?.message}</div>
        </div>

        <h5>Upload Documents</h5>

        {/* Dynamic documents */}
        {type === "beti_vivah" && (
          <>
            <div className="mb-3">
              <label>Applicant Aadhaar</label>
              <input key={fileKey} type="file" name="aadhaar_applicant" className="form-control" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <label>Bride Aadhaar</label>
              <input key={fileKey} type="file" name="aadhaar_bride" className="form-control" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <label>Marriage Card</label>
              <input key={fileKey} type="file" name="marriage_card" className="form-control" onChange={handleFileChange} />
            </div>
          </>
        )}

        {type === "untimely_death" && (
          <>
            <div className="mb-3">
              <label>Applicant Aadhaar</label>
              <input key={fileKey} type="file" name="aadhaar_applicant" className="form-control" onChange={handleFileChange} />
            </div>
            <div className="mb-3">
              <label>Death Certificate</label>
              <input key={fileKey} type="file" name="death_certificate" className="form-control" onChange={handleFileChange} />
            </div>
          </>
        )}

        <div className="mb-3">
          <label>UPI QR</label>
          <input key={fileKey} type="file" name="upiQrFile" className="form-control" onChange={handleFileChange} />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Avedan"}
        </button>
      </form>
    </div>
  );
}
