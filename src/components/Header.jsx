import logo from "../assets/lfs_logo.png";

function Header() {
  const links = ["Home", "About", "Services", "Contact"];

  return (
    <header
      className="grid grid-cols-[1fr_auto_1fr] items-center p-4 gap-y-4 bg-header
      [grid-template-areas:'logo_title_._'_'nav_nav_nav']
      max-[600px]:grid-cols-[auto_minmax(0,1fr)]
      max-[600px]:[grid-template-areas:'logo_title'_'nav_nav']"
    >
      <a
        href="/"
        className="[grid-area:logo] justify-self-start p-5
      max-[600px]:p-2.5"
      >
        <img
          className="h-20 w-auto block"
          src={logo}
          alt="London Fitness Studio Logo"
        />
      </a>
      <h1
        className="[grid-area:title] font-display text-[length:clamp(2rem,6vw,5rem)] 
      max-[600px]:text-[length:clamp(1.5rem,7vw,2rem)] max-[600px]:text-left text-center"
      >
        London Fitness Studio
      </h1>
      <nav className="[grid-area:nav] font-serif flex justify-center items-center flex-wrap gap-4 p-4">
        {links.map((label) => (
          <a
            key={label}
            href="#"
            className="font-bold text-nav-text hover:underline mx-2 sm:mx-6 text-2xl"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
export default Header;
