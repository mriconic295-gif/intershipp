import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const sections = [
  {
    id: "01", title: "Prerequisites", subtitle: "Get the foundations right before launch.",
    cards: [
      { title: "Domain & DNS", items: ["Own the domain and verify registrar access", "Check DNS records and remove obsolete entries", "Enable HTTPS and redirect HTTP to HTTPS"] },
      { title: "Hosting & deployment", items: ["Confirm production build succeeds", "Keep secrets out of source control", "Verify rollback and deployment access"] },
      { title: "Security baseline", items: ["Update dependencies and remove unused packages", "Set least-privilege account permissions", "Enable backups and test recovery"] },
      { title: "Content & ownership", items: ["Review copy, links and contact information", "Confirm privacy and service terms are appropriate", "Assign an owner for post-launch monitoring"] },
    ],
  },
  {
    id: "02", title: "The launch checklist", subtitle: "A practical final pass across the whole website.",
    items: [
      ["Performance", "Compress images, remove unused assets and test mobile loading."],
      ["Responsive layout", "Check navigation, buttons, forms and spacing on phone, tablet and desktop."],
      ["Accessibility", "Use readable contrast, keyboard focus, labels and meaningful image alt text."],
      ["Navigation", "Test every route, internal link, footer link and fallback page."],
      ["Forms", "Validate required fields, errors, success states and spam protection."],
      ["Authentication", "Test sign up, login, logout, password reset and protected routes."],
      ["Database", "Verify Supabase policies, table permissions and safe error handling."],
      ["SEO basics", "Check page titles, descriptions, canonical URLs and sitemap."],
      ["Analytics", "Confirm only the analytics you need are enabled and configured correctly."],
      ["Browser checks", "Test current Chrome, Firefox, Safari and mobile browsers where available."],
      ["Security headers", "Review CSP, HSTS, frame restrictions and content-type protections."],
      ["Final smoke test", "Run the production build and test the deployed site from a clean session."],
    ],
  },
  {
    id: "A", title: "Get found on Google", subtitle: "Help search engines understand and discover your pages.",
    description: "Make important pages crawlable, descriptive and consistent. Search visibility takes time; indexing or ranking is never guaranteed.",
    items: ["Write a unique title and meta description for every important route", "Use one clear H1 and logical heading hierarchy", "Publish a valid sitemap.xml and reference it in robots.txt", "Set the canonical URL to the preferred production domain", "Verify the domain in Google Search Console", "Submit the sitemap and inspect key URLs", "Fix broken links, redirect chains and accidental noindex rules"],
    caution: "Do not add fake keywords, hidden text or misleading structured data. Search Console reports are not an instant ranking switch.",
  },
  {
    id: "B", title: "Share previews & images", subtitle: "Make links look polished when shared in messages and social feeds.",
    description: "Preview cards depend on the destination platform's crawler and cache. Use public, stable image URLs and test each share target.",
    items: ["Set Open Graph title, description and image metadata", "Add Twitter/X card metadata where relevant", "Use a sharp, correctly sized social preview image", "Add a useful favicon and web app icons", "Use descriptive alt text for meaningful images", "Check that image URLs work without authentication", "Re-test previews after changing metadata or image assets"],
    caution: "Never put private customer information, credentials or internal dashboards in public preview images.",
  },
  {
    id: "C", title: "Forms, tracking & privacy", subtitle: "Collect only what you need and explain what happens next.",
    description: "A trustworthy form clearly identifies its purpose, validates input and protects submitted information from unnecessary exposure.",
    items: ["Explain why each personal-data field is required", "Use server-side validation as well as client-side validation", "Protect public forms from spam and automated abuse", "Restrict database access with Supabase Row Level Security", "Never expose a service-role key in frontend code", "Avoid logging passwords, tokens or sensitive form contents", "Publish appropriate privacy and contact information", "Test consent and analytics behaviour where applicable"],
    caution: "A frontend-only validation check is not a security boundary. Enforce authorization in trusted server/database policies.",
  },
  {
    id: "D", title: "Trust", subtitle: "Make it easy for visitors to understand who they are dealing with.",
    description: "Clear ownership, honest claims and dependable contact paths help users judge whether a website is legitimate.",
    items: ["Show accurate company or project information", "Provide working contact routes and response expectations", "Use HTTPS and keep certificates valid", "Publish clear terms, privacy information and refund details if applicable", "Avoid fake reviews, invented certifications and unsupported guarantees", "Keep pricing and service scope understandable", "Make login and account recovery paths predictable"],
    caution: "Only display certifications, testimonials, security claims and compliance badges that you can verify.",
  },
  {
    id: "★", title: "Master prompt + after launch", subtitle: "A repeatable hand-off for ongoing improvements.",
    description: "Keep a small release record so fixes, ownership and follow-up checks do not disappear after launch.",
    items: ["Record the release date, version and key changes", "Monitor uptime, error reports and form delivery", "Review dependency and platform security advisories", "Confirm backups continue to run and restore tests work", "Review access to hosting, DNS, Supabase and source control", "Schedule a monthly broken-link and content review", "Prioritise findings by risk and document remediation"],
    caution: "This checklist is a practical starting point, not a guarantee that a website is secure or compliant.",
  },
];

