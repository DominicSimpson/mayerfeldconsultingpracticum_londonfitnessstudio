import logo from "../assets/lfs_logo.png";

function Header() {
  const links = ["Home", "About", "Services", "Contact"];

  return (
    <header
      className="grid grid-cols-[1fr_auto_1fr] items-center p-4 gap-y-4 
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
        className="[grid-area:title] font-display text-[clamp(2rem,6vw,5rem)] 
      max-[600px]:text-[clamp(1.5rem,7vw,2rem)] max-[600px]:text-left"
      >
        London Fitness Studio
      </h1>
      <nav className="[grid-area:nav] font-serif flex justify-center items-center flex-wrap gap-4 p-4">
        {links.map((label) => (
          <a
            key={label}
            href="#"
            className="text-2xl font-bold text-nav-text hover:underline"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
export default Header;
