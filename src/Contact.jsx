import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
    `}</style>
  );
}

function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8,
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      animation: "scanMove 8s linear infinite",
    }}>
      <style>{`@keyframes scanMove { 0% { background-position: 0 0; } 100% { background-position: 0 100vh; } }`}</style>
    </div>
  );
}

function GlitchText({ text, as: Tag = "h1", style = {} }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const pulse = () => { setGlitching(true); setTimeout(() => setGlitching(false), 300); };
    pulse();
    const id = setInterval(pulse, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <style>{`
        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap::before, .glitch-wrap::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; }
        .glitch-wrap.active::before { animation: glitch-clip1 0.3s steps(2) forwards; color: #E93172; clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); transform: translateX(-4px); opacity: 1; }
        .glitch-wrap.active::after  { animation: glitch-clip2 0.3s steps(2) forwards; color: #B61A66; clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); transform: translateX(4px);  opacity: 1; }
        @keyframes glitch-clip1 { 0% { transform: translateX(-4px); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); } 50% { transform: translateX(4px); clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); } 100% { transform: translateX(0); opacity: 0; } }
        @keyframes glitch-clip2 { 0% { transform: translateX(4px); clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); } 50% { transform: translateX(-4px); clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%); } 100% { transform: translateX(0); opacity: 0; } }
      `}</style>
      <Tag className={`glitch-wrap${glitching ? " active" : ""}`} data-text={text} style={style}>{text}</Tag>
    </>
  );
}

export default function Contact() {
  return (
    <div style={{ background: "#0F1108", minHeight: "100vh", overflowX: "hidden", fontFamily: "'Inter', sans-serif", color: "#E1E1E1" }}>
      <FontLoader />
      <Scanlines />

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 4vw 4rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem", opacity: 0.6 }}>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#E1E1E1" }}>
            Yale Battlebots
          </span>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
        </div>
        <GlitchText
          text="Contact Us"
          as="h1"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#E1E1E1",
            margin: 0,
            textTransform: "uppercase",
          }}
        />
        <p style={{ fontSize: "0.95rem", color: "rgba(225,225,225,0.45)", marginTop: "1.25rem", letterSpacing: "0.05em" }}>
          We'd love to hear from you! Reach out through any of the channels below.
        </p>
      </section>

      {/* ── CONTACT SECTIONS ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 4vw 8rem", display: "flex", flexDirection: "column", gap: "0" }}>

        {/* Social Media */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem 0" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1rem" }}>
            Social Media
          </span>
          <a
            href="https://instagram.com/OUR_HANDLE"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.85rem 2.4rem", border: "1px solid rgba(225,225,225,0.3)", borderRadius: 0, color: "#E1E1E1", textDecoration: "none", display: "inline-block" }}
          >
            Instagram
          </a>
        </section>

        {/* Other Questions */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem 0" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1rem" }}>
            Other Questions
          </span>
          <p style={{ fontSize: "0.95rem", color: "rgba(225,225,225,0.55)", lineHeight: 1.8, margin: "0 0 1rem" }}>
            Want to apply to join the team, or have other general questions? Send us an email and we'll get back to you.
          </p>
          <a
            href="mailto:havenroboticsgroup@gmail.com"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 600, letterSpacing: "0.1em", color: "#E93172", textDecoration: "none", textTransform: "uppercase" }}
          >
            havenroboticsgroup@gmail.com →
          </a>
        </section>

        {/* Support */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem 0" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1rem" }}>
            Support
          </span>
          <p style={{ fontSize: "0.95rem", color: "rgba(225,225,225,0.55)", lineHeight: 1.8, margin: "0 0 1.25rem" }}>
            Looking to support or donate to our team?
          </p>
          <Link
            to="/support"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.85rem 2.4rem", border: "none", borderRadius: 0, cursor: "pointer", background: "#E93172", color: "#fff", textDecoration: "none", display: "inline-block" }}
          >
            Visit our Support page
          </Link>
        </section>

      </div>
    </div>
  );
}
