import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    shopName: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", formData);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Create Account</h2>

        {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {formData.role === "seller" && (
          <input
            type="text"
            name="shopName"
            placeholder="Shop Name"
            value={formData.shopName}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        )}

        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-2.5 rounded-xl hover:bg-rose-700 transition font-medium"
        >
          Register
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}