import express from "express";
const productRouter = express.Router();
import { upload } from "../config/cloudinary.js";
import Product from "../controllers/productController.js";
import Verification from "../middleware/jwt.js";

productRouter.get("/", Product.getAllProducts);
productRouter.get("/:id", Product.getSingleProduct);
productRouter.post(
  "/",
  Verification.verifyAdmin,
  upload.single("image"),
  Product.createProduct
);
productRouter.put(
  "/:id",
  Verification.verifyAdmin,
  upload.single("image"),
  Product.editProduct
);
productRouter.delete("/:id", Verification.verifyAdmin, Product.deleteProduct);

export default productRouter;
