import Paragraph from "./Paragraph";
import { useCart } from "./CartContext";

export default function Cart() {
  const { cartItems, totalItems, totalPrice } = useCart();

  return (
    <div
      className="w-full border-black/35 rounded-lg flex flex-col relative gap-3 p-6 border-2 bg-card 
          transition-[border-color,box-shadow,opacity,filter] duration-200"
    >
      <h2 className="font-service-card text-2xl font-bold text-center">
        Your Cart
      </h2>
      {cartItems.length === 0 ? (
        <Paragraph>Cart is empty</Paragraph>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
