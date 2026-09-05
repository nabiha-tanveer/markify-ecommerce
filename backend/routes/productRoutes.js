import express from "express";
import upload from "../config/cloudinary.js";
import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/my-products", protect, authorize("seller"), getMyProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("seller"), upload.array("images", 5), createProduct);
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);

export default router;