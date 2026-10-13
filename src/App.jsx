import { useState } from "react";
import Header from "./components/Header";
import Services from "./components/Services";
import Footer from "./components/Footer";
import studioPhoto from "./assets/london_fitness_studio_photo.jpg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />

      <main id="body-section">
        <figure className="lfs-photo">
          <img src={studioPhoto} alt="London Fitness Studio" />
        </figure>

        <section className="intro">
          <p>
            Welcome to London Fitness Studio! We offer fitness training and
            wellness services to help you achieve your health goals.
          </p>
          <p>
            Click on our navigation links to learn more about our offerings,
            including:
          </p>
        </section>

        <Services />
      </main>

      <Footer />
    </>
  );
}

export default App;
