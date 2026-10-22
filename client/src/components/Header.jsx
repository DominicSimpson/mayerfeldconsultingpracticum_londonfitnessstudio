import { useState } from "react";
import logo from "../assets/logo/lfs_logo.png";
import Hamburger from "hamburger-react";
import { useCart } from "./CartContext.jsx";

function Header() {
  const links = ["Home", "About", "Services", "Contact"];
  const [isOpen, setOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-y-4 p-4 bg-header
      [grid-template-areas:'logo_title_controls'_'nav_nav_nav']
      sm:grid-cols-[1fr_auto_1fr]"
    >
      <a
        href={import.meta.env.BASE_URL}
        className="[grid-area:logo] justify-self-start p-2.5 sm:p-5"
      >
        <img
          className="h-20 w-auto block"
          src={logo}
          alt="London Fitness Studio Logo"
        />
      </a>

      <h1
        className="[grid-area:title] font-display text-left 
        text-[length:clamp(1.5rem,7vw,2rem)] 
        sm:text-center sm:text-[length:clamp(2rem,6vw,5rem)]"
      >
        London Fitness Studio
      </h1>

      <div className="[grid-area:controls] justify-self-end flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Open cart, ${totalItems} items`}
          className="text-2xl"
        >
          🛒
          {totalItems > 0 && (
            <span className="text-base font-bold">{totalItems}</span>
          )}
        </button>

        <div className="sm:hidden">
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            label="Show menu"
            size={24}
          />
        </div>
      </div>

      <nav
        className={`[grid-area:nav] font-serif flex-col items-center gap-4 p-4
        ${isOpen ? "flex" : "hidden"}
        sm:flex sm:flex-row sm:justify-center sm:flex-wrap`}
      >
        {links.map((label) => (
          <a
            key={label}
            href="#"
            onClick={() => setOpen(false)}
            className="text-lg mx-2 font-bold text-nav-text hover:underline sm:text-[1.65rem] sm:mx-6"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Header;
