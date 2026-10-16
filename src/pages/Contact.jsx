import React from "react";
import RequestForm from "../components/RequestForm";
import Seo from "../components/Seo";

export default function Contact() {
  return (
    <section className="page-pad inner-page contact-page">
      <Seo title="Contact KAVACH" description="Contact KAVACH for cybersecurity service requests and authorized security engagements." path="/contact" />
      <div className="page-title">
        <span className="section-no">08 / CONTACT</span>
        <h1>Let's make<br /><em>security practical.</em></h1>
        <p>Tell KAVACH what you need help with. Share your organisation details and select the security service you are interested in.</p>
      </div>
      <div className="contact-layout">
        <RequestForm />
        <aside className="contact-card accent-lime">
          <span className="section-no">DIRECT COORDINATES</span>
          <h2>KAVACH<br />Bhavnagar, Gujarat</h2>
          <p>For security engagements, include enough information for us to understand the scope without sharing sensitive credentials or secrets.</p>
          <a href="mailto:hello@kavach.security">hello@kavach.security</a>
          <div className="contact-rule" />
          <small>AUTHORIZED TESTING ONLY · PRIVACY FIRST · CLEAR REPORTING</small>
        </aside>
      </div>
    </section>
  );
}
