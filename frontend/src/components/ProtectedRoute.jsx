import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}