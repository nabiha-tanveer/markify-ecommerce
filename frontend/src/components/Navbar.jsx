import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-20">
      <Link to="/" className="text-xl font-bold text-rose-600">
        Markify
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-700 hover:text-rose-600 transition">
          Products
        </Link>

        {user?.role === "buyer" && (
          <>
            <Link to="/cart" className="text-gray-700 hover:text-rose-600 transition">
              Cart
            </Link>
            <Link to="/my-orders" className="text-gray-700 hover:text-rose-600 transition">
              My Orders
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-rose-600 transition">
              Wishlist
            </Link>
          </>
        )}

        {user?.role === "seller" && (
          <Link to="/seller/dashboard" className="text-gray-700 hover:text-rose-600 transition">
            Dashboard
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/pending" className="text-gray-700 hover:text-rose-600 transition">
            Admin
          </Link>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}