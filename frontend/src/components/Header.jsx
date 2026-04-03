import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <Gamepad2 size={32} className="logo-icon" />
          <span>MSU <span className="logo-highlight">Games</span></span>
        </Link>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className={`nav ${isMobileMenuOpen ? 'nav-mobile-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMobileMenu}>Home</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={closeMobileMenu}>Contact</Link>
          <Link to="/disclaimer" className={`nav-link ${isActive('/disclaimer')}`} onClick={closeMobileMenu}>Disclaimer</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
