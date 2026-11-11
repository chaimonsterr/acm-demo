import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { IMG } from '../api.js'
import { useCart } from '../cart.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { CartIcon, MenuIcon, UserIcon } from './Icons.jsx'

const LINKS = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/collections', 'Collections'],
  ['/customize', 'Customize'],
  ['/checkout', 'Checkout'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Aircraft City Model home">
            <img src={IMG.logo} alt="Aircraft City Model" />
            <span>Aircraft City Model</span>
          </Link>
          <nav className="nav">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <Link to="/login" className="icon-btn" aria-label="Account"><UserIcon /></Link>
            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <CartIcon />
              {count > 0 && <span className="badge">{count}</span>}
            </Link>
            <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
              <MenuIcon />
            </button>
          </div>
        </div>
        <div className={'mobile-menu' + (open ? ' open' : '')}>
          {LINKS.map(([to, label]) => (
            <Link key={to} to={to}>{label}</Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
