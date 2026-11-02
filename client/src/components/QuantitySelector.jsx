export default function QuantitySelector({ 
    title,
    quantity,
    onQuantityChange,
    min = 0,
    max = 10,
 }) {
    return (
        <div
            role="group"
            aria-label={`${title} quantity`}
            className="mt-2 self-stretch flex items-center justify-center gap-3 sm:justify-between"
        >
            <span className="font-p-text text-sm font-semibold text-nav-text p-3">
                Quantity
            </span>

            <div className="inline-flex items-center rounded-lg bg-black text-white text-sm font-semibold">
                <button
                    type="button"
                    onClick={() => onQuantityChange(-1)}
                    disabled={quantity <= min}
                    aria-label={`Decrease ${title} quantity`}
                    className="py-1 px-3 rounded-l-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    -
                </button>

                <span aria-live="polite" className="min-w-6 text-center">
                    {quantity}
                </span>
                
                <button
                    type="button"
                    onClick={() => onQuantityChange(1)}
                    disabled={quantity >= max}
                    aria-label={`Increase ${title} quantity`}
                    className="py-1 px-3 rounded-r-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    +
                </button>

            </div>  
        </div>
    );
}