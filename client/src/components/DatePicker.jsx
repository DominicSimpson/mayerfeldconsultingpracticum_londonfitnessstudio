import { useId } from "react";

// So people can't pick a past date

const today = new Date().toLocaleDateString("en-GB");

function DatePicker({
  label = "Choose a date",
  value,
  onChange,
  min = today,
  max,
}) {
  const id = useId();

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="font-bold font-p-text">
        Choose a date
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="border border-black/25 rounded-md px-3 py-2 bg-card"
      />
    </div>
  );
}

export default DatePicker;
export { today };
