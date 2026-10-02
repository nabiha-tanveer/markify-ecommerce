import express from "express";
import {
  getStats,
  getUsers,
  deleteUser,
  approveSeller,
  revokeSeller,
  getAllProducts,
  getPendingProducts,
  approveProduct,
  deleteProductByAdmin,
  getAllOrders,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.put("/sellers/:id/approve", approveSeller);
router.put("/sellers/:id/revoke", revokeSeller);

router.get("/products", getAllProducts);
router.get("/products/pending", getPendingProducts);
router.put("/products/:id/approve", approveProduct);
router.delete("/products/:id", deleteProductByAdmin);

router.get("/orders", getAllOrders);

export default router;