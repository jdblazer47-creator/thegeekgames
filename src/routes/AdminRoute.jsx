import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, initializing, isAdmin } = useAuth();
  const loc = useLocation();
  if (initializing) return null; // or a spinner
  if (!user || !isAdmin) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
