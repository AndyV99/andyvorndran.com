import { NavLink } from "react-router-dom";

type NavLinkItem = {
  to: "/" | "/css-lab" | "/projects";
  label: string;
};

const links: NavLinkItem[] = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/css-lab", label: "CSS Lab" },
];

function Navbar() {
  return (
    <header className="top-nav">
      <p className="brand">Andy Vorndran</p>
      <nav aria-label="Main navigation">
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link${isActive ? " nav-link-active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
