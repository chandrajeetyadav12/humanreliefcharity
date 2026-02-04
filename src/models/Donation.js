// models/Donation.js
import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        avedan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Avedan",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMode: {
            type: String,
            enum: ["upi", "bank_transfer", "cash"],
            required: true,
        },

        transactionId: String,

        receipt: {
            key: String,
            url: String,
        },
        status: {
            type: String,
            enum: ["pending", "admin_verified", "founder_approved", "rejected"],
            default: "pending",
        },

        verifiedByAdmin: {
            type: Boolean,
            default: false,
        },
        founderApprovedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        rejectionReason: {
            type: String,
        },

        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        rejectedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Donation ||
    mongoose.model("Donation", DonationSchema);
