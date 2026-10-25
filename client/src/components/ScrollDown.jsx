import { useState, useEffect } from "react";

export default function ScrollDown() {
  // Check whether the user has reached the bottom of the page
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      setAtBottom(scrollPosition >= pageHeight - 10);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    checkScroll();

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Scroll down by one viewport height when clicked
  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // Hide the arrow when the user reaches the bottom
  if (atBottom) return null;

  return (
    <button
      type="button"
      onClick={scrollDown}
      aria-label="Scroll down"
      className="
                fixed bottom-8 right-8 z-50
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
      <span aria-hidden="true">⌄</span>
    </button>
  );
}
