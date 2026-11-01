import { useState } from "react";
import DatePicker, { today } from "./DatePicker.jsx";
import HourPicker from "./HourPicker.jsx";
import { useCart } from "./CartContext.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import RemoveFromCart from "./RemoveFromCart.jsx";

function BookingForm({ itemId, itemTitle, price }) {
  const { addItem, removeItem, items } = useCart();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedHour, setSelectedHour] = useState("09:00");
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState("");

  const currentBooking = {
    id: itemId,
    date: selectedDate,
    hour: selectedHour,
  };

  const isInCart = items.some((item) =>
    item.id === currentBooking.id &&
    item.date === currentBooking.date &&
    item.hour === currentBooking.hour
  );

  function handleRemoveFromCart() {
    removeItem(currentBooking);
    setConfirmation(`${itemTitle} removed from your cart`);
  }

  function handleSubmit(e) {
    e.preventDefault();

    addItem({
      id: itemId,
      title: itemTitle,
      price,
      date: selectedDate,
      hour: selectedHour,
      quantity,
    });

    setConfirmation(`${quantity} x ${itemTitle} added to your cart`);
  }

  function handleQuantityChange(delta) {
    setQuantity((previous) =>
      Math.max(1, Math.min(previous + delta, 10))
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-auto flex w-full flex-col items-center gap-3 border-t border-black/15 pt-4"
    >
      <h4 className="font-service-card font-bold">
        Book Session
      </h4>

      <DatePicker 
        value={selectedDate} 
        onChange={setSelectedDate} 
      />

      <HourPicker value={selectedHour} 
        onChange={setSelectedHour} 
      />

      <QuantitySelector
        title={itemTitle}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        min={1}
        max={10}
      />

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="submit"
          className="font-p-text text-sm font-bold border border-black/25 rounded-md w-36 h-10 whitespace-no-wrap bg-card hover:bg-black/5"        >
        Add to Cart
      </button>

        {isInCart && (
          <RemoveFromCart
            onRemove={handleRemoveFromCart}
          />
        )}
      </div>

      <div className="min-h-18 w-full">
        {confirmation && (
          <p role="status" className="font-p-text">
            {confirmation}
          </p>
        )}
      </div>
    </form>
  );
}

export default BookingForm;
