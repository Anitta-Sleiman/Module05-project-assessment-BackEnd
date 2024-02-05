import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrdersByUser,
  getPending,
  getAccepted,
  getDelivered,
  getCanceled,
} from "../controllers/orderController.js";
import Verification from "../middleware/jwt.js";
const router = express.Router();

//Create
router.post("/", Verification.verifyLogin, createOrder);
// Get all
router.get("/", Verification.verifyAdmin, getAllOrders);
// Get single
router.get("/:id", Verification.verifyLogin, getOrderById);
// Update
router.put("/:id", Verification.verifyAdmin, updateOrder);
// Delete
router.delete("/:id", Verification.verifyAdmin, deleteOrder);

//get all orders by a single user
router.get("/myorders/:userId", Verification.verifyLogin, getAllOrdersByUser);

router.get("/get/pending", Verification.verifyAdmin, getPending);
router.get("/get/accepted", Verification.verifyAdmin, getAccepted);
router.get("/get/delivered", Verification.verifyAdmin, getDelivered);
router.get("/get/canceled", Verification.verifyAdmin, getCanceled);

export default router;
