import { useEffect } from "react";
import {useAuth} from "../context/AuthContext.jsx";
import { useCart } from "./CartContext.jsx";
import Paragraph from "./Paragraph.jsx";
import AddressForm from "./AddressForm.jsx";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

function Cart({ openAuthModal }) {
  const {
    items,
    removeItem,
    changeQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  const {user, loading} = useAuth();

  const isEmpty = items.length === 0;

  // Close the drawer with the Escape key (unchanged)

  useEffect(() => {
    if (!isCartOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") setIsCartOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);


  return (
    <>
      {/* Backdrop: click outside the drawer to close it */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="cart"
        aria-label="Your cart"
        aria-hidden={!isCartOpen}
        inert={!isCartOpen}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm overflow-y-auto
          bg-card p-6 shadow-xl transition-transform duration-200
          flex flex-col gap-4
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-p-text text-2xl font-bold">Your cart</h2>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="font-p-text font-bold border border-black/25 rounded-md px-3 py-1 hover:bg-black/5"
          >
            Close
          </button>
        </div>

        {isEmpty ? (
          <Paragraph>Your cart is empty.</Paragraph>
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.date}-${item.hour}`}
                  className="flex flex-col gap-2 border-b border-black/15 pb-4"
                >
                  <div>
                    <p className="font-bold">{item.title}</p>
                    {item.date && (
                      <p className="text-sm">
                        {item.date} at {item.hour}
                      </p>
                    )}
                    <p className="text-sm">{gbp.format(item.price)} each</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item, -1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="border border-black/25 rounded-md px-3 py-1 hover:bg-black/5"
                      >
                        -
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item, 1)}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="border border-black/25 rounded-md px-3 py-1 hover:bg-black/5"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-p-text font-bold">
                      {gbp.format(item.price * item.quantity)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    className="font-p-text self-start text-sm underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <p className="font-p-text text-lg font-bold">
              Total: {gbp.format(totalPrice)}
            </p>

            {loading ? (
              <Paragraph>Checking your sign-in status...</Paragraph>
            ) : !user ? (
              <div className="rounded-md border border-black/20 p-4">
                <Paragraph>
                  You must be signed in before you can proceed to checkout.
                </Paragraph>

                <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  openAuthModal("login");
                }}
                className="rounded-md bg-black px-4 py-2 font-p-text text-white hover:bg-gray-800"
                >
                  Sign in to checkout
                </button>
              </div>
            ) : (
              <AddressForm />
            )}
          </>
        )}
      </aside>
    </>
  );
}

export default Cart;
