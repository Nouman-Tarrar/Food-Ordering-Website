// src/components/pages/user/RestaurantDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { useCart } from "../../context/CartContext";

export default function RestaurantDetail() {
  const { id: restId } = useParams();
  const menuCol = collection(db, "restaurants", restId, "menu");
  const revCol = collection(db, "restaurants", restId, "reviews");

  const [rest, setRest] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    (async () => {
      const rSnap = await getDoc(doc(db, "restaurants", restId));
      if (rSnap.exists()) setRest(rSnap.data());

      const mSnap = await getDocs(menuCol);
      const mData = mSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMenu(mData);
      setQuantities(mData.reduce((a, i) => ({ ...a, [i.id]: 1 }), {}));

      const rvSnap = await getDocs(revCol);
      setReviews(rvSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, [restId]);

  const submitReview = async () => {
    await addDoc(revCol, {
      userId: auth.currentUser.uid,
      rating,
      reviewText: text,
      createdAt: serverTimestamp()
    });
    const rvSnap = await getDocs(revCol);
    setReviews(rvSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setText("");
    setRating(5);
  };

  if (!rest) return <div className="p-6">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-2">{rest.restName}</h2>
        <p>Rating: {rest.rating || 0} ⭐</p>
      </div>

      {/* Menu */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Menu</h3>
        {menu.map((item) => {
          const inCart = cartItems.some((ci) => ci.id === item.id);
          return (
            <div key={item.id} className="flex justify-between items-center border-b pb-2 mb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p>Rs. {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  disabled={inCart}
                  value={quantities[item.id]}
                  onChange={(e) =>
                    setQuantities({ ...quantities, [item.id]: +e.target.value })
                  }
                  className="px-4 py-2 text-base border rounded-xl"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}×
                    </option>
                  ))}
                </select>
                <button
                  disabled={inCart}
                  onClick={() =>
                    addToCart({ ...item, restaurantId: restId }, quantities[item.id])
                  }
                  className={`px-4 py-1 rounded-2xl text-white ${
                    inCart ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {inCart ? "Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Fee */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p>Delivery Fee: Rs. 160</p>
      </div>

      {/* Reviews */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        {reviews.map((r) => (
          <div key={r.id} className="mb-2">
            <p>
              <strong>{r.rating} ⭐</strong> – {r.reviewText}
            </p>
          </div>
        ))}
        <div className="mt-4">
          <label className="block mb-1 text-gray-700 font-medium">Your Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(+e.target.value)}
            className="w-32 px-4 py-2 border rounded-xl text-base"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a review…"
            className="w-full mt-3 border rounded-lg p-3"
          />
          <button
            onClick={submitReview}
            className="mt-2 bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
