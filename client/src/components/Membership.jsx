import Paragraph from "./Paragraph.jsx";
import MembershipSelector from "./MembershipSelector.jsx";
import Cart from "./Cart";

export function Membership() {
  function handleCheckout(items) {
    console.log("Checking out:", items);
  }

  return (
    <section className="w-full flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Membership
      </h2>
      <Paragraph className="text-center">
        Choose the plan that fits how you train, then sign up in one click
      </Paragraph>
      <MembershipSelector />
      <Cart onCheckout={handleCheckout} />
    </section>
  );
}

export default Membership;
