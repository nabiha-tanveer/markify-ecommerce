import express from "express";
import {
  approveProduct,
  approveSeller,
  getPendingProducts,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/products/pending", getPendingProducts);
router.put("/products/:id/approve", approveProduct);
router.put("/sellers/:id/approve", approveSeller);

export default router;