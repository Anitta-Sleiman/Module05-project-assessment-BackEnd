import express from "express";
import UserControllers from "../controllers/userController.js";
import Verification from "../middleware/jwt.js";
import { upload } from "../config/cloudinary.js";
import FrontVerify from "../controllers/jwtController.js";
const userRoute = express.Router();

//signup
userRoute.post(
  "/signup",
  upload.single("userImage"),
  UserControllers.signupUser
);

//login
userRoute.post("/login", UserControllers.loginUser);

//route after sending email
userRoute.post("/auth/login/:token/:id", UserControllers.authEmail);

//get all
userRoute.get("/", UserControllers.getAllUsers);

//get by id
userRoute.get("/:id", UserControllers.getUserById);

//update
userRoute.put(
  "/:id",
  upload.single("userImage"),
  Verification.verifyLogin,
  UserControllers.updateUserById
);

//delete
userRoute.delete("/:id", Verification.verifyAdmin, UserControllers.deleteUser);


userRoute.post("/users/v", FrontVerify.verifyLogin);

export default userRoute;
