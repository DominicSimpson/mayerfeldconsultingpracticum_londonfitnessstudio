import Paragraph from "./Paragraph.jsx";
import MembershipSelector from "./MembershipSelector.jsx";

export function Membership() {
  return (
    <section className="w-full flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Membership
      </h2>
      <Paragraph className="text-center">
        Choose the plan that fits how you train, then sign up in one click
      </Paragraph>
      <MembershipSelector />
    </section>
  );
}

export default Membership;
