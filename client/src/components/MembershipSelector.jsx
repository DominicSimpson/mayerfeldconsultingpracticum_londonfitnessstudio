import { useState, useEffect, useRef } from "react";
import ToggleOption from "./ToggleOption.jsx";
import FilterMenu from "./FilterMenu.jsx";
import { useCart } from "./CartContext.jsx";
import RemoveFromCart from "./RemoveFromCart.jsx";

// adding a tier updates the menu automatically

export default function MembershipSelector({ tiers }) {
  // The parent owns the selection; the dropdown and each ToggleOption
  // are controlled by it. "" means nothing selected.
  const { addItem, removeItem, items } = useCart();

  const [selectedTierId, setSelectedTierId] = useState("");
  const [query, setQuery] = useState("");
  const [confirmations, setConfirmations] = useState({});
  const [quantities, setQuantities] = useState({});
  const menuOptions = [
    { value: "", label: "Choose a membership..." },
    ...tiers.map((tier) => ({ value: tier.id, label: tier.title })),
  ];

  const previousCartMemberships = useRef(
    new Set(
      items
        .filter((item) => tiers.some((tier) => tier.id === item.id))
        .map((item) => item.id)
    )
  );

  useEffect(() => {
    const currentIds = new Set(
      items
        .filter((item) => tiers.some((tier) => tier.id === item.id))
        .map((item) => item.id)
    );

    const removedIds = [...previousCartMemberships.current].filter(
      (id) => !currentIds.has(id)
    );

    if (removedIds.length > 0) {
      setQuantities((previous) => {
        const updated = { ...previous };

        for (const id of removedIds) {
          if (updated[id]?.type === "added") {
            delete updated[id];
          }
        }

        return updated;
      });
    }

    previousCartMemberships.current = currentIds;
  }, [items, tiers]);

  function handleQuantityChange(tier, delta) {
    setQuantities((previous) => ({
      ...previous,
      [tier.id]: Math.max(
        1,
        Math.min((previous[tier.id] ?? 1) + delta, 10)
      ),
    }));

    setConfirmations((previous) => ({
      ...previous,
      [tier.id]: "",
    }));
  }

  function handleAddToCart(tier) {
    const quantity = quantities[tier.id] ?? 1;

    addItem({
      id: tier.id,
      title: tier.title,
      price: tier.price,
      quantity,
    });

    setConfirmations((previous) => ({
      ...previous,  
      [tier.id]: {
        type: "added",
        message: `${quantity} x ${tier.title} added to your cart`,
      },
    }));
  }

  function handleRemoveFromCart(tier) {
    removeItem({ id: tier.id });

    // Reset only this membership's quantity:
    setQuantities((previous) => ({
      ...previous,
      [tier.id]: 1,
    }));


    setConfirmations((previous) => ({
      ...previous,
      [tier.id]: {
        type: "removed",
        message: `${tier.title} removed from your cart`,
      },
    }));
  }

  const visibleTiers = tiers.filter((tier) =>
    tier.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="w-full flex flex-col gap-4 font-p-text">
      <FilterMenu
        id="tier-menu"
        label="Membership:"
        value={selectedTierId}
        onChange={(id) => {
          setSelectedTierId(id);
          setQuery("");
        }}
        options={menuOptions}
      />

      <input
        className="font-p-text"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter memberships..."
        aria-label="Filter memberships"
      />

      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 font-p-text"
        role="radiogroup"
        aria-label="Membership options">

        {visibleTiers.map((tier) => (
          <div key={tier.id} className="flex h-full flex-col gap-3">
            <ToggleOption
              name="membership"
              value={tier.id}
              selected={tier.id === selectedTierId}
              dimmed={selectedTierId !== "" && tier.id !== selectedTierId}
              onChange={setSelectedTierId}
              title={tier.title}
              price={`£${tier.price}`}
              description={tier.text}
              features={tier.features}
              quantity={quantities[tier.id] ?? 1}
              onQuantityChange={(delta) =>
                handleQuantityChange(tier, delta)
              }
            />

          <div className="flex flex-col justify-center gap-3">
            <button
              type="button"
              onClick={() => handleAddToCart(tier)}
              className="font-p-text font-bold border border-black/25 rounded-md w-36 h-10 bg-card hover:bg-black/5"        >
              Add to Cart
            </button>

            <div className="h-10">
              {items.some((item) => item.id === tier.id) && (
                <RemoveFromCart
                  onRemove={() => handleRemoveFromCart(tier)}
                />
              )}
            </div>
          </div>

            <div className="min-h-18 w-full">
              {confirmations[tier.id] && (
                <p role="status" className="font-p-text">
                  {confirmations[tier.id].message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
