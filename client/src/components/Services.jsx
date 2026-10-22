import Paragraph from "./Paragraph.jsx";
import londonFitnessStudioPhoto from "../assets/images/services/fitnessclasses_photo.jpg";
import londonZumbaClassesPhoto from "../assets/images/services/zumbaclasses_photo.jpg";
import londonNutritionCounsellingPhoto from "../assets/images/services/nutritioncounselling_photo.jpg";
import londonWellnessProgramsPhoto from "../assets/images/services/wellnessprograms_photo.jpg";
import BookingForm from "./BookingForm.jsx";
import { services } from "../../../server/data/services";

const images = {
  fitness_classes: londonFitnessStudioPhoto,
  zumba_classes: londonZumbaClassesPhoto,
  nutrition_counselling: londonNutritionCounsellingPhoto,
  wellness_programs: londonWellnessProgramsPhoto,
};

function Services() {
  return (
    <section className="w-full border border-black/35 rounded-lg p-6 flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <article
            className="bg-card border border-card-border flex flex-col gap-3 p-6 rounded-lg 
            shadow-[0_1px_2px_rgba(60,30,30,0.12),0_4px_12px_rgba(60,30,30,0.12)]
            transition-[transform,box-shadow] duration-200 ease-[ease]
            hover:-translate-y-1
            hover:shadow-[0_2px_4px_rgba(60,30,30,0.14),0_12px_24px_rgba(60,30,30,0.18)]"
            key={service.title}
          >
            {images[service.id] && (
              <img
                src={images[service.id]}
                alt={service.title}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <h3 className="font-service-card text-xl font-bold">
              {service.title}
            </h3>
            <Paragraph>{service.text}</Paragraph>
            <a
              href="#"
              className="font-p-text self-start font-bold text-nav-text hover:underline focus-visible:underline"
            >
              Learn more
            </a>
            <BookingForm
              itemId={service.id}
              itemTitle={service.title}
              price={service.price}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default Services;
