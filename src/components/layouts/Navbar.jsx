// src/components/layouts/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";

export default function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-zinc-950 text-white shadow-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to={role === "user" ? "/user/home" : role === "restaurant" ? "/restaurant/home" : "/login"}
          className="text-2xl font-extrabold tracking-wide text-orange-400 hover:text-white"
        >
          - Foodie Hub -
        </Link>
        <div className="flex items-center gap-8">
          {role === "user" && (
            <ul className="flex gap-6 text-sm font-medium">
              <li><Link to="/user/home">Home</Link></li>
              <li><Link to="/user/restaurants">Restaurants</Link></li>
              <li><Link to="/user/cart">Cart</Link></li>
              <li><Link to="/user/profile">Profile</Link></li>
            </ul>
          )}
          {role === "restaurant" && (
            <ul className="flex gap-6 text-sm font-medium">
              <li><Link to="/restaurant/home">Dashboard</Link></li>
              <li><Link to="/restaurant/orders">Orders</Link></li>
              <li><Link to="/restaurant/menu">Menu</Link></li>
              <li><Link to="/restaurant/profile">Profile</Link></li>
            </ul>
          )}
          {!role && (
            <ul className="flex gap-6 text-sm font-medium">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </ul>
          )}
          {role && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
