import logo from "../assets/lfs_logo.png";

function Header() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center p-4 gap-y-4 [grid-template-areas:'logo_title_.'_'nav_nav_nav']">
      <a href="/" className="[grid-area:logo] justify-self-start p-5">
        <img className="h-20 w-auto block"
          src={logo}
          alt="London Fitness Studio Logo"
        />
      </a>
      <h1 className="abril-fatface-regular">London Fitness Studio</h1>
      <nav id="nav-bar">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  );
}
export default Header;
