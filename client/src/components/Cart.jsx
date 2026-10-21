import Paragraph from "./Paragraph";
import AddressForm from "./AddressForm";
import { useCart } from "./CartContext";

export default function Cart({ onCheckOut }) {
  const { cartItems, totalItems, totalPrice } = useCart();

  function handleCheckout() {
    if (onCheckOut) {
      onCheckOut(cartItems);
    } else {
      console.log("Checking out:", cartItems);
    }
  }

  return (
    <div
      className="w-full border-black/35 rounded-lg p-6 flex flex-col relative gap-6 border-2 bg-card 
          transition-[border-color,box-shadow,opacity,filter] duration-200"
    >
      <h2 className="font-service-card text-2xl font-bold text-center">
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <Paragraph>Cart is empty</Paragraph>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-3">
            <Paragraph className="font-extrabold">Order Items</Paragraph>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <Paragraph>
                    {item.title}: £{item.price} x {item.quantity}
                  </Paragraph>
                </li>
              ))}
            </ul>
            <Paragraph>Total items: {totalItems}</Paragraph>
            <Paragraph>Total: £{totalPrice.toFixed(2)}</Paragraph>
          </div>

          <div className="flex flex-col gap-6">
            <AddressForm />

            <button
              type="button"
              className="block mt-6 py-3 px-10 mx-auto font-semibold text-base text-white 
              bg-sign-up-button rounded-lg cursor-pointer enabled:hover:brightness-110
              focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button
              disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-p-text"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
