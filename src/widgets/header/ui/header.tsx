import { href, Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/entities/user";
import { ModeToggle } from "@/shared/ui/mode-toggle";
import Logo from "@/shared/assets/images/logo.svg?react";

function Links({ links }: { links: { name: string; path: string }[] }) {
  return (
    <nav className="absolute top-3 right-4 flex items-center gap-4 text-sm">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-muted-foreground hover:text-foreground
            transition-colors"
        >
          {link.name}
        </Link>
      ))}
      <ModeToggle />
    </nav>
  );
}

/**
 * Top navigation bar with branding, theme toggle, and auth-aware controls.
 * @returns Positioned `<header>` with the app logo, a theme toggle, and login/signup links (hidden when authenticated).
 */
export function Header() {
  const { t } = useTranslation();
  const authenticated = useAuthStore((state) => state.authenticated);
  const logoLink = authenticated ? href("/dashboard") : href("/");

  const headerLinks = [
    { name: t("nav.login"), path: href("/login") },
    { name: t("nav.signUp"), path: href("/signup") },
  ];

  return (
    <header className="relative z-5 mb-4 h-[82px] p-0">
      <NavLink
        to={logoLink}
        className="absolute top-2 ml-4 max-[400px]:ml-2"
        aria-label="Home"
      >
        <Logo className="mr-[10px] h-[50px]" title="React Frontend Logo" />
      </NavLink>
      {authenticated ? (
        <div className="absolute top-3 right-4 flex items-center gap-4">
          <ModeToggle />
        </div>
      ) : (
        <Links links={headerLinks} />
      )}
    </header>
  );
}
