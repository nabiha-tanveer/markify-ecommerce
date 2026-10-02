import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// Dashboard stats
export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      pendingSellers,
      totalProducts,
      pendingProducts,
      totalOrders,
      revenueAgg,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "seller", isApprovedSeller: false }),
      Product.countDocuments(),
      Product.countDocuments({ isApproved: false }),
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find({ paymentStatus: "paid" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("buyer", "name email"),
    ]);

    res.json({
      totalUsers,
      totalBuyers,
      totalSellers,
      pendingSellers,
      totalProducts,
      pendingProducts,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Users list (?role=buyer / seller)
export const getUsers = async (req, res) => {
  try {
    const filter = { role: { $ne: "admin" } };
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be deleted" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seller approve / revoke
export const approveSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }
    seller.isApprovedSeller = true;
    await seller.save();
    res.json({ message: "Seller approved", seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const revokeSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }
    seller.isApprovedSeller = false;
    await seller.save();
    res.json({ message: "Seller approval revoked", seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name shopName")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false }).populate(
      "seller",
      "name shopName"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.isApproved = true;
    await product.save();
    res.json({ message: "Product approved", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductByAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "paid" })
      .sort({ createdAt: -1 })
      .populate("buyer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};