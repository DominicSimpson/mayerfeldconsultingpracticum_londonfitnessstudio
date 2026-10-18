import Paragraph from "./Paragraph.jsx";
import MembershipSelector from "./MembershipSelector.jsx";

function Membership() {
  return (
    <section className="w-full border border-black/35 rounded-lg p-6 flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Membership
      </h2>
      <Paragraph>
        <div className="text-center">
          Choose the plan that fits how you train, then sign up in one click
        </div>
      </Paragraph>
      <MembershipSelector />
    </section>
  );
}

export default Membership;
