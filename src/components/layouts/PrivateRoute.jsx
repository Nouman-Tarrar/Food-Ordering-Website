// src/components/layouts/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AppContext";

export default function PrivateRoute({ requiredRole }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
