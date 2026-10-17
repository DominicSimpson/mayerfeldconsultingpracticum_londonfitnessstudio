import Paragraph from "./Paragraph.jsx";
import MembershipSelector from "./MembershipSelector.jsx";

function Membership() {
  return (
    <section className="w-full flex flex-col items-center gap-6">
      <h2 className="font-service-card text-2xl font-bold">Membership</h2>
      <Paragraph>
        Choose the plan that fits how you train, then sign up in one click.
      </Paragraph>
      <MembershipSelector />
    </section>
  );
}

export default Membership;
