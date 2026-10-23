import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);
const MAX_QUANTITY = 10;

// Same service, same date and same hour = same line
const sameLine = (a, b) =>
  a.id === b.id && a.date === b.date && a.hour === b.hour;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  function addItem(item) {
    changeQuantity(item, 1);
  }

  function changeQuantity(item, delta) {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item));

      // Not in the cart yet: add it on the first "+"
      if (!existing) {
        return delta > 0 ? [...prev, { ...item, quantity: 1 }] : prev;
      }

      return prev
        .map((i) =>
          sameLine(i, item)
            ? { ...i, quantity: Math.min(i.quantity + delta, MAX_QUANTITY) }
            : i,
        )
        .filter((i) => i.quantity > 0);
    });
  }

  function removeItem(item) {
    setItems((prev) => prev.filter((i) => !sameLine(i, item)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        changeQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
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
