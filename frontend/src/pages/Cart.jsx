import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading cart...</p>;

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-rose-600 font-semibold hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product?._id}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 border border-gray-100"
              >
                <div className="h-20 w-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.product?.name}
                  </h3>
                  <p className="text-rose-600 font-bold">
                    Rs. {item.product?.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-rose-500 hover:text-rose-700 text-sm ml-4 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center border border-gray-100">
            <span className="text-lg font-semibold text-gray-800">
              Total: Rs. {total}
            </span>
            <Link
              to="/checkout"
              className="bg-rose-600 text-white px-6 py-2.5 rounded-xl hover:bg-rose-700 transition font-medium"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}