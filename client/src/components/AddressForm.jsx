import { useState } from "react";

const fields = [
  { name: "firstName", label: "First Name", autoComplete: "given-name" },
  { name: "surname", label: "Surname", autoComplete: "family-name" },
  {
    name: "firstLineAddress",
    label: "First Line of Address",
    autoComplete: "address-line1",
  },
  {
    name: "secondLineAddress",
    label: "Second Line of Address (optional)",
    autoComplete: "address-line2",
  },
  { name: "city", label: "City", autoComplete: "address-line3-city" },
  { name: "county", label: "County", autoComplete: "address-line4-county" },
  { postcode: "postcode", label: "Postcode", autocomplete: "postal-code" },
  { country: "country", label: "Country", autoComplete: "country-name" },
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
      <h2>Address Form</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(({ name, label, autoComplete }) => (
          <div key={name}>
            <label>
              {label}:
              <input
                type="text"
                name="firstName"
                value={formData[name]}
                onChange={handleChange}
                autoComplete={autoComplete}
                required
              />
            </label>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
