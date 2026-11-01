export default function RemoveFromCart({onRemove}) {
    return (
        <button
            type="button"
            onClick={onRemove}
            className="font-p-text font-bold border border-black/25 rounded-md px-6 py-2 bg-card hover:bg-black/5"
        >
            Remove from Cart
        </button>
    );
}