// models/Avedan.js
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: [
        "aadhaar_applicant",
        "aadhaar_bride",
        "marriage_card",
        "death_certificate",
        "hospital_certificate",
        "ration_card",
        "income_certificate",
        "bank_passbook",
        "other",
      ],
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    file: {
      key: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);


const AvedanSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["beti_vivah", "untimely_death"],
      required: true,
    },

    description: String,
    //  FUNDING DETAILS
    requiredAmount: {
      type: Number,
      // required: true,
      min: 1,
    },

    collectedAmount: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
    //  IMPORTANT PART
    documents: [DocumentSchema],

    bankDetails: {
      accountHolderName: String,
      bankName: String,
      accountNumber: String,
      ifsc: String,
      upiQrUrl: String,//store candiate QR
    },

    status: {
      type: String,
      enum: [
        "pending",
        "admin_verified",
        "founder_approved",
        "rejected",
      ],
      default: "pending",
    },
    rejection: {
      reason: String,
      rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rejectedAt: Date,
    },

    adminVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    founderApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Avedan ||
  mongoose.model("Avedan", AvedanSchema);
