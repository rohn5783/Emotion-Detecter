import User from "../model/user.model.js";

export async function listUsers(req, res) {
  try {
    const users = await User.find({})
      .select("_id username email")
      .sort({ createdAt: -1 })
      .limit(200);
    res.status(200).json({ message: "Users", users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

