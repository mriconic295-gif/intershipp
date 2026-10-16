import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top page-pad">
        <div>
          <span className="section-no">KAVACH / CYBERSECURITY</span>

          <h2>
            Small steps.
            <br />
            <em>Stronger tomorrow.</em>
          </h2>

          <p>
            Practical security, clear reporting and responsible learning.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </div>
        </div>

        <div className="footer-nav">
          <Link to="/services">Services</Link>
          <Link to="/launch-checklist">Website Launch Checklist</Link>
          <Link to="/academy">Academy</Link>
          <Link to="/internship">Internship</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="footer-bottom page-pad">
        <span>© {new Date().getFullYear()} KAVACH</span>

        <span>AUTHORIZED · RESPONSIBLE · CLEAR</span>

        <Link to="/admin">Admin ↗</Link>
      </div>
    </footer>
  );
}
