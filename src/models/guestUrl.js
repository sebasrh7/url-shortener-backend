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
  expireAt: {
    type: Date,
    // expira en 24 horas
    default: Date.now() + 24 * 60 * 60 * 1000,
  },
});

export default mongoose.model("guestUrl", guestUrlSchema);
