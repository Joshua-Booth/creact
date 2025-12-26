import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
