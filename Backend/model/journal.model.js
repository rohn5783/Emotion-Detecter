import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "" },
    text: { type: String, required: true },
    mood: {
      type: String,
      default: "Neutral",
      enum: ["Happy", "Sad", "Angry", "Chill", "Focused", "Anxious", "Energetic", "Neutral"],
      index: true,
    },
  },
  { timestamps: true },
);

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

export default JournalEntry;
