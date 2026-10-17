import FilterMenu from "./FilterMenu.jsx";
import { useState } from "react";
import ToggleOption from "./ToggleOption.jsx";
import membershipTiers from "../data/membershipTiers.js";
import "./MembershipSelector.css";

// adding a tier updates the menu automatically
const filterOptions = [
  { value: "all", label: "All tiers" },
  ...membershipTiers.map((tier) => ({ value: tier.id, label: tier.label })),
];

export default function MembershipSelector({ onSignUp }) {
  // "" means nothing selected
  // The parent owns the selection; each ToggleOption is controlled.
  const [selectedTierId, setSelectedTierId] = useState("");

  const selectedTier = membershipTiers.find((t) => t.id === selectedTierId);

  function handleSignUp() {
    if (!selectedTier) return;
    // Replace with your real sign-up flow (route, API call, modal, etc.)
    if (onSignUp) {
      onSignUp(selectedTier);
    } else {
      console.log("Signing up for:", selectedTier.title);
    }
  }

  return (
    <section className="membership-selector">
      <FilterMenu
        id="tier-menu"
        label="Membership:"
        value={selectedTierId}
        onChange={setSelectedTierId}
        options={menuOptions}
      />

      <div
        className="membership-selector__options"
        role="radiogroup"
        aria-label="Membership options"
      >
        {membershipTiers.map((tier) => (
          <ToggleOption
            key={tier.id}
            name="membership"
            value={tier.id}
            selected={tier.id === selectedTierId}
            dimmed={selectedTierId !== "" && tier.id !== selectedTierId}
            onChange={setSelectedTierId}
            title={tier.title}
            price={tier.price}
            description={tier.text}
            features={tier.features}
          />
        ))}
      </div>

      <button
        type="button"
        className="membership-selector__button"
        onClick={handleSignUp}
        disabled={!selectedTier}
      >
        Sign Up
      </button>
    </section>
  );
}
