import { useState, useEffect, useRef } from "react";
import DatePicker, { today } from "./DatePicker.jsx";
import HourPicker from "./HourPicker.jsx";
import { useCart } from "./CartContext.jsx";
import QuantitySelector from "./QuantitySelector.jsx";
import RemoveFromCart from "./RemoveFromCart.jsx";
import { isBankHoliday } from "../../../shared/bankHolidays.js";
import { getBookableHours } from "../../../shared/openingHours.js";
import { formatUKDate } from "../utils/formatUKDate.js";

function BookingForm({ itemId, itemTitle, price }) {
  const { addItem, removeItem, items } = useCart();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedHour, setSelectedHour] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [removalMessage, setRemovalMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Check bank holidays and available booking hours
  const bankHoliday = isBankHoliday(selectedDate);

  const availableHours = bankHoliday
    ? []
    : getBookableHours(selectedDate);

  const selectedHourIsValid = availableHours.includes(selectedHour);

  // The booking currently selected in the form
  const currentBooking = {
    id: itemId,
    date: selectedDate,
    hour: selectedHour,
  };

  // Check whether the currently selected booking is in the cart
  const isInCart = items.some(
    (item) =>
      item.id === currentBooking.id &&
      item.date === currentBooking.date &&
      item.hour === currentBooking.hour
  );

  // Get all bookings for this particular service
  const confirmedBookings = items.filter(
    (item) => item.id === itemId
  );

  // Reset quantity if the currently selected booking
  // is removed from the cart elsewhere
  const wasInCart = useRef(isInCart);

  useEffect(() => {
    if (wasInCart.current && !isInCart) {
      setQuantity(1);
    }

    wasInCart.current = isInCart;
  }, [isInCart]);

  // Handle date selection
  function handleDateChange(date) {
    setSelectedDate(date);
    setSelectedHour("");
    setRemovalMessage("");

    if (isBankHoliday(date)) {
      setBookingError(
        "The fitness centre is closed on bank holidays. Please select another date."
      );
    } else if (getBookableHours(date).length === 0) {
      setBookingError(
        "No sessions available for the selected date."
      );
    } else {
      setBookingError("");
    }
  }

  // Handle hour selection
  function handleHourChange(hour) {
    setSelectedHour(hour);
    setBookingError("");
    setRemovalMessage("");
  }

  // Add a booking to the cart
  function handleSubmit(e) {
    e.preventDefault();

    // Prevent bookings on bank holidays
    if (isBankHoliday(selectedDate)) {
      setBookingError(
        "The fitness centre is closed on bank holidays. Please select another date."
      );
      return;
    }

    // Check that the selected time is bookable
    if (!selectedHourIsValid) {
      setBookingError(
        "Please select an available booking time."
      );
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

    setBookingError("");
    setRemovalMessage("");
  }

  // Remove the currently selected booking
  function handleRemoveFromCart() {
    removeItem(currentBooking);

    setQuantity(1);
    setBookingError("");

    setRemovalMessage(
      `${itemTitle} removed from your cart`
    );
  }

  // Change booking quantity within permitted limits
  function handleQuantityChange(delta) {
    setQuantity((previous) =>
      Math.max(1, Math.min(previous + delta, 10))
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
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
        value={selectedHourIsValid ? selectedHour : ""}
        onChange={handleHourChange}
        availableHours={availableHours}
        disabled={bankHoliday || availableHours.length === 0}
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
          className="font-p-text font-bold border border-black/25 rounded-md w-36 h-10 bg-card hover:bg-black/5"
        >
          Add to Cart
        </button>

        <div className="h-10">
          {isInCart && (
            <RemoveFromCart
              onRemove={handleRemoveFromCart}
            />
          )}
        </div>
      </div>

      {/* Validation errors and cart confirmations */}
      <div className="min-h-18 w-full" aria-live="polite">
        {bookingError && (
          <p className="font-p-text text-red-500 mb-2">
            {bookingError}
          </p>
        )}

        {removalMessage && (
          <p className="font-p-text mb-2">
            {removalMessage}
          </p>
        )}

        {confirmedBookings.length > 0 && (
          <div className="font-p-text">
            <p className="font-bold mb-2">
              {itemTitle} added to your cart:
            </p>

            <ul className="space-y-1">
              {confirmedBookings.map((booking) => (
                <li
                  key={`${booking.id}-${booking.date}-${booking.hour}`}
                  className="text-sm"
                >
                  {booking.quantity} x {itemTitle} —{" "}
                  {formatUKDate(booking.date)} at {booking.hour}

                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}

export default BookingForm;