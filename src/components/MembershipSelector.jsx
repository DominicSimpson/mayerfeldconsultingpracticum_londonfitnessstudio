import { useState } from "react";
import ToggleOption from "./ToggleOption.jsx";
import membershipTiers from "../data/membershipTiers.js";
import "./MembershipSelector.css";

export default function MembershipSelector({ onSignUp }) {
  // The parent owns the selection; each ToggleOption is controlled.
  const [selectedTierId, setSelectedTierId] = useState(null);

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
