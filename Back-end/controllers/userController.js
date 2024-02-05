import mongoose from "mongoose";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const createToken = (_id) => {
  const isAdmin = false;
  return jwt.sign({ _id, isAdmin: isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2d",
  });
};

class UserControllers {
  //login user
  static async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (user) {
        // Check if email is verified
        if (!user.emailVerified) {
          return res.status(401).json({ error: "Email not verified" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const token = createToken(user._id, false);
          return res.status(200).json({ data: user, token, status: 200 });
        }
      }

      return res.status(401).json({ error: "Invalid email or password" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async signupUser(req, res) {
    const { username, email, password } = req.body;
    const userImage = "";
    try {
      if (!username || !email || !password) {
        res.status(400).json({ message: "All fields required" });
        return;
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
          password
        )
      ) {
        return res.status(422).json({
          message: "Invalid password",
          error: true,
        });
      }

      const oldusername = await User.findOne({ username: username });
      const oldemail = await User.findOne({ email: email });

      if (!oldusername && !oldemail) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
          userImage:
            "https://res.cloudinary.com/dxg6ijfbf/image/upload/v1706512530/designs/mcro1czbj5jy0jqzymag.jpg",
          emailVerified: false,
        });
        const token = createToken(newUser._id);

        var otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });

        const tokenForOtp = jwt.sign(
          { email: email, otp: otp },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        const magicLink = `http://localhost:3000/login?token=${tokenForOtp}/${newUser._id}`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        // Create email options
        const mailOptions = {
          from: {
            name: "Ecommerce Website",
            address: process.env.MAIL_USER,
          },
          to: email,
          subject: "Verification Link for Ecommerce Website",
          html: `
            <div style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333;">Dear User,</h2>
              <p style="color: #555; font-size: 16px;">We hope this email finds you well.</p>
              <p style="color: #555; font-size: 16px;">
                Please click on the following <strong><a href="${magicLink}" style="color: #333333; text-decoration: none;">Link</a></strong> to log in!
              </p>
              <p style="color: #555; font-size: 16px;">
                If you did not send a sign-up request, please ignore this email.
              </p>
              <p style="color: #555; font-size: 16px;">Best Regards,</p>
              <p style="color: #555; font-size: 16px;">Bandali Designs Team</p>
            </div>
          `,
        };
        // Send email
        await transporter.sendMail(mailOptions);
        // console.log("Email has been sent!");

        return res.status(200).json({
          message: "Check your email for the magic link!",
          newUser,
          token,
          status: 200,
        });
      } else {
        res.status(409).json({ error: "User already exists", status: 409 });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  //get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        return res.status(404).json("there are no available users");
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  //get user by id
  static async getUserById(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json("user not found");
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  //update user by id
  static async updateUserById(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }

    const { username, email, password } = req.body;

    let userImage = req.file ? req.file.path : undefined;

    if (!userImage) {
      userImage =
        "https://res.cloudinary.com/dxg6ijfbf/image/upload/v1706194810/designs/xesvkuzpkb7fzqthvys7.jpg";
    }

    let updateFields = {
      username,
      email,
      password,
    };

    if (
      userImage !==
      "https://res.cloudinary.com/dxg6ijfbf/image/upload/v1706194810/designs/xesvkuzpkb7fzqthvys7.jpg"
    ) {
      updateFields.userImage = userImage;
    }

    try {
      const updateUser = await User.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true } // To get the updated document after the update
      );

      if (!updateUser) {
        return res.status(404).json({ message: "No such user" });
      }

      if (
        !req.file &&
        updateUser.userImage ===
          "https://res.cloudinary.com/dxg6ijfbf/image/upload/v1706194810/designs/xesvkuzpkb7fzqthvys7.jpg"
      ) {
        delete updateUser.userImage;
      }

      return res.status(200).json(updateUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  //delete a user
  static async deleteUser(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    try {
      const deletedUser = await User.findOneAndDelete({ _id: id });
      if (!deletedUser) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(200).json({ deletedUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  //authenticate user after sending the email
  static async authEmail(req, res) {
    const { token } = req.params;
    const { id } = req.params;
    // console.log("token from url", token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ valid: false, status: 403 });
      } else {
        // Authenticate user
        req.session.userId = decoded.id;
        // console.log("decoded.id ", id);
        try {
          await User.updateOne({ _id: id }, { $set: { emailVerified: true } });

          return res
            .status(200)
            .json({ valid: true, user: decoded, status: 200 });
        } catch (error) {
          console.error("Error updating user:", error);
          return res
            .status(500)
            .json({ error: "Internal Server Error", status: 500 });
        }
      }
    });
  }
}

export default UserControllers;
