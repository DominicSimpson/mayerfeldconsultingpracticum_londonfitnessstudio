const services = [
  {
    title: "Fitness Classes",
    text: "Strength, cardio and conditioning sessions for all levels.",
  },
  {
    title: "Zumba Classes",
    text: "High-energy dance workouts that feel more like a party.",
  },
  {
    title: "Nutrition Counselling",
    text: "One-to-one guidance to fuel your training and lifestyle.",
  },
  {
    title: "Wellness Programs",
    text: "Stress management, recovery and mindfulness programmes.",
  },
];

function Services() {
  return (
    <section className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px, 1fr))] gap-6">
      {services.map((service) => (
        <article
          className="bg-card border border-card-border flex flex-col gap-3 p-6 rounded-lg 
          shadow-[0_1px_2px_rgba(60,30,30,0.12),0_4px_12px_rgba(60,30,30,0.12)]
          transition-[transform, box-shadow] duration-200 ease-[ease]"
          key={service.title}
        >
          <h2 className="font-service-card text-xl font-bold">
            {service.title}
          </h2>
          <p>{service.text}</p>
          <a href="#" className="card-link">
            Learn more
          </a>
        </article>
      ))}
    </section>
  );
}

export default Services;
