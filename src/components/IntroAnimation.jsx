
import React, { useEffect, useState } from "react";

const WaveText = ({ text, className = "", delay = 0 }) => (
  <span className={`kc-wave ${className}`} aria-label={text}>
    {Array.from(text).map((char, index) => (
      <span
        aria-hidden="true"
        key={`${char}-${index}`}
        className="kc-letter"
        style={{ "--i": index, "--delay": `${delay}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </span>
);

export default function IntroAnimation() {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 500),
      window.setTimeout(() => setStage(2), 1450),
      window.setTimeout(() => setStage(3), 2300),
      window.setTimeout(() => setStage(4), 3300),
      window.setTimeout(() => setVisible(false), 7800),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="kc-intro">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@500;600;700;800;900&display=swap');

        .kc-intro {
          --lavender: #c4b5fd;
          --purple: #9b72ff;
          --pink: #f0abfc;
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 24px;
          background:
            radial-gradient(ellipse at 50% 39%, #49207835, transparent 36%),
            radial-gradient(ellipse at 50% 100%, #1b0c2e 0%, transparent 54%),
            #08070d;
          color: #faf8ff;
          font-family: Inter, sans-serif;
          text-align: center;
          animation: kcFade .7s ease both;
          isolation: isolate;
        }

        .kc-intro * { box-sizing: border-box; }

        .kc-noise {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: .13;
          background-image: radial-gradient(#d9c9ff 0.7px, transparent .8px);
          background-size: 5px 5px;
          mask-image: linear-gradient(transparent, black 20%, black 80%, transparent);
        }

        .kc-aura {
          position: absolute;
          width: min(460px, 100vw);
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, #a855f71c, #7c3aed0a 48%, transparent 70%);
          filter: blur(9px);
          animation: kcAura 4s ease-in-out infinite;
          pointer-events: none;
        }

        .kc-rings {
          position: absolute;
          width: 225px;
          height: 225px;
          border: 1px solid #bca0ff40;
          border-radius: 50%;
          box-shadow: 0 0 50px #a855f712, inset 0 0 35px #a855f70b;
          animation: kcSpin 13s linear infinite;
          pointer-events: none;
        }

        .kc-rings::before {
          content: "";
          position: absolute;
          inset: 13px;
          border: 1px dashed #c4b5fd4a;
          border-radius: 50%;
        }

        .kc-rings::after {
          content: "";
          position: absolute;
          inset: -12px;
          border: 1px solid #f0abfc40;
          border-top-color: #f0abfc;
          border-bottom-color: transparent;
          border-radius: 50%;
          animation: kcSpin 5s linear infinite reverse;
        }

        .kc-orbit {
          position: absolute;
          width: 270px;
          height: 100px;
          border: 1px solid #c4b5fd38;
          border-radius: 50%;
          transform: rotate(-32deg);
          animation: kcOrbit 5s ease-in-out infinite;
          pointer-events: none;
        }

        .kc-orbit-two {
          position: absolute;
          width: 270px;
          height: 100px;
          border: 1px solid #e879f930;
          border-radius: 50%;
          transform: rotate(32deg);
          animation: kcOrbit 5s ease-in-out infinite reverse;
          pointer-events: none;
        }

        .kc-core {
          position: relative;
          z-index: 2;
          width: 112px;
          height: 112px;
          display: grid;
          place-items: center;
          border: 1px solid #e9d5ff80;
          border-radius: 31px;
          background: linear-gradient(145deg, #ffffff13, #a855f71c, #ffffff04);
          box-shadow: 0 0 45px #a855f72b, inset 0 1px #ffffff20;
          backdrop-filter: blur(12px);
          opacity: 0;
          transform: rotate(45deg) scale(.65);
          transition: opacity .9s, transform 1s cubic-bezier(.2,.8,.2,1);
        }

        .kc-core.show {
          opacity: 1;
          transform: rotate(45deg) scale(1);
        }

        .kc-core svg {
          width: 70px;
          height: 76px;
          transform: rotate(-45deg);
          filter: drop-shadow(0 0 10px #c4b5fd70);
        }

        .kc-shield {
          fill: #c4b5fd0e;
          stroke: #e9ddff;
          stroke-width: 1.5;
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
        }

        .kc-core.show .kc-shield {
          animation: kcDraw 1.5s .2s ease forwards;
        }

        .kc-check {
          fill: none;
          stroke: #f0abfc;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
        }

        .kc-core.show .kc-check {
          animation: kcDraw .7s 1.2s ease forwards;
        }

        .kc-brand {
          margin-top: 49px;
          position: relative;
          z-index: 3;
          font: 800 clamp(38px, 7vw, 62px)/1 Orbitron, sans-serif;
          letter-spacing: 9px;
          text-indent: 9px;
          color: #fbf9ff;
          opacity: 0;
          filter: blur(8px);
        }

        .kc-brand.show {
          animation: kcBrand .9s ease forwards;
        }

        .kc-brand span {
          background: linear-gradient(110deg, #c4b5fd, #f0abfc 55%, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 17px #c084fc55);
        }

        .kc-rule {
          width: 0;
          height: 1px;
          margin-top: 22px;
          background: linear-gradient(90deg, transparent, #a78bfa, #f0abfc, #a78bfa, transparent);
          box-shadow: 0 0 15px #c084fc55;
        }

        .kc-rule.show {
          animation: kcRule .9s ease forwards;
        }

        .kc-headline {
          max-width: 850px;
          margin-top: 24px;
          font-size: clamp(19px, 3.7vw, 36px);
          line-height: 1.45;
          font-weight: 800;
          letter-spacing: -.8px;
          opacity: 0;
          transform: translateY(12px);
        }

        .kc-headline.show {
          animation: kcAppear .7s ease forwards;
        }

        .kc-wave {
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        .kc-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(18px) rotateX(-70deg);
          animation: kcWave .55s calc(var(--delay) + var(--i) * 34ms) cubic-bezier(.2,.8,.2,1) forwards;
          background: linear-gradient(180deg, #ffffff, #d8ccff 60%, #b59bff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: none;
        }

        .kc-letter:nth-child(3n) {
          background-image: linear-gradient(180deg, #f5d0fe, #c084fc);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .kc-welcome {
          margin-top: 15px;
          font-size: clamp(13px, 2.4vw, 19px);
          font-weight: 900;
          letter-spacing: clamp(2px, .7vw, 5px);
          color: #e9ddff;
          opacity: 0;
          transform: translateY(12px);
        }

        .kc-welcome.show {
          animation: kcAppear .7s ease forwards;
        }

        .kc-welcome .kc-wave .kc-letter {
          background: linear-gradient(90deg, #c4b5fd, #f0abfc, #ffffff, #c4b5fd);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
        }

        .kc-skip {
          position: absolute;
          right: 24px;
          bottom: 22px;
          padding: 9px 14px;
          border: 1px solid #ffffff25;
          border-radius: 30px;
          color: #c9bfd8;
          background: #ffffff05;
          font: 11px Inter, sans-serif;
          cursor: pointer;
          transition: .2s ease;
        }

        .kc-skip:hover {
          color: white;
          border-color: #c4b5fd;
          background: #a78bfa12;
        }

        @keyframes kcFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes kcAura {
          50% { transform: scale(1.15); opacity: .65; }
        }

        @keyframes kcSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes kcOrbit {
          50% { opacity: .4; }
        }

        @keyframes kcDraw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes kcBrand {
          0% { opacity: 0; filter: blur(8px); transform: translateY(10px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }

        @keyframes kcAppear {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes kcRule {
          to { width: min(260px, 70vw); }
        }

        @keyframes kcWave {
          0% { opacity: 0; transform: translateY(18px) rotateX(-70deg); filter: blur(4px); }
          65% { opacity: 1; transform: translateY(-4px) rotateX(0); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) rotateX(0); filter: blur(0); }
        }

        @media (max-width: 520px) {
          .kc-rings { width: 185px; height: 185px; }
          .kc-orbit, .kc-orbit-two { width: 220px; height: 85px; }
          .kc-core { width: 94px; height: 94px; border-radius: 26px; }
          .kc-core svg { width: 60px; height: 65px; }
          .kc-brand { margin-top: 43px; letter-spacing: 5px; text-indent: 5px; }
          .kc-headline { letter-spacing: -.4px; }
          .kc-skip { right: 14px; bottom: 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .kc-intro *, .kc-intro *::before, .kc-intro *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="kc-noise" />
      <div className="kc-aura" />
      <div className="kc-rings" />
      <div className="kc-orbit" />
      <div className="kc-orbit-two" />

      <div className={`kc-core ${stage >= 1 ? "show" : ""}`}>
        <svg viewBox="0 0 100 110" fill="none" aria-hidden="true">
          <path
            className="kc-shield"
            d="M50 5 L89 20 L84 62 Q76 87 50 104 Q24 87 16 62 L11 20 Z"
          />
          <path className="kc-check" d="M31 54 L44 67 L70 40" />
        </svg>
      </div>

      <div className={`kc-brand ${stage >= 2 ? "show" : ""}`}>
        KAVA<span>CH</span>
      </div>

      <div className={`kc-rule ${stage >= 2 ? "show" : ""}`} />

      <div className={`kc-headline ${stage >= 3 ? "show" : ""}`}>
        <WaveText text="Every Challenge Has a Solution." delay={0.1} />
      </div>

      <div className={`kc-welcome ${stage >= 4 ? "show" : ""}`}>
        <WaveText text="WELCOME TO KAVACH" delay={0.2} />
      </div>

      <button className="kc-skip" onClick={() => setVisible(false)}>
        Skip intro →
      </button>
    </div>
  );
}
