import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const tracks = [
 ["01","Ethical Hacking Foundation","Linux, networking, reconnaissance, web fundamentals and responsible testing workflows."],
 ["02","Web Application Security","HTTP, authentication, sessions, OWASP concepts, security headers and authorized WAPT labs."],
 ["03","OSINT & Attack Surface","Domain intelligence, DNS, certificates, public-source research and exposure mapping."],
 ["04","Defensive Security","Hardening, access control, logging, phishing awareness and incident-ready habits."]
];
const modules = ["Cybersecurity foundations","Linux & command-line workflow","Networking & protocols","Reconnaissance methodology","HTTP / HTTPS & browser security","OWASP web security concepts","Authentication & session security","Security headers & TLS","OSINT collection & validation","Attack-surface mapping","Reporting & remediation","Responsible testing & ethics"];

export default function Academy(){ return <section className="academy-page">
 <Seo title="KAVACH Academy" description="KAVACH Academy — practical ethical hacking, web security, OSINT and defensive cybersecurity learning." path="/academy"/>
 <div className="academy-hero page-pad">
  <div className="academy-hero-copy"><span className="section-no">10 / KAVACH ACADEMY</span><h1>Learn the<br/><em>security surface.</em></h1><p>Practical cybersecurity education built around concepts, labs, documentation and responsible security practice.</p><div className="hero-actions"><Link className="btn btn-dark" to="/contact">Ask about Academy ↗</Link><Link className="text-link" to="/internship">View Internship →</Link></div></div>
  <div className="academy-visual"><img src="/assets/academy-hero.jpg" alt="Tirtal cybersecurity academy artwork"/><div className="visual-tag">TIRTAL / LEARNING NODE</div><img className="line-art" src="/graphics/academy-grid.svg" alt=""/></div>
 </div>
 <div className="academy-ribbon"><span>BUILD KNOWLEDGE</span><b>→</b><span>PRACTICE RESPONSIBLY</span><b>→</b><span>DOCUMENT CLEARLY</span><b>→</b><span>SECURE BETTER</span></div>
 <div className="page-pad section"><div className="section-head compact"><span className="section-no">11 / LEARNING TRACKS</span><h2>From first packet<br/><em>to real practice.</em></h2></div><div className="academy-track-grid">{tracks.map(([n,t,d])=><article className="academy-track" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><Link to="/contact">Explore track ↗</Link></article>)}</div></div>
 <section className="academy-dark"><div className="page-pad academy-dark-grid"><div><span className="section-no">12 / COURSE MAP</span><h2>One path.<br/><em>Many layers.</em></h2><p>Designed for students and early-career learners who want a structured route through cybersecurity rather than a list of disconnected tools.</p></div><div className="module-list">{modules.map((m,i)=><div key={m}><span>{String(i+1).padStart(2,"0")}</span><strong>{m}</strong><i>↗</i></div>)}</div></div></section>
 <div className="page-pad section academy-lab"><div className="lab-visual"><img src="/graphics/security-orbit.svg" alt="Security orbit diagram"/><span>LAB / 001</span></div><div><span className="section-no">13 / PRACTICAL LAB MINDSET</span><h2>Understand the signal<br/><em>before the tool.</em></h2><p>Every technical exercise should answer a question: what was observed, why it matters, how it was verified and how it can be improved.</p><div className="quote-line">AUTHORIZED · CONTROLLED · DOCUMENTED</div></div></div>
 <div className="page-pad academy-cta"><span className="section-no">14 / NEXT STEP</span><h2>Turn curiosity into<br/><em>security skill.</em></h2><Link className="btn btn-dark" to="/internship">Explore KAVACH Internship ↗</Link></div>
 </section> }
