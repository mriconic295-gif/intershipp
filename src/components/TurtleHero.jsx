import React from "react";

export default function TurtleHero() {
  return (
    <div className="turtle-stage">
      <div className="turtle-background" aria-hidden="true" />
      <div className="turtle-glow" />
      <img className="turtle-hero-image" src="/assets/kavach-turtle.png" alt="Tirtal, the KAVACH digital guardian" />
      <div className="turtle-overlay-label"><span>TIRTAL</span><small>DIGITAL GUARDIAN / 01</small></div>
      <div className="turtle-code">SECURE / DETECT / ASSESS / PROTECT</div>
    </div>
  );
}
