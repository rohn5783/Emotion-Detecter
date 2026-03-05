import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./config/database.js";
import redis from "./config/cache.js";

connectDB();

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});