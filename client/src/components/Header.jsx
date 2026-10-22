import logo from "../assets/logo/lfs_logo.png";
import { useCart } from "./CartContext.jsx";

function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-y-4 p-4 bg-header-footer
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
        className="[grid-area:title] font-heading text-left 
        text-[length:clamp(1.5rem,7vw,2rem)] 
        sm:text-center sm:text-[length:clamp(2rem,6vw,5rem)] text-white"
      >
        LONDON FITNESS STUDIO
      </h1>

      <div className="[grid-area:controls] justify-self-end flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Open cart, ${totalItems} items`}
          title={`View cart (${totalItems} ${totalItems === 1 ? "item" : "items"})`}
          className="text-2xl size-32"
        >
          🛒
          {totalItems > 0 && (
            <span className="text-base font-bold">{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
