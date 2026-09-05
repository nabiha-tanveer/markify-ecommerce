import express from "express";
import { getSellerDashboard } from "../controllers/sellerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("seller"), getSellerDashboard);

export default router;