import mongoose from "mongoose";

const guestUrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrlId: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("guestUrl", guestUrlSchema);
