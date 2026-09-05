import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/admin/products/pending");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id) => {
    setMessage("");
    try {
      await api.put(`/admin/products/${id}/approve`);
      setMessage("Product approved!");
      fetchPending();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to approve");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pending Product Approvals</h1>

      {message && <p className="text-sm text-emerald-600 mb-4">{message}</p>}

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-400">No pending products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-40 bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-400">{product.seller?.shopName}</p>
              <p className="text-rose-600 font-bold mt-1">Rs. {product.price}</p>
              <button
                onClick={() => approveProduct(product._id)}
                className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition font-medium"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}