import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import Wishlist from "./pages/Wishlist";
import Messages from "./pages/Messages";

const buyerOnly = (el) => <ProtectedRoute roles={["buyer"]}>{el}</ProtectedRoute>;
const sellerOnly = (el) => <ProtectedRoute roles={["seller"]}>{el}</ProtectedRoute>;
const adminOnly = (el) => <ProtectedRoute roles={["admin"]}>{el}</ProtectedRoute>;

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/cart" element={buyerOnly(<Cart />)} />
          <Route path="/checkout" element={buyerOnly(<Checkout />)} />
          <Route path="/my-orders" element={buyerOnly(<MyOrders />)} />
          <Route path="/wishlist" element={buyerOnly(<Wishlist />)} />

          <Route path="/seller/dashboard" element={sellerOnly(<SellerDashboard />)} />
          <Route path="/seller/add-product" element={sellerOnly(<AddProduct />)} />

          <Route path="/admin/pending" element={adminOnly(<AdminDashboard />)} />

          <Route
            path="/messages"
            element={
              <ProtectedRoute roles={["buyer", "seller"]}>
                <Messages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;