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
    <section className="services">
      {services.map((service) => (
        <article className="service" key={service.title}>
          <h2>{service.title}</h2>
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
