import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection failed", error);
      process.exit(1);
    });
}

export default connectDB;
