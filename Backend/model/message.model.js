import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["dm", "room"], required: true, index: true },
    room: { type: String, default: "", index: true },
    text: { type: String, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
