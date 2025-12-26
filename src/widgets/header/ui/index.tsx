import { Link, NavLink } from "react-router";
import { useAuthStore } from "@/entities/user";
import Logo from "@/shared/assets/images/logo.svg?react";
import { CornerSearch } from "@/features/search";

function Links({ links }: { links: { name: string; path: string }[] }) {
  return (
    <nav className="absolute right-4 top-[30px] flex gap-4 text-sm">
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
    <header className="relative h-[82px] z-[5] p-0 mb-4">
      <NavLink
        to={logoLink}
        className="absolute ml-[15px] top-0 max-[400px]:ml-[5px]"
        aria-label="Home"
      >
        <Logo className="img-fluid h-[50px] mr-[10px]" title="React Frontend Logo" />
      </NavLink>
      {authenticated ? <CornerSearch /> : <Links links={HEADER_LINKS} />}
    </header>
  );
}

const HEADER_LINKS = [
  { name: "Login", path: "/login" },
  { name: "Sign Up", path: "/signup" },
];
