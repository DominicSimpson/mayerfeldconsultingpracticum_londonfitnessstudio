function ItemGrid({ items, updateItem }) {
  const [query, setQuery] = useState("");

  const visible = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter items..."
      />
      <div className="grid">
        {visible.map((item) => (
          <Toggle
            key={item.id}
            label={item.name}
            checked={item.done}
            onChange={(next) => updateItem(item.id, { done: next })}
          />
        ))}
      </div>
    </>
  );
}
