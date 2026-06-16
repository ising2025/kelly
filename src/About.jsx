import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "@google/model-viewer";

const competitions = [
  {
    date: "November 2025",
    name: "Placeholder",
    blurb: "Description",
    mediaAnchor: "media-element-id",
  },
  {
    date: "January 2026",
    name: "Placeholder Event Name",
    blurb: "Description",
    mediaAnchor: "media-element-id",
  },
  {
    date: "March 2026",
    name: "Placeholder Event Name",
    blurb: "Description",
    mediaAnchor: "media-element-id",
  },
];

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

function SparkCanvas() {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const rafRef = useRef(null);

  const createSpark = useCallback((x, y, burst = false) => {
    const count = burst ? 28 : 2;
    const biasDeg = burst ? -(Math.PI / 2) + (Math.random() - 0.5) * 0.8 : Math.random() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      const spread = burst ? (Math.random() - 0.5) * 2.4 : (Math.random() - 0.5) * Math.PI * 2;
      const angle = burst ? biasDeg + spread : spread;
      const speed = burst ? 5 + Math.random() * 11 : 3 + Math.random() * 6;
      const r = Math.random();
      const color = r > 0.75 ? "#E93172" : r > 0.45 ? "#fff" : "#ffd080";
      sparksRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.055 + Math.random() * 0.09,
        size: 0.5 + Math.random() * 0.9,
        color, trail: [],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let lastBurst = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const now = Date.now();
      if (now - lastBurst > 120) { createSpark(e.clientX, e.clientY); lastBurst = now; }
    };
    const onClick = (e) => createSpark(e.clientX, e.clientY, true);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    const ambientInterval = setInterval(() => {
      createSpark(Math.random() * canvas.width, canvas.height * 0.5 + Math.random() * canvas.height * 0.4, Math.random() > 0.6);
    }, 250);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => s.life > 0);
      sparksRef.current.forEach((s) => {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 3) s.trail.shift();
        if (s.trail.length >= 2) {
          const tail = s.trail[0];
          const head = s.trail[s.trail.length - 1];
          ctx.beginPath(); ctx.moveTo(tail.x, tail.y); ctx.lineTo(head.x, head.y);
          const alpha = s.life;
          if (s.color === "#E93172") { ctx.strokeStyle = `rgba(233,49,114,${alpha})`; ctx.shadowColor = "#E93172"; }
          else if (s.color === "#ffd080") { ctx.strokeStyle = `rgba(255,208,128,${alpha * 0.9})`; ctx.shadowColor = "#ffcc66"; }
          else { ctx.strokeStyle = `rgba(255,255,255,${alpha})`; ctx.shadowColor = "#ffffff"; }
          ctx.lineWidth = s.size; ctx.lineCap = "round"; ctx.shadowBlur = 4; ctx.stroke(); ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`; ctx.shadowColor = s.color === "#E93172" ? "#E93172" : "#fff";
          ctx.shadowBlur = 5; ctx.fill(); ctx.shadowBlur = 0;
        }
        s.x += s.vx; s.y += s.vy; s.vy += 0.35; s.vx *= 0.97; s.life -= s.decay;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(ambientInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, [createSpark]);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 10 }} />;
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
      <FontLoader />
      <Scanlines />

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 4vw 4rem", textAlign: "center", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem", opacity: 0.6 }}>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#E1E1E1" }}>
            Yale Battlebots... or whatever we want here
          </span>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
        </div>
        <GlitchText
          text="About Us"
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
      </section>

      {/* ── WHO ARE WE ──────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1100, margin: "0 auto", padding: "4rem 4vw 6rem",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center",
      }}>
        <div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1.25rem" }}>
            The Team
          </span>
          <GlitchText
            text="Who are We?"
            as="h2"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 700,
              color: "#E1E1E1",
              margin: "0 0 1.5rem",
              lineHeight: 1.1,
            }}
          />
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(225,225,225,0.55)", margin: 0 }}>
            We're a group of Yale students building combat robots to compete in NHRL.
            REPLACE WITH MORE INFORMATION. blah blah blah blah blah blah blah blah blah
            blah blah blah blah blah blah blah blah blah blah blah blah
          </p>
        </div>

        <div style={{
          aspectRatio: "4/3",
          border: "1px solid rgba(233,49,114,0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
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
          <img src="/team.jpg" alt="Our team" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </section>

      {/* ── COMPETITION HISTORY ──────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "6rem 4vw", background: "rgba(233,49,114,0.03)" }}>
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
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#E1E1E1", marginBottom: "0.3rem" }}>
                  {comp.name}
                </div>
                <p style={{ fontSize: "0.9rem", color: "rgba(225,225,225,0.55)", margin: "0 0 0.6rem", lineHeight: 1.6 }}>
                  {comp.blurb}
                </p>
                <Link to={`/media#${comp.mediaAnchor}`} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em", color: "#E93172", fontWeight: 700, textDecoration: "none" }}>
                  Photos/Videos →
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── OUR ROBOT ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem 4vw 8rem" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "1.25rem", textAlign: "center" }}>
          Our Robot
        </span>
        <GlitchText
          text="Lil Bro"
          as="h2"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
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
            src="/robot.gltf"
            alt="Interactive 3D model of our robot"
            camera-controls
            poster="/robot-poster.png"
            style={{ width: "100%", height: "500px", backgroundColor: "#0F1108" }}
          />
        </div>
      </section>
    </div>
  );
}
