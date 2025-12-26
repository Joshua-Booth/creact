import React from 'react'
import { useLocation } from 'react-router'
import { Link, NavLink } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { ReactComponent as Logo } from '@/assets/images/logo.svg?react'
import { CornerSearch } from '@/components/Search'

export default function Header() {
  const { authenticated } = useAuthStore((state) => state.authenticated)
  const location = useLocation()
  const logoLink = authenticated ? '/dashboard' : '/'

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
  )
}

const HEADER_LINKS = [
  { name: 'Login', path: '/login' },
  { name: 'Sign Up', path: '/signup' },
]