export default function LaunchChecklist() {
  const [checked, setChecked] = useState({});
  const allItems = useMemo(() => sections.flatMap((section) => [
    ...(section.cards || []).flatMap((card) => card.items.map((item) => `${section.id}:${item}`)),
    ...(section.items || []).map((item) => `${section.id}:${Array.isArray(item) ? item[0] : item}`),
  ]), []);
  const done = Object.values(checked).filter(Boolean).length;
  const toggle = (key) => setChecked((current) => ({ ...current, [key]: !current[key] }));

  return (
    <section className="page-pad inner-page launch-page">
      <Seo title="Website Launch Checklist" description="A practical website launch checklist covering prerequisites, SEO, previews, forms, privacy and trust." path="/launch-checklist" />
      <div className="launch-hero glass-panel">
        <span className="section-no">KAVACH / WEB READINESS</span>
        <p className="launch-kicker">THE PRE-LAUNCH FIELD GUIDE</p>
        <h1>Don't launch your<br />website <em>without this list.</em></h1>
        <p className="launch-intro">A thoughtful final review for performance, security, search visibility, forms, privacy and trust. Use it before launch — and revisit it after updates.</p>
        <div className="launch-hero-bottom">
          <Link className="btn btn-dark launch-hero-cta" to="/request">Ask KAVACH for a website check <span>↗</span></Link>
          <div className="launch-progress"><div><span>YOUR CHECKLIST</span><strong>{done} / {allItems.length}</strong></div><div className="launch-progress-track"><span style={{ width: `${allItems.length ? (done / allItems.length) * 100 : 0}%` }} /></div></div>
        </div>
      </div>

      <div className="launch-legend glass-panel">
        <div><span className="legend-dot legend-red" /> Security & trust</div>
        <div><span className="legend-dot legend-blue" /> Performance & discovery</div>
        <button onClick={() => setChecked({})}>Reset checklist ↺</button>
      </div>

      {sections.map((section) => (
        <section className="launch-section" key={section.id}>
          <div className="launch-section-head">
            <span className="launch-section-number">{section.id}</span>
            <div><h2>{section.title}</h2><p>{section.subtitle}</p></div>
          </div>

          {section.cards && (
            <div className="launch-prereq-grid">
              {section.cards.map((card) => (
                <article className="launch-card glass-card" key={card.title}>
                  <h3>{card.title}</h3>
                  {card.items.map((item) => {
                    const key = `${section.id}:${item}`;
                    return <label className="launch-check-row" key={key}><input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} /><span>{item}</span></label>;
                  })}
                </article>
              ))}
            </div>
          )}

          {section.items && (
            <div className="launch-checklist glass-card">
              {section.items.map((entry, index) => {
                const title = Array.isArray(entry) ? entry[0] : entry;
                const description = Array.isArray(entry) ? entry[1] : "";
                const key = `${section.id}:${title}`;
                return <label className="launch-check-row launch-long-check" key={key}>
                  <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} />
                  <span className="launch-item-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="launch-check-copy"><strong>{title}</strong>{description && <small>{description}</small>}</span>
                </label>;
              })}
            </div>
          )}

          {section.description && <p className="launch-section-description">{section.description}</p>}
          {section.caution && <aside className="launch-caution"><span>!</span><p>{section.caution}</p></aside>}
        </section>
      ))}

      <div className="launch-finish glass-panel">
        <span className="section-no">READY FOR THE NEXT STEP?</span>
        <h2>Launch with clarity.<br /><em>Keep improving.</em></h2>
        <p>Use this checklist as a repeatable process, not a one-time promise of perfect security.</p>
        <Link className="btn btn-dark" to="/request">Request a KAVACH assessment ↗</Link>
      </div>
    </section>
  );
}
