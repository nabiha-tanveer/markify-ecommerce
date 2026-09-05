import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      const items = cart.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders", { items, shippingAddress });

      const result = await stripe.confirmCardPayment(res.data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await api.put(`/orders/${res.data.order._id}/confirm-payment`);
        navigate("/my-orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setProcessing(false);
    }
  };

  if (!cart) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <label className="block text-sm text-gray-600 mb-1">Shipping Address</label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-4"
          placeholder="House #, Street, City, Country"
        />

        <label className="block text-sm text-gray-600 mb-1">Card Details</label>
        <div className="border border-gray-200 rounded-xl px-3 py-3 mb-4">
          <CardElement
            options={{ style: { base: { fontSize: "16px", color: "#1f2937" } } }}
          />
        </div>

        {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Total: Rs. {total}</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-rose-600 text-white py-2.5 rounded-xl hover:bg-rose-700 transition disabled:opacity-50 font-medium"
        >
          {processing ? "Processing..." : "Pay & Place Order"}
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          Test card: 4242 4242 4242 4242, any future date, any CVC
        </p>
      </form>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}