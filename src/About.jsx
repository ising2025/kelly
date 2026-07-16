import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "@google/model-viewer";
import team from './assets/team.jpg';

import ishaniPhoto from './assets/ishani.png';
import kellyPhoto from './assets/kelly.jpg';
import willPhoto from './assets/will.jpeg';
import seanPhoto from './assets/sean.jpeg';
import sebastianPhoto from './assets/sebastian.JPEG';
import nickPhoto from './assets/nick.jpeg';
import henriPhoto from './assets/henri.jpeg';
import kingstenPhoto from './assets/Kingsten.jpeg';

const teamMembers = [
  { name: "Henri", photo: henriPhoto, bio: "I’m an alum of VEX Team 3723 and I’m looking forward to seeing what WWSD has in store for us! I’m a mechE major and an aviation enthusiast, also involved in Yale Jet Aeronautics." },
  { name: "Ishani", photo: ishaniPhoto, bio: "I’m a CS + linguistics major, and I loved being a part of robotics when I was younger. Super excited for what WWSD has in store!" },
  { name: "Sebastian", photo: sebastianPhoto, photoPosition: "center 20%", bio: "I’m a MechE major, and I’ve been excited about robotics ever since my time on FRC Team 9038. I spent high school telling people FRC wasn’t BattleBots, but then I started watching NHRL in 2024, and now here we are!" },
  { name: "Kelly", photo: kellyPhoto, photoPosition: "center 35%", bio: "I’m an alum of FRC Team 3504 GoS, excited to be on WWSD! I’m interested in pure math + CS + robotics and a big fan of tomato and egg noodles." },
  { name: "Kingsten", photo: kingstenPhoto, bio: "I’m an applied math major who watched way too much BattleBots. I also captained FTC Team 10237 previously." },
  { name: "Nick", photo: nickPhoto, bio: "I’m an EE major who is interested in aerospace and robotics! Previously I led FRC Team 7407 and I’m involved in rocketry (my hobby) and FSAE." },
  { name: "Sean", photo: seanPhoto, bio: "I’m a CS major new to robotics. I have interests in AI, and I’m excited to see how WWSD brings them together!" },
  { name: "Will", photo: willPhoto, bio: "I’m a MechE major interested in aerospace! I have experience in mid-powered rocketry and am currently project lead for Yale Jet Aeronautics. I am also a volunteer firefighter!" },
  { name: "Caeli", photo: null, bio: "" },
];

const competitions = [
  {
    date: "October 2026",
    name: "October 2026 NHRL Open",
    blurb: "Lil Bro's Debut Event",
    mediaAnchor: "october-2026",
  },
  // { //placeholder examples
  //   date: "January 2026",
  //   name: "Placeholder Event Name",
  //   blurb: "Description",
  //   mediaAnchor: "january-2026",
  // },
  // {
  //   date: "March 2026",
  //   name: "Placeholder Event Name",
  //   blurb: "Description",
  //   mediaAnchor: "march-2026",
  // },
];

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

