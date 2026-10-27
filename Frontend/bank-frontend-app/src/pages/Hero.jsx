import { Link, useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const handleContinue = () => {
    if (role === "ADMIN") navigate("/admin/dashboard");
    else if (role === "EMPLOYEE") navigate("/employee/transactions");
    else if (role === "CUSTOMER") navigate("/customer/portal");
    else navigate("/login");
  };

  return (
    <div className="hero-page">
      <div className="hero-grid-overlay" />
      <div className="hero-gradient-orb hero-orb-left" />
      <div className="hero-gradient-orb hero-orb-right" />

      <header className="hero-header">
        <div className="hero-logo">BankSystem</div>
        <Link to="/login" className="hero-login-link">
          Login
        </Link>
      </header>

      <main className="hero-content">
        <p className="hero-eyebrow">Secure. Fast. Trusted.</p>
        <h1 className="hero-title">Modern Banking For Everyday Life</h1>
        <p className="hero-subtitle">
          Open your dashboard in seconds, transfer funds confidently, and manage
          accounts with clarity from one clean workspace.
        </p>

        <div className="hero-cta-row">
          <Link to="/login" className="hero-btn hero-btn-primary">
            Login To Your Account
          </Link>
          <button type="button" className="hero-btn hero-btn-secondary" onClick={handleContinue}>
            Continue Session
          </button>
        </div>

        <section className="hero-stats" aria-label="Platform highlights">
          <article className="hero-stat-card">
            <span className="hero-stat-value">24/7</span>
            <span className="hero-stat-label">Digital Access</span>
          </article>
          <article className="hero-stat-card">
            <span className="hero-stat-value">256-bit</span>
            <span className="hero-stat-label">Secure Encryption</span>
          </article>
          <article className="hero-stat-card">
            <span className="hero-stat-value">1-click</span>
            <span className="hero-stat-label">Role Login</span>
          </article>
        </section>
      </main>
    </div>
  );
}
