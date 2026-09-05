import { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const placeholders = [
  "Search for headphones...",
  "Search for sneakers...",
  "Search for kitchen essentials...",
  "Search for skincare...",
];

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Toys",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, activeCategory]);

  useEffect(() => {
    const currentFull = placeholders[placeholderIndex];
    const speed = deleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < currentFull.length) {
          setPlaceholderText(currentFull.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        if (charIndex > 0) {
          setPlaceholderText(currentFull.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setDeleting(false);
          setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, placeholderIndex]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryParam =
        activeCategory !== "All" ? `&category=${activeCategory}` : "";
      const res = await api.get(
        `/products?search=${search}${categoryParam}&limit=40`
      );
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-400 rounded-2xl px-8 py-14 mb-10 text-white text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">
          Discover Great Products
        </h1>
        <p className="text-rose-50 text-lg">
          Shop from trusted sellers across every category, all in one place.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder={placeholderText}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 shadow-sm rounded-full pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-rose-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No products found.</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}