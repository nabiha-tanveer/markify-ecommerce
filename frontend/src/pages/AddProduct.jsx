import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "", stock: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      images.forEach((image) => data.append("images", image));

      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/seller/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

        <input
          type="text" name="name" placeholder="Product Name"
          value={formData.name} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <textarea
          name="description" placeholder="Description"
          value={formData.description} onChange={handleChange} required rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <input
          type="number" name="price" placeholder="Price (Rs.)"
          value={formData.price} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <input
          type="text" name="category" placeholder="Category (e.g. Electronics)"
          value={formData.category} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <input
          type="number" name="stock" placeholder="Stock Quantity"
          value={formData.stock} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <label className="block text-sm text-gray-600 mb-1">Product Images (up to 5)</label>
        <input
          type="file" multiple accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-4 text-sm"
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-rose-600 text-white py-2.5 rounded-xl hover:bg-rose-700 transition disabled:opacity-50 font-medium"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}