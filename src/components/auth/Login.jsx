// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db, googleProvider } from "../../components/firebase/config";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const postLoginRedirect = (role, phone, address) => {
    if (role === "user" && (!phone.trim() || !address.trim())) {
      navigate("/user/profile");
    } else if (role === "restaurant" && (!phone.trim() || !address.trim())) {
      navigate("/restaurant/profile");
    } else {
      navigate(role === "user" ? "/user/home" : "/restaurant/home");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      const { role, phone = "", address = "" } = snap.data() || {};
      if (role !== activeTab) throw new Error("Wrong role selected");
      postLoginRedirect(role, phone, address);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const snap = await getDoc(doc(db, "users", result.user.uid));
      const { role, phone = "", address = "" } = snap.data() || {};
      if (role !== activeTab) throw new Error("Wrong role selected");
      postLoginRedirect(role, phone, address);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">- Foodie Hub -</h2>
        <div className="flex border-b border-gray-200 mb-6">
          {["user", "restaurant"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 text-center py-2 font-semibold ${
                activeTab === tab
                  ? "border-b-4 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
            >
              Login as {tab === "user" ? "User" : "Restaurant"}
            </button>
          ))}
        </div>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600 mr-2">Or login with</span>
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Google
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-orange-500 hover:underline">
            Signup now
          </a>
        </p>
      </div>
    </div>
  );
}
