import ThemeDial from "./ThemeDial";

function Navbar() {
  return (
    <header className="top-nav">
      <p className="brand">Andy Vorndran</p>
      <div className="nav-right">
        <nav aria-label="Main navigation">
          <ul className="nav-links">
            <li>
              <a className="nav-link" href="#index">
                Index
              </a>
            </li>
            <li>
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <ThemeDial />
      </div>
    </header>
  );
}

export default Navbar;
