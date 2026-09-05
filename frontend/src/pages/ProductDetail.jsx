import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [message, setMessage] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    setMessage("");
    try {
      await api.post("/cart", { productId: id, quantity: 1 });
      setMessage("Added to cart!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/reviews", { productId: id, rating, comment });
      setComment("");
      fetchReviews();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (!product) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>

        <div>
          {product.category && (
            <span className="text-xs uppercase tracking-wide text-rose-500 font-semibold">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-gray-400 mt-1">{product.seller?.shopName}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-amber-500 font-semibold">★ {averageRating}</span>
            <span className="text-gray-400 text-sm">({totalReviews} reviews)</span>
          </div>

          <p className="text-3xl text-rose-600 font-bold mt-4">Rs. {product.price}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-sm text-gray-400 mt-2">Stock: {product.stock} available</p>

          {message && <p className="text-sm text-emerald-600 mt-3">{message}</p>}

          {user?.role === "buyer" && (
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-rose-600 text-white px-6 py-2.5 rounded-xl hover:bg-rose-700 transition font-medium"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

        {user?.role === "buyer" && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-5 rounded-2xl shadow-sm mb-6 max-w-md border border-gray-100"
          >
            <label className="block text-sm text-gray-600 mb-1">Your Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 mb-3 w-full"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-3"
              rows={3}
            />

            <button
              type="submit"
              className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition font-medium"
            >
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{review.buyer?.name}</span>
                  <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                </div>
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}