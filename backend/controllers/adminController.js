import Product from "../models/Product.js";
import User from "../models/User.js";


export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isApproved = true;
    await product.save();
    res.json({ message: "Product approved", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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