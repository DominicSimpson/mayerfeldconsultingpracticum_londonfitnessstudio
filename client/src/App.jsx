import Header from "./components/Header";
import Services from "./components/Services";
import Membership from "./components/Membership";
import Footer from "./components/Footer";
import studioPhoto from "./assets/images/london_fitness_studio_photo.jpg";
import Paragraph from "./components/Paragraph";
import Facilities from "./components/Facilities";
import OpeningTimes from "./components/OpeningTimes";
import Cart from "./components/Cart";
import ScrollDown from "./components/ScrollDown";

function App() {
  return (
    <>
      <Header />

      <main className="flex flex-col w-full max-w-275 mx-auto py-8 px-8 items-center gap-6">
        <figure className="block w-full max-w-250">
          <img
            className="w-full h-auto"
            src={studioPhoto}
            alt="London Fitness Studio"
          />
        </figure>

        <section className="text-center max-w-[60ch] flex flex-col gap-4">
          <Paragraph>
            Welcome to London Fitness Studio! We offer fitness training and
            wellness services to help you achieve your health goals.
          </Paragraph>
          <Paragraph>
            Click on our navigation links to learn more about us.
          </Paragraph>
        </section>

        <Services />
        <Facilities />
        <Membership />
        <OpeningTimes />
      </main>
      <Cart />

      <Footer />
      <ScrollDown />
    </>
  );
}

export default App;
