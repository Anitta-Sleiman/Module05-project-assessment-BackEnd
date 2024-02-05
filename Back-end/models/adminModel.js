import mongoose, { Schema } from "mongoose";

const Admins = new Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", Admins);
