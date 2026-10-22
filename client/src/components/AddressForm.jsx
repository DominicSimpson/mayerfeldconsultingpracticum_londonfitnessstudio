import { useState } from "react";

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
  { name: "city", label: "City", autoComplete: "address-line3-city" },
  { name: "county", label: "County", autoComplete: "address-line4-county" },
  { name: "postcode", label: "Postcode", autocomplete: "postal-code" },
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
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Send data to an API or process it further
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
          className="font-p-text font-bold border border-black/25 rounded-md px-6 py-2 hover:bg-black/5 bg-sky-500"
        >
          Confirm Checkout
        </button>
      </form>
    </div>
  );
}
