import { Link, NavLink } from "react-router";

import { useAuthStore } from "@/entities/user";
import Logo from "@/shared/assets/images/logo.svg?react";

import CornerSearch from "./CornerSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";

function Links({ links }: { links: { name: string; path: string }[] }) {
  return (
    <nav className="absolute top-7.5 right-4 flex gap-4 text-sm">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-grey-dark hover:text-primary transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const authenticated = useAuthStore((state) => state.authenticated);
  const logoLink = authenticated ? "/dashboard" : "/";

  return (
    <header className="relative z-5 mb-4 h-[82px] p-0">
      <NavLink
        to={logoLink}
        className="absolute top-0 ml-[15px] max-[400px]:ml-[5px]"
        aria-label="Home"
      >
        <Logo
          className="img-fluid mr-[10px] h-[50px]"
          title="React Frontend Logo"
        />
      </NavLink>
      {authenticated ? <CornerSearch /> : <Links links={HEADER_LINKS} />}
      <div className="absolute top-6 right-36">
        <LanguageSwitcher />
      </div>
    </header>
  );
}

const HEADER_LINKS = [
  { name: "Login", path: "/login" },
  { name: "Sign Up", path: "/signup" },
];
