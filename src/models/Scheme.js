import mongoose from "mongoose";

const SchemeSchema = new mongoose.Schema({
  title: String,
  description: String,
});

export default mongoose.models.Scheme || mongoose.model("Scheme", SchemeSchema);
