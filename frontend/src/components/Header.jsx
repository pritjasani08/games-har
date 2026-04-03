import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <Gamepad2 size={32} className="logo-icon" />
          <span>MSU <span className="logo-highlight">Games</span></span>
        </Link>
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
          <Link to="/disclaimer" className={`nav-link ${isActive('/disclaimer')}`}>Disclaimer</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
