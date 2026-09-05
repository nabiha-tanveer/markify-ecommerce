import { useState, useEffect } from "react";
import api from "../api/axios";

const statusColors = {
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-400">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-400">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-700">
                    <span>{item.name} × {item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-400">Payment: {order.paymentStatus}</span>
                <span className="font-bold text-gray-900">Total: Rs. {order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}