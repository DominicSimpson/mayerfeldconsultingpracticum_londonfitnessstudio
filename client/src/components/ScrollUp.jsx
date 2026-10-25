import { useState, useEffect } from "react";

export default function ScrollUp() {
  // Check whether the user has reached the bottom of the page
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      setAtTop(window.scrollY <= 10);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    checkScroll();

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Scroll up by one viewport height when clicked
  const scrollUp = () => {
    window.scrollBy({
      top: -window.innerHeight,
      behavior: "smooth",
    });
  };

  // Hide the arrow when the user reaches the top
  if (atTop) return null;

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Scroll up"
      className="
                fixed bottom-20 right-8 z-50
                w-10 h-10
                flex items-center justify-center
                 text-black text-4xl
                opacity-40
                cursor-pointer
                transition-opacity duration-300 
                hover:opacity-90
                focus-visible:opacity-100 
                motion-safe:animate-bounce"
    >
      <span aria-hidden="true">⌃</span>
    </button>
  );
}
