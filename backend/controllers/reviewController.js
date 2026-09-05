import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;


    const hasOrdered = await Order.findOne({
      buyer: req.user._id,
      "items.product": productId,
      orderStatus: "delivered",
    });

    if (!hasOrdered) {
      return res.status(403).json({
        message: "You can only review products you have purchased and received",
      });
    }

    const review = await Review.create({
      product: productId,
      buyer: req.user._id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate(
      "buyer",
      "name"
    );

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};