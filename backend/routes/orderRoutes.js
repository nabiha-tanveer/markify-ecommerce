import express from "express";
import {
  placeOrder,
  confirmPayment,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("buyer"), placeOrder);
router.put("/:id/confirm-payment", protect, confirmPayment);
router.get("/my-orders", protect, authorize("buyer"), getMyOrders);
router.get("/seller-orders", protect, authorize("seller"), getSellerOrders);
router.put("/:id/status", protect, authorize("seller", "admin"), updateOrderStatus);

export default router;