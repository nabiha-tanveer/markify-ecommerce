import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ buyer: req.user._id }).populate(
      "products",
      "name price images stock"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });
    }


    const validCount = wishlist.products.length;
    wishlist.products = wishlist.products.filter((p) => p !== null);
    if (wishlist.products.length !== validCount) {
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ buyer: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });
    }

    const exists = wishlist.products.some(
      (p) => p.toString() === productId
    );

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId
      );
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.json({ wishlisted: !exists, wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};