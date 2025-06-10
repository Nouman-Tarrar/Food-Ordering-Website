// src/components/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db, googleProvider } from "../../components/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [activeTab, setActiveTab] = useState("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const finishRedirect = (role) => {
    // always send to profile to fill phone/address
    navigate(role === "user" ? "/user/profile" : "/restaurant/profile");
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match.");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const role = activeTab;

      // users/{uid}
      await setDoc(doc(db, "users", uid), {
        username,
        email,
        role,
        // phone/address left blank for now
        phone: "",
        address: "",
        createdAt: serverTimestamp(),
      });

      // restaurants/{uid} if applicable
      if (role === "restaurant") {
        await setDoc(doc(db, "restaurants", uid), {
          ownerName: username,
          restName: "",
          email,
          phone: "",
          address: "",
          rating: 0,
          totalReviews: 0,
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Signup successful! Please complete your profile.");
      finishRedirect(role);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const role = activeTab;

      await setDoc(
        doc(db, "users", uid),
        {
          username: result.user.displayName || "",
          email: result.user.email,
          role,
          phone: "",
          address: "",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (role === "restaurant") {
        await setDoc(
          doc(db, "restaurants", uid),
          {
            ownerName: result.user.displayName || "",
            restName: "",
            email: result.user.email,
            phone: "",
            address: "",
            rating: 0,
            totalReviews: 0,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      toast.success("Google signup successful! Please complete your profile.");
      finishRedirect(role);
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
              Signup as {tab === "user" ? "User" : "Restaurant"}
            </button>
          ))}
        </div>
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold">
            Signup
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600 mr-2">Or signup with</span>
          <button
            onClick={handleGoogleSignup}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Google
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Login now
          </a>
        </p>
      </div>
    </div>
  );
}
