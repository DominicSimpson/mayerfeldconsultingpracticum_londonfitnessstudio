import { useState, useEffect, useRef } from "react";
import DatePicker, { today } from "./DatePicker.jsx";
import HourPicker from "./HourPicker.jsx";
import { useCart } from "./CartContext.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import RemoveFromCart from "./RemoveFromCart.jsx";
import { isBankHoliday } from "../../../shared/bankHolidays.js";
import {
  getBookableHours,
  isWithinOpeningHours,
} from "../../../shared/openingHours.js";

function BookingForm({ itemId, itemTitle, price }) {
  const { addItem, removeItem, items } = useCart();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedHour, setSelectedHour] = useState("09:00");
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState(null);

  const bankHoliday = isBankHoliday(selectedDate);

  const availableHours = bankHoliday
  ? []
  : getBookableHours(selectedDate);

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

  const confirmationIsValid = 
    confirmation?.type === "removed" ||
    confirmation?.type === "error" ||
    (
      confirmation?.type === "added" &&
      items.some((item) =>
        item.id === confirmation.booking.id &&
        item.date === confirmation.booking.date &&
        item.hour === confirmation.booking.hour
      ) 
  );

  const wasInCart = useRef(isInCart);

  useEffect(() => {
    if (wasInCart.current && !isInCart) {
      setQuantity(1);
    }

    wasInCart.current = isInCart;
  }, [isInCart]);

  function handleRemoveFromCart() {
    removeItem(currentBooking);
    // Reset the quantity selector to its default:
    setQuantity(1);
    
    setConfirmation({ 
      type: "removed", 
      message: `${itemTitle} removed from your cart`,
      booking: {
        id: itemId,
        date: selectedDate,
        hour: selectedHour,
      }
    });
  }

  function handleDateChange(date) {
    setSelectedDate(date);
    setSelectedHour("");
  

    if (isBankHoliday(date)) {
      setConfirmation({
        type: "error",
        message: "The fitness centre is closed on bank holidays. Please select another date.",
      });
    } else if (getBookableHours(date).length === 0) {
      setConfirmation({
        type: "error",
        message: "No sessions available for the selected date.",
      });
    } else {
      setConfirmation(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Prevent bookings on bank holidays:
    if (isBankHoliday(selectedDate)) {
      setConfirmation({
        type: "error",
        message: "The fitness centre is closed on bank holidays. Please select another date.",
      });
      return;
    }

    // Check opening hours:
    if (!availableHours.includes(selectedHour)) {
      setConfirmation({
        type: "error",
        message: "The selected booking time is outside the fitness centre's opening hours. Please select another time.",
      });
      return;
    }

    const booking = {
      id: itemId,
      title: itemTitle,
      price,
      date: selectedDate,
      hour: selectedHour,
      quantity,
    };

    addItem(booking);

    setConfirmation({
      type: "added",
      message: `${quantity} x ${itemTitle} added to your cart`,
      booking: {
        id: itemId,
        date: selectedDate,
        hour: selectedHour,
      },
    });
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
        onChange={handleDateChange} 
      />

      <HourPicker 
        value={availableHours.includes(selectedHour) ? selectedHour : ""} 
        onChange={(hour) => {
          setSelectedHour(hour);
          setConfirmation(null);
        }}
        availableHours={availableHours}
        disabled={bankHoliday} 
      />

      <QuantitySelector
        title={itemTitle}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        min={1}
        max={10}
      />

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          className="font-p-text font-bold border border-black/25 rounded-md w-36 h-10 bg-card hover:bg-black/5"        >
          Add to Cart
        </button>

        <div className="h-10">
          {isInCart && (
            <RemoveFromCart
              onRemove={handleRemoveFromCart} />
          )}
        </div>
      
      </div>

      <div className="min-h-18 w-full">
        {confirmationIsValid && (
          <p role="status" className="font-p-text">
            {confirmation.message}
          </p>
        )}
      </div>
    </form>
  );
}

export default BookingForm;
