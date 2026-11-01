export default function RemoveFromCart({ onRemove }) {
    return (
        <button
            type="button"
            onClick={onRemove}
            className="font-p-text text-sm font-bold border border-black/25 rounded-md w-36 h-10 whitespace-no-wrap bg-card hover:bg-black/5"
        >
            Remove from Cart
        </button>
    );
}