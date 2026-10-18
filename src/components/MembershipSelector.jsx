import { useState } from "react";
import ToggleOption from "./ToggleOption.jsx";
import FilterMenu from "./FilterMenu.jsx";
import membershipTiers from "../data/membershipTiers";

// adding a tier updates the menu automatically
const menuOptions = [
  { value: "", label: "Choose a membership..." },
  ...membershipTiers.map((tier) => ({ value: tier.id, label: tier.title })),
];

export default function MembershipSelector({ onSignUp }) {
  // The parent owns the selection; the dropdown and each ToggleOption
  // are controlled by it. "" means nothing selected.
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
    <section className="w-full max-w-250 mx-auto flex flex-col gap-4">
      <FilterMenu
        id="tier-menu"
        label="Membership:"
        value={selectedTierId}
        onChange={setSelectedTierId}
        options={menuOptions}
      />

      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4"
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
        className="block mt-6 py-3 px-10 mx-auto font-semibold text-base text-white 
        bg-sign-up-button rounded-lg cursor-pointer enabled:hover:brightness-110
        focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button
        disabled-bg-gray-300 disabled-text-gray-500 disabled:cursor-not-allowed"
        onClick={handleSignUp}
        disabled={!selectedTier}
      >
        Sign Up
      </button>
    </section>
  );
}
