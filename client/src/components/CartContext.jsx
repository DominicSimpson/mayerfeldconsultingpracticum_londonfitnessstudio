import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);
const MAX_QUANTITY = 10;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function changeQuantity(item, delta) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (!existing) {
        return delta > 0 ? [...prev, { ...item, quantity: 1 }] : prev;
      }

      const newQuantity = Math.min(existing.quantity + delta, MAX_QUANTITY);
      if (newQuantity <= 0) {
        return prev.filter((i) => i.id !== item.id);
      }
      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i,
      );
    });
  }

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ cartItems, changeQuantity, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
