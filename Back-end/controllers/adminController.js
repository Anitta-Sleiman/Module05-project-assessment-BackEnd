import Admins from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
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

    // Check admin validation
    const isValid = await Admins.findOne({ username });
    if (isValid) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admins({
      username: username,
      password: hashedPassword,
    });

    // Save
    await newAdmin.save();
    res.status(200).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//Admin login
export const loginAdmin = async (req, res) => {
  const isAdmin = true;
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw Error("All field are required Fields");
    }
    const admin = await Admins.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res.cookie("access_token", token, { httpOnly: true, expires: expiryDate });
    return res
      .status(200)
      .json({
        data: admin,
        token,
        status: 200,
        message: "Admin login successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// admin logout
export const logoutAdmin = (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logged out successfully" });
};

//get all admin
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.find({});
    res
      .status(200)
      .json({ data: admins, message: "Admins are found !!", status: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
