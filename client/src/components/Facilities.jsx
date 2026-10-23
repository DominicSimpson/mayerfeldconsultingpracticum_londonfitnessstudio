import Paragraph from "./Paragraph.jsx";
import gymPhoto from "../assets/images/facilities/london_fitness_studio_photo.jpg";
import swimmingPoolPhoto from "../assets/images/facilities/swimmingpool_photo.jpg";
import saunaPhoto from "../assets/images/facilities/sauna_photo.jpg";
import sportsCourtsPhoto from "../assets/images/facilities/sportscourts_photo.jpg";
import BookingForm from "./BookingForm.jsx";
import { useProducts } from "../useProducts.js";

const images = {
  gyms: gymPhoto,
  swimming_pools: swimmingPoolPhoto,
  sauna_steamrooms: saunaPhoto,
  sports_courts: sportsCourtsPhoto,
};

function Facilities() {
  const { products: facilities, loading, error } = useProducts("facility");

  if (loading) return <p>Loading facilities...</p>;
  if (error) return <p>Sorry, we couldn't load the facilities</p>;

  return (
    <section className="w-full border border-black/35 rounded-lg p-6 flex flex-col gap-6">
      <h2 className="font-service-card text-2xl font-bold text-center">
        Facilities
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {facilities.map((facility) => (
          <article
            className="bg-card border border-card-border flex flex-col gap-3 p-6 rounded-lg 
            shadow-[0_1px_2px_rgba(60,30,30,0.12),0_4px_12px_rgba(60,30,30,0.12)]
            transition-[transform,box-shadow] duration-200 ease-[ease]
            hover:-translate-y-1
            hover:shadow-[0_2px_4px_rgba(60,30,30,0.14),0_12px_24px_rgba(60,30,30,0.18)]"
            key={facility.id}
          >
            {images[facility.id] && (
              <img
                src={images[facility.id]}
                alt={facility.title}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <h3 className="font-service-card text-xl font-bold">
              {facility.title}
            </h3>
            <Paragraph>{facility.text}</Paragraph>
            <a
              href="#"
              className="font-p-text self-start font-bold text-nav-text hover:underline focus-visible:underline"
            >
              Learn more
            </a>
            <BookingForm
              itemId={facility.id}
              itemTitle={facility.title}
              price={facility.price}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default Facilities;
