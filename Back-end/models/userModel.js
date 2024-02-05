import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
//user
const Users = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/dxg6ijfbf/image/upload/v1706512530/designs/mcro1czbj5jy0jqzymag.jpg",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//login method
Users.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

export default mongoose.model("User", Users);
