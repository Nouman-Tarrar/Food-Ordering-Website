import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from "firebase/firestore";

export default function Dashboard() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    rating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    (async () => {
      const restId = auth.currentUser.uid;

      // Get all orders for this restaurant
      const orderSnap = await getDocs(
        query(collection(db, "orders"), where("restaurantId", "==", restId))
      );
      const orders = orderSnap.docs.map((d) => d.data());

      // Compute order stats
      const pendingOrders = orders.filter(
        (o) => o.status !== "Completed"
      ).length;
      const completedOrders = orders.filter(
        (o) => o.status === "Completed"
      ).length;
      const totalEarnings = orders
        .filter((o) => o.status === "Completed")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // Get reviews
      const reviewSnap = await getDocs(
        collection(db, "restaurants", restId, "reviews")
      );
      const reviews = reviewSnap.docs.map((d) => d.data());
      const totalReviews = reviews.length;
      const avgRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      // Set stats
      setStats({
        pendingOrders,
        completedOrders,
        totalEarnings,
        rating: avgRating.toFixed(1),
        totalReviews
      });
    })();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-300 mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Pending Orders</h3>
          <p className="text-2xl">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Completed Orders</h3>
          <p className="text-2xl">{stats.completedOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Total Earnings</h3>
          <p className="text-2xl">Rs. {stats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Rating</h3>
          <p className="text-2xl">{stats.rating} ⭐</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">Total Reviews</h3>
          <p className="text-2xl">{stats.totalReviews}</p>
        </div>
      </div>
    </div>
  );
}
