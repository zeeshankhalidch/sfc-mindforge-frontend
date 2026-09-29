import { Link } from "react-router-dom";
import { Users, Shield, Smartphone, Heart, Mail, MapPin, Globe, Send, MessageCircle } from "lucide-react";
import logoImg from "../../assets/images/tech.png";
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
          <img src={logoImg} alt="Campus Coin" className="lux-footer-logo-img" />
          <p>Smart Spending, Student Style.</p>
          <p className="lux-footer-brand-desc">
            Campus Coin is a lightweight, student-first budgeting app that makes
            it effortless to log income, manage expenses, and build better money
            habits — without spreadsheets or bank logins.
          </p>
        </div>

        <div className="lux-footer-links">
          <Link to="/">Home</Link>
          <Link to="/#about">About Us</Link>
          <Link to="/#portfolio">Portfolio</Link>
          <Link to="/#contact">Contact Us</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="lux-footer-links">
          <Link to="/register">Sign Up</Link>
          <Link to="/forgot-password">Forgot Password</Link>
          <span className="lux-footer-muted">Student Dashboard</span>
          <span className="lux-footer-muted">Admin Panel</span>
        </div>

        <div className="lux-footer-contact">
          <a href="mailto:hello@campuscoin.app" className="lux-footer-contact-row">
            <Mail size={14} />
            hello@campuscoin.app
          </a>
          <span className="lux-footer-contact-row">
            <MapPin size={14} />
            Built for campuses worldwide
          </span>
          <div className="lux-footer-socials">
            <a href="#" aria-label="Website"><Globe size={16} /></a>
            <a href="#" aria-label="Newsletter"><Send size={16} /></a>
            <a href="#" aria-label="Support"><MessageCircle size={16} /></a>
          </div>
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