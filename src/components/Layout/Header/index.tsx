import React from "react";
import { Link, NavLink } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { ReactComponent as Logo } from "@/assets/images/logo.svg?react";
import { CornerSearch } from "@/components/Search";

function Links({ links }: { links: { name: string; path: string }[] }) {
  return (
    <nav>
      {links.map((link) => (
        <Link key={link.path} to={link.path}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const { authenticated } = useAuthStore((state) => state.authenticated);
  const logoLink = authenticated ? "/dashboard" : "/";

  return (
    <header className="header relative p-0 mb-4">
      <NavLink
        to={logoLink}
        className="logo-container absolute"
        aria-label="Home"
      >
        <Logo className="img-fluid logo" alt="React Frontend Logo" />
      </NavLink>
      {authenticated ? <CornerSearch /> : <Links links={HEADER_LINKS} />}
    </header>
  );
}

const HEADER_LINKS = [
  { name: "Login", path: "/login" },
  { name: "Sign Up", path: "/signup" },
];
