import Paragraph from "./Paragraph.jsx";
import MembershipSelector from "./MembershipSelector.jsx";
import { useProducts } from "../useProducts.js";

export function Membership() {
  const { products: tiers, loading, error } = useProducts("membership");

  if (loading) return <p>Loading memberships...</p>;
  if (error) return <p>Sorry, we couldn't load the memberships</p>;

  return (
    <section className="w-full flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Membership
      </h2>
      <Paragraph className="text-center">
        Choose the plan that fits how you train, then sign up in one click
      </Paragraph>
      <MembershipSelector tiers={tiers} />
    </section>
  );
}

export default Membership;
