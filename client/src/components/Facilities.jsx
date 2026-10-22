import Paragraph from "./Paragraph.jsx";
import londonFitnessStudioPhoto from "../assets/images/london_fitness_studio_photo.jpg";
import swimmingPoolPhoto from "../assets/images/swimmingpool_photo.jpg";
import saunaPhoto from "../assets/images/sauna_photo.jpg";
import sportsCourtsPhoto from "../assets/images/sportscourts_photo.jpg";
import DatePicker, { today } from "./DatePicker.jsx";
import { useState } from "react";
import HourPicker from "./HourPicker.jsx";

function Facilities() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedHour, setSelectedHour] = useState("09:00");

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
              className="font-p-text mt-auto self-start font-bold text-nav-text hover:underline focus-visible:underline"
            >
              Learn more
            </a>
          </article>
        ))}
      </div>
      <BookingForm
        title="Book a Facility"
        label="Choose a facility"
        options={facilities}
      />
    </section>
  );
}

export default Facilities;
