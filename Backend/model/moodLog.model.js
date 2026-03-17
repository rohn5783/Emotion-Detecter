import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mood: {
      type: String,
      required: true,
      enum: ["Happy", "Sad", "Angry", "Chill", "Focused", "Anxious", "Energetic", "Neutral"],
      index: true,
    },
    source: {
      type: String,
      default: "manual",
      enum: ["manual", "face", "text", "voice"],
    },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

const MoodLog = mongoose.model("MoodLog", moodLogSchema);

export default MoodLog;
