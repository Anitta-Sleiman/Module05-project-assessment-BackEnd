import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/adminController.js";
import Verification from "../middleware/jwt.js";
import FrontVerify from "../controllers/jwtController.js";
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/", Verification.verifyAdmin, getAllAdmins);
router.delete("/:id", Verification.verifyAdmin, deleteAdmin);
router.post("/admins/v", FrontVerify.verifyAdmin);

export default router;
