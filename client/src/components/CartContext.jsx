import { 
  createContext, 
  useContext, 
  useState, 
  useCallback,
  useEffect, 
} from "react";

const CartContext = createContext(null);
const MAX_QUANTITY = 10;

// Same service, same date and same hour = same line
const sameLine = (a, b) =>
  a.id === b.id && a.date === b.date && a.hour === b.hour;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem("lfs-cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("lfs-cart", JSON.stringify(items));
  }, [items]);

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

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const clearPurchasedItems = useCallback((purchasedItems) => {
    setItems((currentItems) =>
      currentItems
        .map((currentItem) => { 
          const purchasedItem = purchasedItems.find((item) => 
            sameLine(currentItem, item)
          );

          if (!purchasedItem) {
            return currentItem;
          }

          return { 
            ...currentItem, 
            quantity: currentItem.quantity - purchasedItem.quantity,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

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
        clearPurchasedItems,
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
