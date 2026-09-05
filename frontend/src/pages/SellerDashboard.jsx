import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.get("/seller/dashboard"),
        api.get("/products/my-products"),
        api.get("/orders/seller-orders"),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading dashboard...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-rose-600">Rs. {stats.totalRevenue}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400">Units Sold</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUnitsSold}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Products</h2>
        <Link
          to="/seller/add-product"
          className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition text-sm font-medium"
        >
          + Add Product
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-rose-600 font-bold">Rs. {product.price}</p>
            <p className="text-sm text-gray-400">Stock: {product.stock}</p>
            <span
              className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                product.isApproved
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {product.isApproved ? "Approved" : "Pending Approval"}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Orders</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400">Order #{order._id.slice(-8)}</p>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {order.items.map((item) => (
                <p key={item._id} className="text-sm text-gray-700">
                  {item.name} × {item.quantity} — Rs. {item.price * item.quantity}
                </p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}