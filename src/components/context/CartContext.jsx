// src/components/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

// Shape of each cart item: { id, name, price, quantity }
const CartContext = createContext({
  cartItems: [],             // array of { id, name, price, quantity }
  addToCart: (item, qty) => {}, 
  clearCart: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // If the item is already in cart, we ignore it (or you could bump quantity)
  const addToCart = (item, quantity) => {
    setCartItems((prev) => {
      // check if item already exists
      if (prev.some((ci) => ci.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
