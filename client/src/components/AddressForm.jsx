import { useState } from "react";
import { useCart } from "./CartContext.jsx";

const fields = [
  { name: "firstName", label: "First Name", autoComplete: "given-name" },
  { name: "surname", label: "Surname", autoComplete: "family-name" },
  {
    name: "firstLineAddress",
    label: "First Line of Address",
    autoComplete: "address-line1",
    fullWidth: true,
  },
  {
    name: "secondLineAddress",
    label: "Address Line 2",
    fullWidth: true,
    optional: true,
    autoComplete: "address-line2",
  },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "county", label: "County", autoComplete: "address-level1" },
  { name: "postcode", label: "Postcode", autoComplete: "postal-code" },
  { name: "country", label: "Country", autoComplete: "country-name" },
  {
    name: "email",
    label: "Email",
    autoComplete: "email",
    type: "email",
    fullWidth: true,
  },
];

const initialFormData = Object.fromEntries(fields.map((f) => [f.name, ""]));

export default function AddressForm() {
  const { items } = useCart();
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ state: "submitting", message: "" });
    
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
        },
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

      if (!res.ok) {
        throw new Error(data.error || "Unable to start Stripe Checkout");
      }

      if (!data.url) {
        throw new Error("Stripe Checkout URL was not returned");
      }

      // Redirect the customer to Stripe's hosted payment page:
      window.location.assign(data.url);
    } catch (err) {
      setStatus({ 
        state: "error", 
        message: err.message || "Something went wrong",
      });
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
            ? "Redirecting to payment..."
            : "Proceed to payment"}
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
