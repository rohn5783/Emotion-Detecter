import JournalEntry from "../model/journal.model.js";

export async function createEntry(req, res) {
  try {
    const { title = "", text, mood = "Neutral" } = req.body;
    const entry = await JournalEntry.create({
      userId: req.user._id,
      title,
      text,
      mood,
    });
    res.status(201).json({ message: "Entry created", entry });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function listEntries(req, res) {
  try {
    const entries = await JournalEntry.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(200);
    res.status(200).json({ message: "Entries", entries });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deleteEntry(req, res) {
  try {
    const { id } = req.params;
    const deleted = await JournalEntry.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

