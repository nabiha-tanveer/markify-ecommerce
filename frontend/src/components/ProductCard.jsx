import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { user } = useContext(AuthContext);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (user?.role === "buyer") {
      checkWishlist();
    }
  }, []);

  const checkWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      const isWishlisted = res.data.products.some((p) => p._id === product._id);
      setWishlisted(isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.post("/wishlist/toggle", { productId: product._id });
      setWishlisted(res.data.wishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative border border-gray-100"
    >
      {user?.role === "buyer" && (
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 h-9 w-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      )}

      <div className="h-52 bg-gray-100 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {product.category && (
          <span className="text-[11px] uppercase tracking-wide text-rose-500 font-semibold mb-1">
            {product.category}
          </span>
        )}
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-400 truncate">{product.seller?.shopName}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-rose-600 font-bold text-lg">Rs. {product.price}</p>
        </div>
      </div>
    </Link>
  );
}