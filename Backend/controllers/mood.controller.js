import MoodLog from "../model/moodLog.model.js";

function getStartOfDayISO(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function createMoodLog(req, res) {
  try {
    const { mood, source = "manual", note = "" } = req.body;
    const doc = await MoodLog.create({
      userId: req.user._id,
      mood,
      source,
      note,
    });
    res.status(201).json({ message: "Mood logged", moodLog: doc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function listMoodLogs(req, res) {
  try {
    const { range = "30d" } = req.query;
    const now = new Date();
    let since = null;
    if (range === "7d") since = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    if (range === "30d") since = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    if (range === "90d") since = new Date(now.getTime() - 90 * 24 * 3600 * 1000);

    const query = { userId: req.user._id };
    if (since) query.createdAt = { $gte: since };

    const logs = await MoodLog.find(query).sort({ createdAt: -1 }).limit(500);
    res.status(200).json({ message: "Mood logs", logs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function moodAnalytics(req, res) {
  try {
    const now = new Date();
    const since30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

    const pipeline = [
      { $match: { userId: req.user._id, createdAt: { $gte: since30 } } },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];

    const byMood = await MoodLog.aggregate(pipeline);

    // streak = consecutive days with at least 1 mood log
    const logs = await MoodLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("createdAt")
      .limit(365);

    const days = new Set(
      logs.map((l) => {
        const d = new Date(l.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().slice(0, 10);
      }),
    );

    let streak = 0;
    let cursor = getStartOfDayISO(now);
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 24 * 3600 * 1000);
    }

    res.status(200).json({ message: "Analytics", byMood, streak });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

