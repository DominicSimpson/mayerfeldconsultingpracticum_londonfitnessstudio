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
  onAddToCart,
  inCart = false,
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
    <>
      <label className={`${base} ${stateClasses} ${dimmedClasses}`}>
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

      {onAddToCart && (
        <button
          type="button"
          onClick={onAddToCart}
          disabled={inCart}
          aria-label={`Add ${title} to cart`}
          className="mt-2 py-2 px-4 rounded-lg font-semibold text-white bg-sign-up-button
        cursor-pointer enabled:hover:brightness-100
        focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button
        disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      )}
    </>
  );
}
