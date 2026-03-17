import SleepLog from "../model/sleepLog.model.js";

export async function upsertSleep(req, res) {
  try {
    const { date, hours, quality = "Good", notes = "" } = req.body;
    const doc = await SleepLog.findOneAndUpdate(
      { userId: req.user._id, date },
      { $set: { hours, quality, notes } },
      { new: true, upsert: true },
    );
    res.status(200).json({ message: "Sleep saved", sleep: doc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function listSleep(req, res) {
  try {
    const logs = await SleepLog.find({ userId: req.user._id }).sort({ date: -1 }).limit(60);
    res.status(200).json({ message: "Sleep logs", logs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

