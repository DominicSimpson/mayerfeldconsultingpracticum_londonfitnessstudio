import { useState } from "react";
import ToggleOption from "./ToggleOption.jsx";
import FilterMenu from "./FilterMenu.jsx";
import membershipTiers from "../data/membershipTiers";
import Paragraph from "./Paragraph.jsx";

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
  const [cartItems, setCartItems] = useState([]);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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

  const MAX_QUANTITY = 10;

  function changeQuantity(tier, delta) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === tier.id);

      if (!existing) {
        return delta > 0 ? [...prev, { ...tier, quantity: 1 }] : prev;
      }

      const newQuantity = Math.min(existing.quantity + delta, MAX_QUANTITY);
      if (newQuantity <= 0) {
        return prev.filter((item) => item.id !== tier.id);
      }
      return prev.map((item) =>
        item.id === tier.id ? { ...item, quantity: newQuantity } : item,
      );
    });
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

      <div
        className="w-full border-black/35 rounded-lg flex flex-col relative gap-3 p-6 border-2 bg-card 
          transition-[border-color,box-shadow,opacity,filter] duration-200"
      >
        <h2 className="font-service-card text-2xl font-bold text-center">
          Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <Paragraph>Cart is empty</Paragraph>
        ) : (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <Paragraph>
                    {item.title}: £{item.price} x {item.quantity}
                  </Paragraph>
                </li>
              ))}
            </ul>
            <Paragraph>Total items: {totalItems}</Paragraph>
            <Paragraph>Total: £{totalPrice.toFixed(2)}</Paragraph>
          </>
        )}
      </div>

      <button
        type="button"
        className="block mt-6 py-3 px-10 mx-auto font-semibold text-base text-white 
        bg-sign-up-button rounded-lg cursor-pointer enabled:hover:brightness-110
        focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sign-up-button
        disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        onClick={handleSignUp}
        disabled={!selectedTier || !selectedIsVisible}
      >
        Sign Up
      </button>
    </section>
  );
}
