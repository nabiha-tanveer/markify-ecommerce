import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

let stripe;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe uses smallest currency unit (cents)
      currency: "usd",
      metadata: { buyerId: req.user._id.toString() },
    });

    // Purane unpaid (pending) orders hata do
    await Order.deleteMany({ buyer: req.user._id, paymentStatus: "pending" });

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      stripePaymentId: paymentIntent.id,
    });

    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.paymentStatus === "paid") {
      return res.json({ message: "Already paid", order });
    }

    const paymentIntent = await getStripe().paymentIntents.retrieve(order.stripePaymentId);

    if (paymentIntent.status === "succeeded") {
      order.paymentStatus = "paid";
      await order.save();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      await Cart.findOneAndUpdate({ buyer: req.user._id }, { items: [] });

      return res.json({ message: "Payment confirmed", order });
    }

    res.status(400).json({ message: "Payment not completed yet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
      paymentStatus: "paid",
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seller's orders (sirf paid orders jin mein unke products hain)
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user._id,
      paymentStatus: "paid",
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role === "seller" &&
      !order.items.some((i) => i.seller.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.orderStatus = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};