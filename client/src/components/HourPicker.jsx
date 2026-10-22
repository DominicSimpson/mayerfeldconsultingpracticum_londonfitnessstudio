import { useId } from "react";

const hours = Array.from({ length: 14 }, (_, i) => {
  const h = String(i + 9).padStart(2, "0");
  return `${h}:00`;
});

function HourPicker({ label = "Choose a time", value, onChange }) {
  const id = useId();

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-black/25 rounded-md px-3 py-2 bg-card"
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
    </div>
  );
}

export default HourPicker;
