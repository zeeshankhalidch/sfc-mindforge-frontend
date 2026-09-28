import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

function GoldCoin({ size = 40, style = {} }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={style}
      className="lux-coin-svg"
    >
      <defs>
        <radialGradient id="coinG" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#faf0b8" />
          <stop offset="45%" stopColor="#e6c65c" />
          <stop offset="80%" stopColor="#b8941f" />
          <stop offset="100%" stopColor="#7a5c00" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#coinG)" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#7a5c00" strokeWidth="1" opacity="0.35" />
      <ellipse cx="42" cy="32" rx="20" ry="12" fill="rgba(255,255,255,0.55)" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        fill="#5a4200"
        fontFamily="Georgia, serif"
      >
        ₹
      </text>
    </svg>
  );
}

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <>
      <Navbar />

      <main className="lux-main">
        <section className="lux-hero">
          <div className="lux-hero-bg">
            <div className="lux-wave lux-wave-left">
              <svg viewBox="0 0 500 700" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="waveL" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#faf0b8" />
                    <stop offset="50%" stopColor="#e6c65c" />
                    <stop offset="100%" stopColor="#b8941f" />
                  </linearGradient>
                </defs>
                <path
                  d="M-50 100 Q80 180 60 320 Q40 480 180 580 Q320 680 500 720 L-50 720 Z"
                  fill="url(#waveL)"
                />
              </svg>
            </div>

            <div className="lux-wave lux-wave-right">
              <svg viewBox="0 0 500 700" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="waveR" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#b8941f" />
                    <stop offset="50%" stopColor="#e6c65c" />
                    <stop offset="100%" stopColor="#faf0b8" />
                  </linearGradient>
                </defs>
                <path
                  d="M550 100 Q420 180 440 320 Q460 480 320 580 Q180 680 0 720 L550 720 Z"
                  fill="url(#waveR)"
                />
              </svg>
            </div>

            <div className="lux-coin lux-coin-1"><GoldCoin size={64} /></div>
            <div className="lux-coin lux-coin-2"><GoldCoin size={36} /></div>
            <div className="lux-coin lux-coin-3"><GoldCoin size={48} /></div>
            <div className="lux-coin lux-coin-4"><GoldCoin size={28} /></div>
            <div className="lux-coin lux-coin-5"><GoldCoin size={52} /></div>
            <div className="lux-coin lux-coin-6"><GoldCoin size={40} /></div>
          </div>

          <div className="lux-hero-inner">
            <h1 className="lux-hero-title">
              SMART SPENDING
              <br />
              STUDENT STYLE
            </h1>

            <p className="lux-hero-text">
              Campus Coin helps students track income, manage expenses, set
              budgets, get personalized saving tips and achieve their
              financial goals — all in one place.
            </p>

            <Link to="/register" className="lux-hero-cta">
              VISIT US
            </Link>
          </div>
        </section>

        <section className="lux-features" id="about">
          <div className="lux-container">
            <span className="lux-section-label">WHY CAMPUS COIN</span>
            <h2 className="lux-section-heading">
              Everything you need to manage your money.
            </h2>

            <div className="lux-features-grid">
              <div className="lux-feature">
                <span className="lux-feature-number">01</span>
                <h3>Track Expenses</h3>
                <p>Log income and expenses in seconds with student-friendly categories.</p>
              </div>
              <div className="lux-feature">
                <span className="lux-feature-number">02</span>
                <h3>Set Budgets</h3>
                <p>Create monthly limits per category and get alerts before you overspend.</p>
              </div>
              <div className="lux-feature">
                <span className="lux-feature-number">03</span>
                <h3>Saving Tips</h3>
                <p>Personalized advice based on your own spending patterns and goals.</p>
              </div>
              <div className="lux-feature">
                <span className="lux-feature-number">04</span>
                <h3>Visual Reports</h3>
                <p>Clear charts that show exactly where your money goes each month.</p>
              </div>
              <div className="lux-feature">
                <span className="lux-feature-number">05</span>
                <h3>AI Assistant</h3>
                <p>Auto-categorize expenses and get monthly insights in plain language.</p>
              </div>
              <div className="lux-feature">
                <span className="lux-feature-number">06</span>
                <h3>Secure &amp; Private</h3>
                <p>Bank-level security. No bank linking. Your data stays yours.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="lux-portfolio" id="portfolio">
          <div className="lux-container">
            <span className="lux-section-label">EXPLORE</span>
            <h2 className="lux-section-heading">
              Everything inside Campus Coin.
            </h2>

            <div className="lux-portfolio-grid">
              <Link to="/register" className="lux-portfolio-item">
                <span className="lux-portfolio-number">01</span>
                <h4>Account</h4>
                <p>Login · Register · Password Recovery</p>
              </Link>
              <Link to="/dashboard" className="lux-portfolio-item">
                <span className="lux-portfolio-number">02</span>
                <h4>Dashboard</h4>
                <p>Balance · Budgets · Saving Tips</p>
              </Link>
              <Link to="/transactions" className="lux-portfolio-item">
                <span className="lux-portfolio-number">03</span>
                <h4>Transactions</h4>
                <p>Income · Expenses · Categories</p>
              </Link>
              <Link to="/reports" className="lux-portfolio-item">
                <span className="lux-portfolio-number">04</span>
                <h4>Reports &amp; Insights</h4>
                <p>Reports · Trends · AI Insights</p>
              </Link>
              <Link to="/budgets" className="lux-portfolio-item">
                <span className="lux-portfolio-number">05</span>
                <h4>Budgets</h4>
                <p>Limits · Progress · Alerts</p>
              </Link>
              <Link to="/profile" className="lux-portfolio-item">
                <span className="lux-portfolio-number">06</span>
                <h4>Profile &amp; Settings</h4>
                <p>Profile · Preferences · Accessibility</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="lux-cta">
          <div className="lux-cta-inner">
            <h2 className="lux-cta-heading">
              Ready to take control?
            </h2>
            <p className="lux-cta-text">
              Join thousands of students building better money habits with Campus Coin.
            </p>
            <div className="lux-cta-buttons">
              <Link to="/register" className="lux-cta-primary">
                GET STARTED
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="lux-cta-secondary">
                LOGIN
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;