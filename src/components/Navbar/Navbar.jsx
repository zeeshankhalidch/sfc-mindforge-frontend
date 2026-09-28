import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="lux-navbar">
      <div className="lux-navbar-inner">
        <Link to="/" className="lux-brand" onClick={close}>
          <span className="lux-brand-dot"></span>
          <span className="lux-brand-text">CAMPUS COIN</span>
        </Link>

        <nav className={`lux-nav-menu ${open ? "open" : ""}`}>
          <Link to="/" className="lux-nav-link" onClick={close}>Home</Link>
          <Link to="/#about" className="lux-nav-link" onClick={close}>About Us</Link>
          <Link to="/#portfolio" className="lux-nav-link" onClick={close}>Portfolio</Link>
          <Link to="/#contact" className="lux-nav-link" onClick={close}>Contact Us</Link>
          <div className="lux-nav-mobile-actions">
            <Link to="/login" className="lux-btn-outline" onClick={close}>Login</Link>
            <Link to="/register" className="lux-btn-gold" onClick={close}>Sign Up</Link>
          </div>
        </nav>

        <div className="lux-nav-actions">
          <Link to="/login" className="lux-btn-outline">Login</Link>
          <Link to="/register" className="lux-btn-gold">Sign Up</Link>
        </div>

        <button
          type="button"
          className="lux-nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;