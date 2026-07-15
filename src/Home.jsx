import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import lilbro from "./assets/Lil_Bro_v2_WP2.jpeg";

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
          fontFamily: "'Space Grotesk', sans-serif",
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
          fontFamily: "'Space Grotesk', sans-serif",
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

// ── Pink Fire ─────────────────────────────────────────────────────────────────
function PinkFire() {
  const firebeds = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: `${i * 4.6 - 10}%`,
        width: 220 + (i % 4) * 28,
        height: 184 + (i % 5) * 16,
        delay: `${i * -0.11}s`,
        frontDuration: `${0.82 + (i % 4) * 0.05}s`,
        backDuration: `${1.28 + (i % 5) * 0.06}s`,
        opacity: 0.72 + (i % 4) * 0.07,
      })),
    []
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: `${3 + ((i * 17) % 94)}%`,
        bottom: `${26 + (i % 5) * 6}px`,
        drift: `${((i * 29) % 70) - 35}px`,
        delay: `${(i % 12) * -0.18}s`,
        duration: `${1.05 + (i % 6) * 0.18}s`,
        size: `${2 + (i % 3)}px`,
      })),
    []
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes arenaBurn {
          0%, 100% {
            clip-path: polygon(48% 97%, 42% 97%, 37% 93%, 31% 92%, 28% 88%, 26% 81%, 29% 84%, 34% 84%, 33% 79%, 30% 74%, 31% 67%, 34% 57%, 34% 65%, 39% 71%, 43% 65%, 43% 55%, 40% 45%, 48% 59%, 49% 69%, 51% 76%, 55% 71%, 54% 65%, 54% 58%, 58% 64%, 61% 72%, 57% 92%, 61% 97%, 64% 98%, 66% 95%, 64% 93%, 57% 96%, 54% 93%, 48% 97%);
          }
          25% {
            clip-path: polygon(49% 97%, 41% 97%, 35% 92%, 33% 86%, 34% 80%, 30% 74%, 34% 77%, 38% 81%, 38% 78%, 36% 72%, 35% 67%, 37% 61%, 37% 54%, 39% 61%, 39% 67%, 43% 63%, 43% 58%, 45% 44%, 44% 58%, 48% 66%, 51% 67%, 51% 59%, 54% 67%, 56% 72%, 57% 79%, 59% 77%, 60% 71%, 61% 77%, 61% 83%, 60% 89%, 61% 94%, 57% 97%, 52% 98%);
          }
          50% {
            clip-path: polygon(46% 97%, 39% 96%, 35% 89%, 36% 84%, 34% 77%, 30% 73%, 30% 65%, 30% 70%, 35% 75%, 38% 68%, 37% 61%, 40% 53%, 41% 42%, 42% 56%, 44% 65%, 50% 67%, 51% 57%, 53% 68%, 52% 74%, 51% 81%, 55% 78%, 57% 72%, 58% 79%, 57% 85%, 55% 88%, 60% 87%, 63% 82%, 63% 89%, 59% 94%, 55% 98%, 51% 92%, 50% 99%, 45% 96%);
          }
          75% {
            clip-path: polygon(45% 97%, 38% 97%, 33% 93%, 31% 87%, 31% 81%, 29% 76%, 25% 69%, 29% 61%, 30% 69%, 35% 71%, 35% 62%, 34% 54%, 38% 45%, 38% 54%, 43% 62%, 47% 57%, 48% 49%, 44% 38%, 50% 46%, 53% 60%, 54% 71%, 53% 79%, 59% 76%, 60% 66%, 64% 73%, 63% 79%, 59% 85%, 64% 90%, 68% 84%, 68% 92%, 60% 97%, 53% 98%, 48% 99%);
          }
        }
        @keyframes arenaBurnTall {
          0%, 100% {
            clip-path: polygon(48% 99%, 39% 99%, 29% 96%, 22% 90%, 18% 79%, 20% 66%, 16% 58%, 22% 42%, 28% 48%, 33% 44%, 30% 29%, 37% 12%, 43% 31%, 49% 35%, 53% 22%, 59% 39%, 56% 52%, 65% 50%, 71% 39%, 75% 56%, 71% 68%, 80% 69%, 75% 83%, 66% 94%, 56% 98%);
          }
          20% {
            clip-path: polygon(45% 100%, 34% 99%, 24% 95%, 17% 86%, 18% 73%, 14% 62%, 20% 51%, 19% 39%, 28% 50%, 34% 47%, 32% 34%, 38% 18%, 42% 34%, 50% 37%, 48% 24%, 58% 32%, 62% 49%, 69% 44%, 73% 53%, 70% 65%, 83% 71%, 77% 85%, 68% 96%, 55% 99%);
          }
          45% {
            clip-path: polygon(50% 99%, 38% 99%, 27% 96%, 20% 89%, 16% 76%, 19% 64%, 13% 55%, 23% 47%, 25% 35%, 33% 48%, 39% 42%, 36% 25%, 45% 8%, 47% 30%, 54% 39%, 58% 26%, 65% 43%, 62% 56%, 72% 54%, 76% 64%, 71% 75%, 80% 82%, 72% 94%, 60% 99%);
          }
          70% {
            clip-path: polygon(46% 100%, 35% 99%, 25% 95%, 19% 87%, 22% 76%, 17% 68%, 18% 57%, 21% 46%, 30% 53%, 35% 45%, 34% 32%, 41% 16%, 43% 34%, 51% 39%, 54% 28%, 60% 43%, 59% 56%, 67% 51%, 76% 58%, 73% 70%, 82% 76%, 75% 90%, 65% 97%, 54% 99%);
          }
        }
        @keyframes arenaGlowPulse {
          0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1, 1); }
          50% { opacity: 0.9; transform: translateX(-50%) scale(1.06, 1.16); }
        }
        @keyframes arenaSparkRise {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          70%  { opacity: 0.65; }
          100% { transform: translateY(-145px) translateX(var(--drift)) scale(0.25); opacity: 0; }
        }
        @keyframes arenaHeatShimmer {
          0%, 100% { opacity: 0.25; transform: skewX(-1deg); }
          50% { opacity: 0.5; transform: skewX(1deg); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          bottom: -54,
          left: "50%",
          transform: "translateX(-50%)",
          width: "124%",
          height: 190,
          background:
            "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,240,246,0.72) 0%, rgba(255,143,192,0.6) 22%, rgba(233,49,114,0.44) 46%, rgba(182,26,102,0.2) 66%, transparent 82%)",
          filter: "blur(28px)",
          animation: "arenaGlowPulse 1.15s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "118%",
          height: 250,
          borderRadius: "50% 50% 20% 20%",
          background:
            "radial-gradient(ellipse 50% 70% at 50% 100%, rgba(233,49,114,0.35) 0%, rgba(233,49,114,0.16) 42%, transparent 72%)",
          filter: "blur(42px)",
          opacity: 0.8,
          animation: "arenaGlowPulse 1.6s ease-in-out -0.35s infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 94,
          left: 0,
          right: 0,
          height: 95,
          background:
            "linear-gradient(to top, rgba(233,49,114,0.2), rgba(255,143,192,0.08), transparent)",
          filter: "blur(16px)",
          animation: "arenaHeatShimmer 0.8s ease-in-out infinite",
        }}
      />

      {firebeds.map((fire, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: -22,
            left: fire.left,
            width: fire.width,
            height: fire.height,
            opacity: fire.opacity,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 3,
              width: "82%",
              height: "100%",
              background:
                "linear-gradient(0deg, rgba(182,26,102,1) 8%, rgba(233,49,114,0.98) 42%, rgba(255,111,176,0.9) 69%, rgba(255,232,242,0.8) 100%)",
              animation: `arenaBurnTall ${fire.backDuration} linear ${fire.delay} infinite`,
              filter: "blur(1.25px)",
              mixBlendMode: "screen",
              transformOrigin: "bottom center",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -8,
              width: "138%",
              height: "78%",
              background:
                "linear-gradient(0deg, rgba(138,20,80,1) 10%, rgba(233,49,114,0.95) 48%, rgba(255,158,200,0.86) 78%, rgba(255,240,246,0.74) 100%)",
              animation: `arenaBurn ${fire.frontDuration} linear ${fire.delay} infinite`,
              filter: "blur(1px)",
              mixBlendMode: "screen",
              transformOrigin: "bottom center",
            }}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "94%",
          height: 62,
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,240,246,0.9) 0%, rgba(255,143,192,0.58) 38%, rgba(233,49,114,0.32) 60%, transparent 82%)",
          filter: "blur(6px)",
          mixBlendMode: "screen",
          animation: "arenaHeatShimmer 0.42s ease-in-out infinite",
        }}
      />

      {sparks.map((spark, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: spark.bottom,
            left: spark.left,
            width: spark.size,
            height: spark.size,
            borderRadius: 1,
            background: i % 4 === 0 ? "#fff0f6" : "#ff8fc0",
            boxShadow: "0 0 7px 1px rgba(233,49,114,0.95)",
            filter: "blur(0.5px)",
            "--drift": spark.drift,
            animation: `arenaSparkRise ${spark.duration} ease-out ${spark.delay} infinite`,
          }}
        />
      ))}
    </div>
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
    { label: "Top Speed",       value: 4.77,  unit: " m/s" },
    { label: "Weapon RPM",      value: 24464,  unit: "" },
    //{ label: "Arena Victories", value: 0,    unit: "" },
    { label: "Kinetic Energy",       value: 977,  unit: " J" },
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
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#E1E1E1",
              }}
            >
              WWSD
            </span>
            <div style={{ width: 40, height: 1, background: "#E93172" }} />
          </div>

          {/* Bot name — glitch reveal */}
          <GlitchText
            text="Lil Bro"
            as="h1"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
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
              fontFamily: "'Space Grotesk', sans-serif",
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
             Lil Bro is our first combat robot in the 3lb beetleweight class. 
             It's a four-wheel-drive vertical spinner crafted from carbon fiber, AR500 steel, and titanium.
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "rgba(225,225,225,0.55)",
              marginBottom: "2rem",
            }}
          >
            
          </p>
          <ArenaButton primary onClick={() => navigate("/about#our-robot")}>Bot Diagram</ArenaButton>
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
          <img
            src={lilbro}
            alt="Lil Bro"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
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
              { match: "OCT 2026 — Match 1", opponent: "TBD", result: "WIN", method: "TBD" },
              // { match: "Season 8 — Ep. 7", opponent: "Voltage Drop", result: "WIN", method: "JD" },
              // { match: "Season 8 — Quarterfinal", opponent: "Apex", result: "LOSS", method: "KO — 2:12" },
              // { match: "Season 9 — Ep. 2", opponent: "Gridlock", result: "WIN", method: "KO — 1:03" },
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
                    fontFamily: "'Space Grotesk', sans-serif",
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
                    fontFamily: "'Space Grotesk', sans-serif",
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
        {/* <p
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
        </p> */}
        <GlitchText
          text="ENTER THE ARENA"
          as="h2"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "#E1E1E1",
            margin: "0 0 2rem",
            letterSpacing: "0.08em",
            position: "relative",
            zIndex: 1,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <ArenaButton primary onClick={() => navigate("/about#competition-history")}>Follow the Season</ArenaButton>
          <ArenaButton onClick={() => navigate("/contact")}>Contact the Team</ArenaButton>
        </div>

        <PinkFire />
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
          © 2025 WWSD
        </span>
      </footer>
    </div>
  );
}