export default function About() {
  return (
    <div style={{ background: "#0F1108", minHeight: "100vh", overflowX: "hidden", fontFamily: "'Inter', sans-serif", color: "#E1E1E1" }}>
      <Scanlines />

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 4vw 4rem", textAlign: "center", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem", opacity: 0.6 }}>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#E1E1E1" }}>
            WWSD
          </span>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
        </div>
        <GlitchText
          text="About Us"
          as="h1"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#E1E1E1",
            margin: 0,
            textTransform: "uppercase",
          }}
        />
      </section>

      {/* ── WHO ARE WE + OUR MEMBERS ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 4vw 6rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", marginBottom: "4rem" }}>
          <div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1.25rem" }}>
              The Team
            </span>
            <GlitchText
              text="Who are We?"
              as="h2"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                color: "#E1E1E1",
                margin: "0 0 1.5rem",
                lineHeight: 1.1,
              }}
            />
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(225,225,225,0.55)", margin: 0 }}>
              We're a group of Yale students building combat robots to compete in NHRL.
              Many of us come from robotics backgrounds, with prior experience in FRC, FTC, and VEX.
            </p>
          </div>

          <div style={{ aspectRatio: "4/3", border: "1px solid rgba(233,49,114,0.2)", position: "relative", overflow: "hidden" }}>
            {["top:0;left:0", "top:0;right:0", "bottom:0;left:0", "bottom:0;right:0"].map((pos, i) => (
              <div key={i} style={{
                position: "absolute",
                ...(Object.fromEntries(pos.split(";").map((p) => p.split(":")))),
                width: 20, height: 20,
                borderTop: i < 2 ? "1px solid #E93172" : "none",
                borderBottom: i >= 2 ? "1px solid #E93172" : "none",
                borderLeft: i % 2 === 0 ? "1px solid #E93172" : "none",
                borderRight: i % 2 === 1 ? "1px solid #E93172" : "none",
              }} />
            ))}
            <img src={ team } alt="Our team" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        <GlitchText
          text="Our Members"
          as="h2"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 700,
            color: "#E1E1E1",
            margin: "0 0 2.5rem",
            lineHeight: 1.1,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          {teamMembers.map((member, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ aspectRatio: "1/1", border: "1px solid rgba(233,49,114,0.2)", position: "relative", overflow: "hidden", background: "rgba(15,17,8,0.8)" }}>
                {["top:0;left:0", "top:0;right:0", "bottom:0;left:0", "bottom:0;right:0"].map((pos, j) => (
                  <div key={j} style={{
                    position: "absolute",
                    ...(Object.fromEntries(pos.split(";").map((p) => p.split(":")))),
                    width: 12, height: 12,
                    borderTop: j < 2 ? "1px solid #E93172" : "none",
                    borderBottom: j >= 2 ? "1px solid #E93172" : "none",
                    borderLeft: j % 2 === 0 ? "1px solid #E93172" : "none",
                    borderRight: j % 2 === 1 ? "1px solid #E93172" : "none",
                  }} />
                ))}
                {member.photo ? (
                  <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: member.photoPosition || "center", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(225,225,225,0.15)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Photo
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#E1E1E1", marginBottom: "0.6rem" }}>
                  {member.name}
                </div>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(225,225,225,0.5)", margin: 0 }}>
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPETITION HISTORY ──────────────────────────────────────────── */}
      <section id="competition-history" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "6rem 4vw", background: "rgba(233,49,114,0.03)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "3rem", textAlign: "center" }}>
            Competition History
          </span>

          <ol style={{ position: "relative", marginLeft: "6rem", borderLeft: "1px solid rgba(233,49,114,0.3)", listStyle: "none", padding: 0, maxWidth: 480, margin: "0 auto" }}>
            {competitions.map((comp) => (
              <li key={comp.mediaAnchor} style={{ marginBottom: "2.5rem", marginLeft: "1.75rem", position: "relative" }}>
                <span style={{ position: "absolute", left: "calc(-1.75rem - 5px)", top: "0.35rem", width: 11, height: 11, borderRadius: "50%", background: "#E93172", boxShadow: "0 0 8px rgba(233,49,114,0.6)", display: "block" }} />
                <time style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(225,225,225,0.35)", textTransform: "uppercase", display: "block", marginBottom: "0.35rem" }}>
                  {comp.date}
                </time>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#E1E1E1", marginBottom: "0.3rem" }}>
                  {comp.name}
                </div>
                <p style={{ fontSize: "0.9rem", color: "rgba(225,225,225,0.55)", margin: "0 0 0.6rem", lineHeight: 1.6 }}>
                  {comp.blurb}
                </p>
                <Link to={`/media#${comp.mediaAnchor}`} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em", color: "#E93172", fontWeight: 700, textDecoration: "none" }}>
                  Photos/Videos →
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── OUR ROBOT ───────────────────────────────────────────────────── */}
      <section id="our-robot" style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem 4vw 8rem" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1.25rem", textAlign: "center" }}>
          Our Robot
        </span>
        <GlitchText
          text="Lil Bro"
          as="h2"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 700,
            color: "#E1E1E1",
            margin: "0 0 0.75rem",
            lineHeight: 1.1,
            display: "block",
            textAlign: "center",
          }}
        />
        <p style={{ fontSize: "0.9rem", color: "rgba(225,225,225,0.4)", textAlign: "center", marginBottom: "2.5rem", letterSpacing: "0.05em" }}>
          Drag to rotate · Scroll to zoom · Right-click to pan
        </p>

        <div style={{ border: "1px solid rgba(233,49,114,0.2)", position: "relative" }}>
          {["top:0;left:0", "top:0;right:0", "bottom:0;left:0", "bottom:0;right:0"].map((pos, i) => (
            <div key={i} style={{
              position: "absolute",
              ...(Object.fromEntries(pos.split(";").map((p) => p.split(":")))),
              width: 20, height: 20, zIndex: 1,
              borderTop: i < 2 ? "1px solid #E93172" : "none",
              borderBottom: i >= 2 ? "1px solid #E93172" : "none",
              borderLeft: i % 2 === 0 ? "1px solid #E93172" : "none",
              borderRight: i % 2 === 1 ? "1px solid #E93172" : "none",
            }} />
          ))}
          <model-viewer
            src= {`${import.meta.env.BASE_URL}robot.glb`} //use npx @gltf-transform/cli optimize public/robot.gltf public/robot.glb --compress draco to convert gltf to glb
            alt="Interactive 3D model of our robot"
            camera-controls
            poster="/robot-poster.png"
            style={{ width: "100%", height: "500px", backgroundColor: "#0F1108" }}
          />
        </div>
      </section>
      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem 4vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#E93172",
          }}
        >
          Lil Bro
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "rgba(225,225,225,0.25)",
            textTransform: "uppercase",
          }}
        >
          © WWSD
        </span>
      </footer>
    </div>
  );
}
