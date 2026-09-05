import Product from "../models/Product.js";
import Order from "../models/Order.js";


export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const totalProducts = await Product.countDocuments({ seller: sellerId });

    const orders = await Order.find({ "items.seller": sellerId });

    let totalRevenue = 0;
    let totalUnitsSold = 0;
    let totalOrders = orders.length;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.seller.toString() === sellerId.toString()) {
          totalRevenue += item.price * item.quantity;
          totalUnitsSold += item.quantity;
        }
      });
    });

    const pendingOrders = orders.filter((o) => o.orderStatus === "processing").length;
    const shippedOrders = orders.filter((o) => o.orderStatus === "shipped").length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalUnitsSold,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};