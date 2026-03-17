import mongoose from "mongoose";

const sleepLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    hours: { type: Number, min: 0, max: 24, required: true },
    quality: { type: String, enum: ["Poor", "Okay", "Good", "Great"], default: "Good" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

sleepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const SleepLog = mongoose.model("SleepLog", sleepLogSchema);

export default SleepLog;
