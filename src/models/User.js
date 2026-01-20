import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    adharNumber: {
      type: String,
      match: [/^\d{12}$/, "Aadhar must be 12 digits"],
    },

    fatherorhusbandname: String,
    dob: String,

    mobile: { type: String, required: true },
    gender: String,

    occupation: {
      type: String,
      enum: [
        "government",
        "private",
        "business",
        "agriculture",
        "housewife",
        "student",
        "contract",
        "public_representative",
      ],
    },

    governmentDepartment: String,
    officeNameAddress: String,

    state: String,
    district: String,
    permanentAddress: String,

    nomineeName: String,
    nomineeRelation: String,
    nomineeMobile: String,

    transactionId: { type: String, required: true },

    referralCode: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{8}$/, "Referral code must be 8 digits"],
    },

    paymentReceipt: {
      public_id: String,
      url: String,
    },

    acceptTerms: { type: Boolean, required: true },

    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
