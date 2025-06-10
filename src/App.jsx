// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { CartProvider } from "./components/context/CartContext";
import { useAuth } from "./components/context/AppContext";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import UserHome from "./components/pages/user/Home";
import RestaurantList from "./components/pages/user/RestaurantList";
import RestaurantDetail from "./components/pages/user/RestaurantDetail";
import Cart from "./components/pages/user/Cart";
import UserProfile from "./components/pages/user/Profile";

import RestDashboard from "./components/pages/restaurant/Dashboard";
import RestOrders from "./components/pages/restaurant/Orders";
import RestMenu from "./components/pages/restaurant/Menu";
import RestProfile from "./components/pages/restaurant/Profile";

import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import PrivateRoute from "./components/layouts/PrivateRoute";

export default function App() {
  const { role } = useAuth();

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<PrivateRoute requiredRole="user" />}>
              <Route path="/user/home" element={<UserHome />} />
              <Route path="/user/restaurants" element={<RestaurantList />} />
              <Route path="/user/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/user/cart" element={<Cart />} />
              <Route path="/user/profile" element={<UserProfile />} />
            </Route>

            <Route element={<PrivateRoute requiredRole="restaurant" />}>
              <Route path="/restaurant/home" element={<RestDashboard />} />
              <Route path="/restaurant/orders" element={<RestOrders />} />
              <Route path="/restaurant/menu" element={<RestMenu />} />
              <Route path="/restaurant/profile" element={<RestProfile />} />
            </Route>

            <Route
              path="*"
              element={<div className="text-center text-red-500">404 ‐ Page Not Found</div>}
            />
          </Routes>
        </div>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </CartProvider>
  );
}
