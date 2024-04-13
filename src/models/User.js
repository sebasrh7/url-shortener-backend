import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    emails: {
      type: Array,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
