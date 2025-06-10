// src/components/pages/user/RestaurantList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function RestaurantList() {
  const [rests, setRests] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "restaurants"));
      setRests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-300 mb-6">Restaurants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rests.map((r) => (
          <div
            key={r.id}
            onClick={() => nav(`/user/restaurant/${r.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl border"
          >
            <img src={r.image || ""} alt={r.restName} className="w-full h-44 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{r.restName}</h3>
              <p className="mt-1">Rating: {r.rating || 0} ⭐</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
