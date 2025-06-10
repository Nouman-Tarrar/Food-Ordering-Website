// src/components/pages/user/Profile.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const load = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      }
    };
    load();
  }, []);

  const save = async () => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      address: profile.address
    });
    alert("Profile updated! You can now proceed.");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Phone</label>
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Address</label>
        <textarea
          rows={2}
          value={profile.address}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <button
        onClick={save}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}
