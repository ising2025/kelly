import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  `}</style>
);

// ── Spark Canvas ──────────────────────────────────────────────────────────────
function SparkCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const sparksRef = useRef([]);
  const rafRef = useRef(null);

  const createSpark = useCallback((x, y, burst = false) => {
    const count = burst ? 28 : 2;
    // Real sparks shoot in a biased upward cone from impact, not uniform circle
    const biasDeg = burst
      ? -(Math.PI / 2) + (Math.random() - 0.5) * 0.8
      : Math.random() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      const spread = burst ? (Math.random() - 0.5) * 2.4 : (Math.random() - 0.5) * Math.PI * 2;
      const angle = burst ? biasDeg + spread : spread;
      // fast — real grinding sparks travel quickly
      const speed = burst ? 5 + Math.random() * 11 : 3 + Math.random() * 6;
      // mostly white/orange-white, occasional magenta
      const r = Math.random();
      const color = r > 0.75 ? "#E93172" : r > 0.45 ? "#fff" : "#ffd080";
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        // short life — sparks die fast, not slow floats
        decay: 0.055 + Math.random() * 0.09,
        // tiny and thin
        size: 0.5 + Math.random() * 0.9,
        color,
        trail: [],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let lastBurst = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastBurst > 120) {
        createSpark(e.clientX, e.clientY);
        lastBurst = now;
      }
    };
    const onClick = (e) => createSpark(e.clientX, e.clientY, true);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    // ambient sparks
    const ambientInterval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = canvas.height * 0.5 + Math.random() * canvas.height * 0.4;
      createSpark(x, y, Math.random() > 0.6);
    }, 250);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((s) => s.life > 0);

      sparksRef.current.forEach((s) => {
        // Only keep 3 trail points — short sharp streak, not a comet
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 3) s.trail.shift();

        if (s.trail.length >= 2) {
          const tail = s.trail[0];
          const head = s.trail[s.trail.length - 1];

          // Draw as a bright line streak rather than circles
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(head.x, head.y);

          const alpha = s.life;
          let strokeColor;
          if (s.color === "#E93172") {
            strokeColor = `rgba(233,49,114,${alpha})`;
            ctx.shadowColor = "#E93172";
          } else if (s.color === "#ffd080") {
            strokeColor = `rgba(255,208,128,${alpha * 0.9})`;
            ctx.shadowColor = "#ffcc66";
          } else {
            strokeColor = `rgba(255,255,255,${alpha})`;
            ctx.shadowColor = "#ffffff";
          }

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = s.size;
          ctx.lineCap = "round";
          ctx.shadowBlur = 4;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Bright core dot at the head
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
          ctx.shadowColor = s.color === "#E93172" ? "#E93172" : "#fff";
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.35;  // stronger gravity — sparks arc and drop fast
        s.vx *= 0.97;  // slight air drag
        s.life -= s.decay;
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}

// ── Glitch Text ───────────────────────────────────────────────────────────────
function GlitchText({ text, as: Tag = "h1", className = "", style = {} }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const pulse = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    };
    pulse();
    const id = setInterval(pulse, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          opacity: 0;
        }
        .glitch-wrap.active::before {
          animation: glitch-clip1 0.3s steps(2) forwards;
          color: #E93172;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          transform: translateX(-4px);
          opacity: 1;
        }
        .glitch-wrap.active::after {
          animation: glitch-clip2 0.3s steps(2) forwards;
          color: #B61A66;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          transform: translateX(4px);
          opacity: 1;
        }
        @keyframes glitch-clip1 {
          0%   { transform: translateX(-4px); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
          50%  { transform: translateX(4px);  clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); }
          100% { transform: translateX(0);    opacity: 0; }
        }
        @keyframes glitch-clip2 {
          0%   { transform: translateX(4px);  clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
          50%  { transform: translateX(-4px); clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%); }
          100% { transform: translateX(0);    opacity: 0; }
        }
      `}</style>
      <Tag
        className={`glitch-wrap${glitching ? " active" : ""} ${className}`}
        data-text={text}
        style={style}
      >
        {text}
      </Tag>
    </>
  );
}

// ── Scanline Overlay ──────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        animation: "scanMove 8s linear infinite",
      }}
    >
      <style>{`
        @keyframes scanMove {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
      `}</style>
    </div>
  );
}

