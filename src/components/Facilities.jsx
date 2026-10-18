import Paragraph from "./Paragraph.jsx";
import londonFitnessStudioPhoto from "../assets/images/london_fitness_studio_photo.jpg";
import swimmingPoolPhoto from "../assets/images/swimmingpool_photo.jpg";
import saunaPhoto from "../assets/images/sauna_photo.jpg";
import sportsCourtsPhoto from "../assets/images/sportscourts_photo.jpg";

const facilities = [
  {
    title: "Gyms",
    text: "Train your way with modern cardio machines, free weights, and strength equipment, with expert staff on hand to help you get started.",
    img: londonFitnessStudioPhoto,
  },
  {
    title: "Swimming Pools",
    text: "Swim laps in our main pool or let the little ones splash safely in our dedicated children's pool.",
    img: swimmingPoolPhoto,
  },
  {
    title: "Sauna and steam rooms",
    text: "Unwind after your workout in our sauna, spa, and steam rooms, the perfect way to ease tired muscles.",
    img: saunaPhoto,
  },
  {
    title: "Sports courts",
    text: "Book a court for badminton, tennis, or indoor football, whether you're playing with friends or joining a game.",
    img: sportsCourtsPhoto,
  },
];

function Facilities() {
  return (
    <section className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      <h2 className="font-service-card text-2xl font-bold">Facilities</h2>
      {facilities.map((facility) => (
        <article
          className="bg-card border border-card-border flex flex-col gap-3 p-6 rounded-lg 
          shadow-[0_1px_2px_rgba(60,30,30,0.12),0_4px_12px_rgba(60,30,30,0.12)]
          transition-[transform,box-shadow] duration-200 ease-[ease]
          hover:-translate-y-1
          hover:shadow-[0_2px_4px_rgba(60,30,30,0.14),0_12px_24px_rgba(60,30,30,0.18)]"
          key={facility.title}
        >
          {facility.img && (
            <img
              src={facility.img}
              alt={facility.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <h2 className="font-service-card text-xl font-bold">
            {facility.title}
          </h2>
          <Paragraph>{facility.text}</Paragraph>
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

export default Facilities;
