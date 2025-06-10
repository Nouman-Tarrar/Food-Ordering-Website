// src/components/pages/restaurant/Orders.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, "orders"),
        where("restaurantId", "==", auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  const advanceStatus = async (order) => {
    const next =
      order.status === "New"
        ? "Preparing"
        : order.status === "Preparing"
        ? "Ready"
        : order.status === "Ready"
        ? "Out for Delivery"
        : "Completed";
    await updateDoc(doc(db, "orders", order.id), { status: next });
    setOrders(
      orders.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-300 mb-4">Orders</h2>
      {orders.map((o) => (
        <div key={o.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold">Order #{o.id}</h3>
            <p>Status: {o.status}</p>
          </div>
          <p>Customer: {o.shippingInfo?.name}</p>
          <p>Items: {o.items.map((i) => i.name).join(", ")}</p>
          <p className="mt-1 font-medium">Total Amount: Rs. {o.totalAmount?.toFixed(2)}</p>
          {o.status !== "Completed" && (
            <button
              onClick={() => advanceStatus(o)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              {o.status === "New"
                ? "Start Preparing"
                : o.status === "Preparing"
                ? "Mark Ready"
                : o.status === "Ready"
                ? "Out for Delivery"
                : "Complete"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
