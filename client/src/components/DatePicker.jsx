import { useRef } from "react";

// So people can't pick a past date (must be YYYY-MM-DD for the input):
const today = new Date().toLocaleDateString("en-CA");

function DatePicker({
  label = "Choose a date",
  value,
  onChange,
  min = today,
  max,
}) {
  const inputRef = useRef(null);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        aria-label={label}
        title={label}
        className="border border-black/25 rounded-md px-3 py-2 bg-card hover:bg-black/5"
      >
        📅
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute left-0 top-full h-0 w-0 opacity-0 pointer-events-none"
      />
    </div>
  );
}

export default DatePicker;
export { today };
