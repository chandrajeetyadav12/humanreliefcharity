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
            public_id: String,
            url: String,
        },

        verifiedByAdmin: {
            type: Boolean,
            default: false,
        },
        founderApprovedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Donation ||
    mongoose.model("Donation", DonationSchema);
