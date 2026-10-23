import { useState } from "react";
import { useCart } from "./CartContext.jsx";

export default function AddressForm({ onOrderPlaced }) {
  const { items } = useCart();
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "submitting", message: "" });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items.map(({ id, quantity, date, hour }) => ({
            id,
            quantity,
            date,
            hour,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      setFormData(initialFormData);
      onOrderPlaced(data.orderId);
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {fields.map(({ name, label, autoComplete, optional, type }) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={name} className="font-p-text">
              {label}
              {optional && " (optional)"}:
            </label>
            <input
              id={name}
              type={type ?? "text"}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              autoComplete={autoComplete}
              required={!optional}
              className="w-full rounded-lg border-2 border-black/35 bg-white px-3 py-2
                  focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={status.state === "submitting"}
          className="font-p-text font-bold border border-black/25 rounded-md px-6 py-2 hover:bg-black/5 bg-sky-500 disabled:opacity-50"
        >
          {status.state === "submitting"
            ? "Placing order..."
            : "Confirm Checkout"}
        </button>
        {status.state === "error" && (
          <p role="alert" className="text-red-700">
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
