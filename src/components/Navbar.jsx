import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/solutions", "Solutions"],
  ["/pricing", "Pricing"],
  ["/academy", "Academy"],
  ["/internship", "Internship"],
  ["/launch-checklist", "Launch checklist"],
  ["/faq", "FAQ"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const navRef = useRef(null);
  const activeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data?.session || null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession || null);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const positionPill = (element) => {
    if (!element || !navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    setPill({ left: rect.left - navRect.left, width: rect.width, visible: true });
  };

  useLayoutEffect(() => {
    const active = navRef.current?.querySelector(".nav-link.active");
    activeRef.current = active || null;
    if (active) positionPill(active);
    else setPill((previous) => ({ ...previous, visible: false }));
  }, [location.pathname]);

  useEffect(() => {
    const reposition = () => positionPill(activeRef.current);
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("/")} aria-label="KAVACH home">
        <span className="brand-mark"><img src="/assets/kavach-logo.png" alt="" /></span>
        <span className="brand-word">KAVACH<span className="brand-dot">.</span></span>
      </button>

      <nav
        ref={navRef}
        className="desktop-nav nav-glass-pill"
        aria-label="Main navigation"
        onMouseLeave={() => positionPill(activeRef.current)}
      >
        <span
          className={`nav-follow-pill ${pill.visible ? "is-visible" : ""}`}
          style={{ transform: `translateX(${pill.left}px)`, width: `${pill.width}px` }}
          aria-hidden="true"
        />
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onMouseEnter={(event) => positionPill(event.currentTarget)}
            onFocus={(event) => positionPill(event.currentTarget)}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <NavLink className="nav-login" to={session ? "/account" : "/login"}>
          <span className="login-dot" />{session ? "Account" : "Login"}
        </NavLink>
        <NavLink className="nav-cta" to="/request">Secure Now <span>↗</span></NavLink>
      </div>

      <button
        className={`mobile-menu-btn ${open ? "open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <nav className={`mobile-nav ${open ? "show" : ""}`} aria-label="Mobile navigation">
        {links.map(([to, label]) => (
          <button
            key={to}
            className={`mobile-nav-link ${location.pathname === to ? "active" : ""}`}
            onClick={() => go(to)}
          >
            {label}<span>↗</span>
          </button>
        ))}
        <button className="mobile-nav-link mobile-login-link" onClick={() => go(session ? "/account" : "/login")}>
          {session ? "My account" : "Login / Sign up"}<span>↗</span>
        </button>
        <button className="mobile-nav-cta" onClick={() => go("/request")}>Start a Request <span>↗</span></button>
      </nav>
    </header>
  );
}
