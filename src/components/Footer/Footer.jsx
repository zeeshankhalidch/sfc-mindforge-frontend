import { Link } from "react-router-dom";
import { Users, Shield, Smartphone, Heart } from "lucide-react";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="lux-footer" id="contact">
      <div className="lux-footer-features">
        <div className="lux-footer-feature">
          <Users size={20} />
          <span>Made for Students</span>
        </div>
        <div className="lux-footer-feature">
          <Shield size={20} />
          <span>Secure &amp; Reliable</span>
        </div>
        <div className="lux-footer-feature">
          <Smartphone size={20} />
          <span>Works on All Devices</span>
        </div>
        <div className="lux-footer-feature">
          <Heart size={20} />
          <span>Build a Smarter You</span>
        </div>
      </div>

      <div className="lux-footer-main">
        <div className="lux-footer-brand">
          <span className="lux-footer-logo">
            <span className="lux-brand-dot"></span>
            <span className="lux-footer-logo-text">CAMPUS COIN</span>
          </span>
          <p>Smart Spending, Student Style.</p>
        </div>

        <div className="lux-footer-links">
          <Link to="/">Home</Link>
          <Link to="/#about">About Us</Link>
          <Link to="/#portfolio">Portfolio</Link>
          <Link to="/#contact">Contact Us</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="lux-footer-bottom">
        <span>© {year} Campus Coin. All rights reserved.</span>
        <span>Built for students, by students.</span>
      </div>
    </footer>
  );
}

export default Footer;