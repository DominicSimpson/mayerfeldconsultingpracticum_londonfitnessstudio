import "./MembershipSelector.css";

/**
 * A controlled, reusable toggle for a single selectable item.
 * It holds no state of its own: the parent decides whether it is
 * `selected` and handles `onChange`.
 *
 * Built on a native radio input so keyboard navigation (arrow keys,
 * Space) and screen reader semantics work without extra code.
 */
export default function ToggleOption({
  name,
  value,
  selected,
  dimmed = false,
  onChange,
  title,
  price,
  description,
  features = [],
}) {
  return (
    <label
      className={`toggle-option${selected ? " toggle-option--selected" : ""}${
        dimmed ? " toggle-option--dimmed" : ""
      }`}
    >
      <input
        className="toggle-option__input"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
      />

      <span className="toggle-option__header">
        <span className="toggle-option__title">{title}</span>
        {price && <span className="toggle-option__price">{price}</span>}
      </span>

      {description && (
        <span className="toggle-option__text">{description}</span>
      )}

      {features.length > 0 && (
        <ul className="toggle-option__features">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}
    </label>
  );
}
