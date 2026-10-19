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
  quantity = 0,
  onQuantityChange,
}) {
  const base =
    "relative flex flex-col gap-3 p-6 rounded-lg border-2 bg-card cursor-pointer " +
    "transition-[border-color,box-shadow,opacity,filter] duration-200 " +
    "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sign-up-button";

  const stateClasses = selected
    ? "border-sign-up-button ring-3 ring-sign-up-button/20"
    : "border-card-border hover:border-gray-400";

  const dimmedClasses = dimmed
    ? "opacity-45 grayscale-[0.6] hover:opacity-100 hover:grayscale-0 focus-within:opacity-100 focus-within:grayscale-0"
    : "";

  return (
    <div className={`${base} ${stateClasses} ${dimmedClasses}`}>
      <label className="flex flex-col gap-3 flex-1 cursor-pointer">
        <input
          className="sr-only"
          type="radio"
          name={name}
          value={value}
          checked={selected}
          onChange={() => onChange(value)}
        />

        <span className="flex justify-between items-baseline">
          <span className="font-service-card text-xl font-bold">{title}</span>
          {price != null && (
            <span className="font-semibold text-sign-up-button">{price}</span>
          )}
        </span>

        {description && (
          <span className="font-p-text text-gray-600">{description}</span>
        )}

        {features.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-nav-text">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
      </label>

      {onQuantityChange &&
        (quantity === 0 ? (
          <button
            type="button"
            onClick={() => onQuantityChange(1)}
            aria-label={`Add ${title} to cart`}
            className="mt-2 self-start py-1 px-3 text-sm rounded-lg font-semibold text-white bg-sign-up-button
            cursor-pointer hover:brightness-100
            focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button"
          >
            Add to Cart
          </button>
        ) : (
          <div
            role="group"
            aria-label={`${title} quantity`}
            className="mt-2 self-start inline-flex items-center rounded-lg bg-sign-up-button text-white text-sm font-semibold"
          >
            <button
              type="button"
              onClick={() => onQuantityChange(-1)}
              aria-label={`Decrease ${title} quantity`}
              className="py-1 px-3 cursor-pointer rounded-l-lg hover:brightness-110
                focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button"
            >
              -
            </button>

            <span aria-live="polite" className="min-w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(1)}
              aria-label={`Increase ${title} quantity`}
              className="py-1 px-3 cursor-pointer rounded-r-lg hover:brightness-110
          focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button"
            >
              +
            </button>
          </div>
        ))}
    </div>
  );
}
