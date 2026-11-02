import { useId } from "react";

function HourPicker({
  label = "Choose a time",
  value,
  onChange,
  availableHours = [],
  disabled = false,
}) {
  const id = useId();

  const noAvailableHours = disabled || availableHours.length === 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="font-bold font-p-text">
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={noAvailableHours}
        required
        className="border border-black/25 rounded-md px-3 py-2 bg-card font-p-text disabled:opacity-50"
      >
        <option value="">
          {noAvailableHours
            ? "No sessions available"
            : "Choose a time..."}
        </option>

        {availableHours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
    </div>
  );
}

export default HourPicker;
