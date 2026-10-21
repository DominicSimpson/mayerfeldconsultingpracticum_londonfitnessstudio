import { useState } from "react";
import ToggleOption from "./ToggleOption.jsx";
import FilterMenu from "./FilterMenu.jsx";
import membershipTiers from "../../../server/data/membershipTiers";
import Paragraph from "./Paragraph.jsx";
import { useCart } from "./CartContext.jsx";

// adding a tier updates the menu automatically
const menuOptions = [
  { value: "", label: "Choose a membership..." },
  ...membershipTiers.map((tier) => ({ value: tier.id, label: tier.title })),
];

export default function MembershipSelector({ onSignUp }) {
  // The parent owns the selection; the dropdown and each ToggleOption
  // are controlled by it. "" means nothing selected.
  const [selectedTierId, setSelectedTierId] = useState("");
  const [query, setQuery] = useState("");

  const selectedTier = membershipTiers.find((t) => t.id === selectedTierId);
  const visibleTiers = membershipTiers.filter((tier) =>
    tier.title.toLowerCase().includes(query.toLowerCase()),
  );
  const selectedIsVisible = visibleTiers.some((t) => t.id === selectedTierId);

  function handleSignUp() {
    if (!selectedTier || !selectedIsVisible) return;
    // Replace with your real sign-up flow (route, API call, modal, etc.)
    if (onSignUp) {
      onSignUp(selectedTier);
    } else {
      console.log("Signing up for:", selectedTier.title);
    }
  }

  return (
    <section className="w-full max-w-250 mx-auto flex flex-col gap-4">
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
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter memberships..."
        aria-label="Filter memberships"
      />

      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4"
        role="radiogroup"
        aria-label="Membership options"
      >
        {visibleTiers.map((tier) => (
          <ToggleOption
            key={tier.id}
            name="membership"
            value={tier.id}
            selected={tier.id === selectedTierId}
            dimmed={selectedTierId !== "" && tier.id !== selectedTierId}
            onChange={setSelectedTierId}
            title={tier.title}
            price={`£${tier.price}`}
            description={tier.text}
            features={tier.features}
            quantity={
              cartItems.find((item) => item.id === tier.id)?.quantity ?? 0
            }
            onQuantityChange={(delta) => changeQuantity(tier, delta)}
          />
        ))}
      </div>
    </section>
  );
}
