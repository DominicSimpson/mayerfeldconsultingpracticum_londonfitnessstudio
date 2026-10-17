import Paragraph from "./Paragraph.jsx";
import membershipTiers from "../data/membershipTiers.js";

function Membership() {
  return (
    <section className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      {membershipTiers.map((membership) => (
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
