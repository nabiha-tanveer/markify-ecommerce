import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Welcome Back</h2>

        {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-2.5 rounded-xl hover:bg-rose-700 transition font-medium"
        >
          Login
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-rose-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}