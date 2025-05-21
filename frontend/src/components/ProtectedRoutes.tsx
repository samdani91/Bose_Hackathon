import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("isAuthenticatedToFactRush") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}