import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [profile, setProfile] = useState({
    ownerName: "",
    restName: "",
    address: "",
    phone: "",
    email: "",
    image: ""
  });

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "restaurants", auth.currentUser.uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
    })();
  }, []);

  const save = async () => {
    await updateDoc(doc(db, "restaurants", auth.currentUser.uid), profile);
    alert("Profile updated!");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Restaurant Profile</h2>

      {/* Image Preview */}
      {profile.image && (
        <div className="mb-4 text-center">
          <img
            src={profile.image}
            alt="Restaurant Logo"
            className="mx-auto w-32 h-32 object-cover rounded-full border"
          />
        </div>
      )}

      {/* Form Fields */}
      {[
        { field: "ownerName", label: "Owner Name", type: "text" },
        { field: "restName", label: "Restaurant Name", type: "text" },
        { field: "address", label: "Address", type: "textarea" },
        { field: "phone", label: "Phone", type: "tel" },
        { field: "email", label: "Email", type: "email" },
        { field: "image", label: "Image URL", type: "text" }
      ].map(({ field, label, type }) => (
        <div key={field} className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">{label}</label>
          {type === "textarea" ? (
            <textarea
              rows={2}
              value={profile[field]}
              onChange={(e) =>
                setProfile({ ...profile, [field]: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
            />
          ) : (
            <input
              type={type}
              value={profile[field]}
              onChange={(e) =>
                setProfile({ ...profile, [field]: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
            />
          )}
        </div>
      ))}

      <button
        onClick={save}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}