// ── Smoke / Fog ───────────────────────────────────────────────────────────────
function FogLayer() {
  return (
    <>
      <style>{`
        @keyframes fogDrift1 {
          0%,100% { transform: translateX(-5%) scale(1.05); opacity: 0.18; }
          50%      { transform: translateX(5%)  scale(1.0);  opacity: 0.28; }
        }
        @keyframes fogDrift2 {
          0%,100% { transform: translateX(8%)  scale(1.0);  opacity: 0.12; }
          50%      { transform: translateX(-8%) scale(1.08); opacity: 0.22; }
        }
        @keyframes fogDrift3 {
          0%,100% { transform: translateX(0%)  translateY(0%)   scale(1.0); opacity: 0.10; }
          50%      { transform: translateX(3%)  translateY(-3%)  scale(1.05); opacity: 0.20; }
        }
      `}</style>
      {[
        { anim: "fogDrift1", dur: "14s", delay: "0s",   bg: "radial-gradient(ellipse 70% 40% at 30% 60%, rgba(182,26,102,0.35) 0%, transparent 70%)" },
        { anim: "fogDrift2", dur: "18s", delay: "-6s",  bg: "radial-gradient(ellipse 80% 50% at 70% 40%, rgba(233,49,114,0.2) 0%, transparent 65%)" },
        { anim: "fogDrift3", dur: "22s", delay: "-10s", bg: "radial-gradient(ellipse 90% 60% at 50% 80%, rgba(15,17,8,0.7) 0%, transparent 80%)" },
      ].map((fog, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            background: fog.bg,
            animation: `${fog.anim} ${fog.dur} ease-in-out ${fog.delay} infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

// ── Live Stat ─────────────────────────────────────────────────────────────────
function StatTicker({ label, value, unit = "" }) {
  const display = typeof value === "number" && value % 1 !== 0
    ? value.toFixed(1)
    : value;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
          fontWeight: 700,
          color: "#E93172",
          letterSpacing: "0.04em",
          lineHeight: 1,
          textShadow: "0 0 18px rgba(233,49,114,0.6)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {display}{unit}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.18em",
          color: "rgba(225,225,225,0.45)",
          textTransform: "uppercase",
          marginTop: "0.3rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Hover Button ──────────────────────────────────────────────────────────────
function ArenaButton({ children, primary = false, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [sparking, setSparking] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    setSparking(true);
    setTimeout(() => setSparking(false), 400);
  };

  return (
    <>
      <style>{`
        @keyframes sparkBorder {
          0%   { box-shadow: 0 0 0px #E93172, inset 0 0 0px #E93172; }
          30%  { box-shadow: 0 0 20px #E93172, inset 0 0 8px rgba(233,49,114,0.3); }
          100% { box-shadow: 0 0 8px rgba(233,49,114,0.4), inset 0 0 0px transparent; }
        }
      `}</style>
      <button
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: "0.85rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "0.85rem 2.4rem",
          border: primary ? "none" : "1px solid rgba(225,225,225,0.3)",
          borderRadius: 0,
          cursor: "pointer",
          background: primary
            ? hovered
              ? "#B61A66"
              : "#E93172"
            : hovered
            ? "rgba(233,49,114,0.08)"
            : "transparent",
          color: primary ? "#fff" : "#E1E1E1",
          transition: "background 0.2s, border-color 0.2s",
          animation: sparking ? "sparkBorder 0.4s ease-out forwards" : "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </button>
    </>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = [
    { label: "Bot Weight",      value: 3,   unit: " lbs" },
    { label: "Top Speed",       value: 17.4,  unit: " m/s" },
    { label: "Weapon RPM",      value: 4800,  unit: "" },
    { label: "Arena Victories", value: 0,    unit: "" },
    { label: "Hit Force",       value: 3200,  unit: " N" },
  ];

  return (
    <div
      style={{
        background: "#0F1108",
        minHeight: "100vh",
        overflowX: "hidden",
        fontFamily: "'Inter', sans-serif",
        color: "#E1E1E1",
      }}
    >
      <FontLoader />
      <Scanlines />
      <SparkCanvas />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Video background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(1.05) translateY(${scrollY * 0.15}px)`,
              filter: "brightness(0.22) saturate(1.4)",
            }}
          >
            {/* Drop a slow-motion fight/sparks video here */}
            <source src="/assets/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* Fallback gradient when no video */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 100% 80% at 50% 60%, rgba(182,26,102,0.15) 0%, rgba(15,17,8,0.95) 70%)",
            }}
          />

          <FogLayer />

          {/* Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(15,17,8,0.85) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            padding: "0 1.5rem",
          }}
        >
          {/* Team eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              opacity: 0.6,
            }}
          >
            <div style={{ width: 40, height: 1, background: "#E93172" }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#E1E1E1",
              }}
            >
              NHRL — BattleBots 2025
            </span>
            <div style={{ width: 40, height: 1, background: "#E93172" }} />
          </div>

          {/* Bot name — glitch reveal */}
          <GlitchText
            text="Lil Bro"
            as="h1"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(3.5rem, 12vw, 9rem)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#E1E1E1",
              margin: 0,
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          />

          {/* Slogan */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
              letterSpacing: "0.12em",
              color: "rgba(225,225,225,0.55)",
              textTransform: "uppercase",
              margin: 0,
              maxWidth: 480,
            }}
          >
            Built to destroy. Engineered to endure.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            <ArenaButton primary onClick={() => navigate("/media")}>Watch the Bot</ArenaButton>
            <ArenaButton onClick={() => navigate("/about")}>Our Story</ArenaButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            opacity: Math.max(0, 1 - scrollY / 200),
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(225,225,225,0.3)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(to bottom, rgba(233,49,114,0.7), transparent)",
              animation: "pulseBar 2s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes pulseBar {
              0%,100% { opacity: 0.4; transform: scaleY(1); }
              50%      { opacity: 1;   transform: scaleY(1.15); }
            }
          `}</style>
        </div>
      </section>

      {/* ── LIVE STATS BAR ───────────────────────────────────────────────── */}
      <section
        style={{
          background: "rgba(15,17,8,0.95)",
          borderTop: "1px solid rgba(233,49,114,0.25)",
          borderBottom: "1px solid rgba(233,49,114,0.25)",
          padding: "2.5rem 4vw",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Section label */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#E93172",
            textAlign: "center",
            marginBottom: "2rem",
            opacity: 0.8,
          }}
        >
          ● Stats
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "3rem 5rem",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {stats.map((s) => (
            <StatTicker key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── BOT OVERVIEW ─────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "8rem 4vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#E93172",
              display: "block",
              marginBottom: "1.25rem",
            }}
          >
            The Machine
          </span>
          <GlitchText
            text="Precision forged. Arena proven."
            as="h2"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#E1E1E1",
              margin: "0 0 1.5rem",
              lineHeight: 1.1,
            }}
          />
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "rgba(225,225,225,0.55)",
              marginBottom: "1rem",
            }}
          >
             Lil Bro is a beater bot engineered blah blah blah.
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "rgba(225,225,225,0.55)",
              marginBottom: "2rem",
            }}
          >
            more stuff blah blah.
          </p>
          <ArenaButton primary onClick={() => navigate("/about")}>Bot Specs</ArenaButton>
        </div>

        {/* Right: bot image placeholder */}
        <div
          style={{
            aspectRatio: "4/3",
            background:
              "linear-gradient(135deg, rgba(182,26,102,0.12) 0%, rgba(15,17,8,0.8) 100%)",
            border: "1px solid rgba(233,49,114,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner decorations */}
          {["top:0;left:0", "top:0;right:0", "bottom:0;left:0", "bottom:0;right:0"].map(
            (pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  ...(Object.fromEntries(
                    pos.split(";").map((p) => p.split(":"))
                  )),
                  width: 20,
                  height: 20,
                  borderTop: i < 2 ? "1px solid #E93172" : "none",
                  borderBottom: i >= 2 ? "1px solid #E93172" : "none",
                  borderLeft: i % 2 === 0 ? "1px solid #E93172" : "none",
                  borderRight: i % 2 === 1 ? "1px solid #E93172" : "none",
                }}
              />
            )
          )}
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(225,225,225,0.2)",
              textTransform: "uppercase",
            }}
          >
            [ Bot Image ]
          </span>
        </div>
      </section>

      {/* ── COMPETITION RECORD ───────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "6rem 4vw",
          background: "rgba(233,49,114,0.03)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#E93172",
              display: "block",
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            Fight Record
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            {[
              { match: "Season 8 — Ep. 4", opponent: "Shredmaster", result: "WIN", method: "KO — 0:47" },
              { match: "Season 8 — Ep. 7", opponent: "Voltage Drop", result: "WIN", method: "JD" },
              { match: "Season 8 — Quarterfinal", opponent: "Apex", result: "LOSS", method: "KO — 2:12" },
              { match: "Season 9 — Ep. 2", opponent: "Gridlock", result: "WIN", method: "KO — 1:03" },
            ].map((fight, i) => (
              <div
                key={i}
                style={{
                  background: "#0F1108",
                  padding: "2rem 1.75rem",
                  borderLeft: fight.result === "WIN" ? "2px solid #E93172" : "2px solid rgba(225,225,225,0.15)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    color: "rgba(225,225,225,0.35)",
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                  }}
                >
                  {fight.match}
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#E1E1E1",
                    marginBottom: "0.3rem",
                  }}
                >
                  vs. {fight.opponent}
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    color: fight.result === "WIN" ? "#E93172" : "rgba(225,225,225,0.4)",
                    fontWeight: 700,
                  }}
                >
                  {fight.result} — {fight.method}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH CTA ───────────────────────────────────────────────── */}
      <section
        style={{
          padding: "8rem 4vw",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(182,26,102,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            color: "rgba(225,225,225,0.4)",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          NHRL
        </p>
        <GlitchText
          text="ENTER THE ARENA"
          as="h2"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "#E1E1E1",
            margin: "0 0 2rem",
            letterSpacing: "0.08em",
          }}
        />
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <ArenaButton primary onClick={() => navigate("/about")}>Follow the Season</ArenaButton>
          <ArenaButton onClick={() => navigate("/contact")}>Contact the Team</ArenaButton>
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
            fontFamily: "'Rajdhani', sans-serif",
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
          © 2025 NHRL
        </span>
      </footer>
    </div>
  );
}