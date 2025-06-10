// src/components/pages/user/Cart.jsx
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { db, auth } from "../../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Cart() {
  const { cartItems, clearCart } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [details, setDetails] = useState({ name: "", phone: "", address: "" });
  const deliveryFee = 160;
  const itemsTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalAmount = itemsTotal + deliveryFee;

  const handleConfirm = async () => {
    await addDoc(collection(db, "orders"), {
      userId: auth.currentUser.uid,
      restaurantId: cartItems[0]?.restaurantId,
      items: cartItems.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity
      })),
      status: "New",
      deliveryFee,
      totalAmount,
      shippingInfo: details,
      createdAt: serverTimestamp()
    });
    clearCart();
    setConfirm(true);
  };

  if (confirm)
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl text-gray-300 font-bold mb-4">Order Confirmed!</h2>
        <p>Thank you for ordering. Your food is on its way!</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Your Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2 mb-2">
                <p>
                  {item.quantity}× {item.name}
                </p>
                <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2">
              <p>Delivery Fee</p>
              <p>Rs. {deliveryFee.toFixed(2)}</p>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <p>Total</p>
              <p>Rs. {totalAmount.toFixed(2)}</p>
            </div>
            <div className="text-right mt-4">
              <button
                onClick={() => setCheckout(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {checkout && cartItems.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-2xl font-semibold mb-4">Shipping Details</h3>
          {["name", "phone", "address"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 capitalize">{field}</label>
              {field === "address" ? (
                <textarea
                  rows={3}
                  required
                  value={details[field]}
                  onChange={(e) => setDetails({ ...details, [field]: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
                />
              ) : (
                <input
                  type={field === "phone" ? "tel" : "text"}
                  required
                  value={details[field]}
                  onChange={(e) => setDetails({ ...details, [field]: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
                />
              )}
            </div>
          ))}
          <div className="flex justify-between items-center">
            <p className="font-medium">Total Amount:</p>
            <p className="font-bold">Rs. {totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <button
              onClick={handleConfirm}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
