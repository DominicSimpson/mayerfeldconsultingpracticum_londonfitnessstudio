import Paragraph from "./Paragraph.jsx";

const memberships = [
  {
    title: "Basic",
    price: "£25/month",
    text: "Swimming pool access off-peak, plus pay-as-you-go classes at member rates.",
    features: [
      "Swimming pool (off-peak)",
      "Zumba and group classes at discounted member rates",
      "Wellness treatments at standard prices",
    ],
  },
  {
    title: "Intermediate",
    price: "£45/month",
    text: "Gym, pool and sauna off-peak, with a monthly allowance of group classes.",
    features: [
      "Gym, swimming pool and sauna (off-peak)",
      "4 group classes per month (Zumba, etc.)",
      "10% off wellness treatments",
      "1 free guest pass per month",
    ],
  },
  {
    title: "Gold",
    price: "£70/month",
    text: "Unlimited access to every facility, class and wellness service at any time.",
    features: [
      "All facilities, any time (gym, pool, sauna)",
      "Unlimited group classes, including Zumba",
      "1 complimentary wellness session per month",
      "20% off additional wellness treatments",
      "Priority class booking",
      "2 guest passes per month",
    ],
  },
];

function Membership() {
  return (
    <section className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      {memberships.map((membership) => (
        <article
          className="bg-card border border-card-border flex flex-col gap-3 p-6 rounded-lg 
          shadow-[0_1px_2px_rgba(60,30,30,0.12),0_4px_12px_rgba(60,30,30,0.12)]
          transition-[transform,box-shadow] duration-200 ease-[ease]
          hover:-translate-y-1
          hover:shadow-[0_2px_4px_rgba(60,30,30,0.14),0_12px_24px_rgba(60,30,30,0.18)]"
          key={membership.title}
        >
          <h2 className="font-service-card text-xl font-bold">
            {membership.title}
          </h2>
          <Paragraph>{membership.text}</Paragraph>
          <a
            href="#"
            className="mt-auto self-start font-bold text-nav-text hover:underline focus-visible:underline"
          >
            Learn more
          </a>
        </article>
      ))}
    </section>
  );
}

export default Membership;
