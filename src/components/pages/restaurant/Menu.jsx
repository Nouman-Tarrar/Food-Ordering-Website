// src/components/pages/restaurant/Menu.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";

export default function Menu() {
  const restId = auth.currentUser.uid;
  const menuCol = collection(db, "restaurants", restId, "menu");

  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDocs(menuCol);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  const addItem = async () => {
    if (!newName || !newPrice) return;
    const ref = await addDoc(menuCol, {
      name: newName,
      price: parseFloat(newPrice),
      createdAt: serverTimestamp()
    });
    setItems([...items, { id: ref.id, name: newName, price: +newPrice }]);
    setNewName("");
    setNewPrice("");
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "restaurants", restId, "menu", id));
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = async (id, field, value) => {
    await updateDoc(doc(db, "restaurants", restId, "menu", id), {
      [field]: field === "price" ? parseFloat(value) : value
    });
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-300">Edit Menu</h2>
      <div className="bg-white p-6 rounded-lg shadow-md flex gap-4">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={addItem}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Add Item
        </button>
      </div>
      {items.map((item) => (
        <MenuItemRow
          key={item.id}
          item={item}
          updateItem={updateItem}
          deleteItem={deleteItem}
        />
      ))}
    </div>
);

function MenuItemRow({ item, updateItem, deleteItem }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
      <div className="space-y-2 md:col-span-2">
        <input
          disabled={!editing}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            editing ? "" : "bg-gray-100 cursor-not-allowed"
          }`}
        />
        <input
          disabled={!editing}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg ${
            editing ? "" : "bg-gray-100 cursor-not-allowed"
          }`}
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={async () => {
            if (editing) {
              await updateItem(item.id, "name", name);
              await updateItem(item.id, "price", price);
            }
            setEditing(!editing);
          }}
          className={`px-4 py-2 rounded-lg font-semibold ${
            editing
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {editing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => deleteItem(item.id)}
          className="px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
}