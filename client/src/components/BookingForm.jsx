import { useState, useId } from "react";
import DatePicker, { today } from "./DatePicker.jsx";
import HourPicker from "./HourPicker.jsx";
import { useCart } from "./CartContext.jsx";

function BookingForm({ itemId, itemTitle, price }) {
  const { addItem } = useCart();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedHour, setSelectedHour] = useState("09:00");
  const [confirmation, setConfirmation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    addItem({
      id: itemId,
      title: itemTitle,
      price,
      date: selectedDate,
      hour: selectedHour,
    });
    // Replace with a real API call once you have a backend
    setConfirmation(`${itemTitle} added to your cart.`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-auto flex flex-col items-center gap-3 border-t border-black/15 pt-4"
    >
      <h4 className="font-service-card font-bold">Book Session</h4>

      <DatePicker value={selectedDate} onChange={setSelectedDate} />
      <HourPicker value={selectedHour} onChange={setSelectedHour} />

      <button
        type="submit"
        className="font-bold border border-black/25 rounded-md px-6 py-2 bg-card hover:bg-black/5"
      >
        Add to Cart
      </button>
      {confirmation && <p role="status">{confirmation}</p>}
    </form>
  );
}

export default BookingForm;
