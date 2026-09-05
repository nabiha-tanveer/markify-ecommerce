import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("buyer"), addReview);
router.get("/product/:productId", getProductReviews);
router.delete("/:id", protect, authorize("buyer"), deleteReview);

export default router;