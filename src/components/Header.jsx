import logo from "../assets/lfs_logo.png";

function Header() {
  return (
    <header id="fitness_studio_heading">
      <div id="logo">
        <a href="#">
          <img src={logo} alt="London Fitness Studio Logo" />
        </a>
      </div>
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
