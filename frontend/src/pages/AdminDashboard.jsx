import { useState, useEffect } from "react";
import api from "../api/axios";

const TABS = ["Overview", "Sellers", "Products", "Users", "Orders"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [s, u, p, o] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/products"),
        api.get("/admin/orders"),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setProducts(p.data);
      setOrders(o.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const act = async (request, successMsg) => {
    setMessage("");
    try {
      await request();
      setMessage(successMsg);
      loadAll();
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed");
    }
  };

  const sellers = users.filter((u) => u.role === "seller");
  const pendingProducts = products.filter((p) => !p.isApproved);

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t
                ? "bg-rose-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-emerald-600 mb-4">{message}</p>}

      {/* OVERVIEW */}
      {tab === "Overview" && stats && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              ["Total Revenue", `Rs. ${stats.totalRevenue}`],
              ["Paid Orders", stats.totalOrders],
              ["Buyers", stats.totalBuyers],
              ["Sellers", stats.totalSellers],
              ["Products", stats.totalProducts],
              ["Pending Products", stats.pendingProducts],
              ["Pending Sellers", stats.pendingSellers],
              ["Total Users", stats.totalUsers],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Orders</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
            {stats.recentOrders.length === 0 && (
              <p className="p-5 text-gray-400">No orders yet.</p>
            )}
            {stats.recentOrders.map((o) => (
              <div key={o._id} className="p-4 flex justify-between text-sm">
                <span className="text-gray-600">
                  #{o._id.slice(-8)} - {o.buyer?.name || "Deleted user"}
                </span>
                <span className="font-semibold">Rs. {o.totalAmount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SELLERS */}
      {tab === "Sellers" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
          {sellers.length === 0 && <p className="p-5 text-gray-400">No sellers.</p>}
          {sellers.map((s) => (
            <div key={s._id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-800">{s.shopName || s.name}</p>
                <p className="text-sm text-gray-400">{s.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    s.isApprovedSeller
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {s.isApprovedSeller ? "Approved" : "Pending"}
                </span>
                {s.isApprovedSeller ? (
                  <button
                    onClick={() => act(() => api.put(`/admin/sellers/${s._id}/revoke`), "Seller revoked")}
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
                  >
                    Revoke
                  </button>
                ) : (
                  <button
                    onClick={() => act(() => api.put(`/admin/sellers/${s._id}/approve`), "Seller approved")}
                    className="text-sm px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {tab === "Products" && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            {pendingProducts.length} pending approval, {products.length} total
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-40 bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  {!p.isApproved && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{p.seller?.shopName || p.seller?.name}</p>
                <p className="text-rose-600 font-bold mt-1">Rs. {p.price}</p>
                <div className="flex gap-2 mt-3">
                  {!p.isApproved && (
                    <button
                      onClick={() => act(() => api.put(`/admin/products/${p._id}/approve`), "Product approved")}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 text-sm font-medium"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm("Is product ko delete karna hai?")) {
                        act(() => api.delete(`/admin/products/${p._id}`), "Product removed");
                      }
                    }}
                    className="flex-1 border border-red-300 text-red-600 py-2 rounded-xl hover:bg-red-50 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === "Users" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
          {users.length === 0 && <p className="p-5 text-gray-400">No users.</p>}
          {users.map((u) => (
            <div key={u._id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {u.role}
                </span>
                <button
                  onClick={() => {
                    if (window.confirm(`${u.name} ko delete karna hai?`)) {
                      act(() => api.delete(`/admin/users/${u._id}`), "User deleted");
                    }
                  }}
                  className="text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      {tab === "Orders" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
          {orders.length === 0 && <p className="p-5 text-gray-400">No paid orders yet.</p>}
          {orders.map((o) => (
            <div key={o._id} className="p-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">
                  #{o._id.slice(-8)} - {o.buyer?.name || "Deleted user"}
                </span>
                <span className="font-semibold">Rs. {o.totalAmount}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(o.createdAt).toLocaleDateString()} | {o.orderStatus} |{" "}
                {o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}