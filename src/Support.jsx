import { useState, useEffect, useRef, useCallback } from "react";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  `}</style>
);

// ── Scanlines ─────────────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        animation: "scanMove 8s linear infinite",
      }}
    >
      <style>{`@keyframes scanMove { 0% { background-position: 0 0; } 100% { background-position: 0 100vh; } }`}</style>
    </div>
  );
}

// ── Mini spark burst (used on tier select / meter fill) ───────────────────────
function useBurstSparks(canvasRef) {
  const burst = useCallback(
    (x, y) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const sparks = Array.from({ length: 22 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 22 + Math.random() * 0.3;
        const speed = 2 + Math.random() * 5;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.03 + Math.random() * 0.04,
          size: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.4 ? "#E93172" : "#fff",
        };
      });

      let rafId;
      const draw = () => {
        sparks.forEach((s) => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle =
            s.color === "#fff"
              ? `rgba(255,255,255,${s.life})`
              : `rgba(233,49,114,${s.life})`;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.12;
          s.life -= s.decay;
        });
        if (sparks.some((s) => s.life > 0)) {
          rafId = requestAnimationFrame(draw);
        }
      };
      draw();
      return () => cancelAnimationFrame(rafId);
    },
    [canvasRef]
  );
  return burst;
}

// ── Weapon Charge Meter ───────────────────────────────────────────────────────
function ChargeMeter({ percent, goal, raised }) {
  const canvasRef = useRef(null);
  const burstSpark = useBurstSparks(canvasRef);
  const prevPct = useRef(percent);
  const [displayPct, setDisplayPct] = useState(0);

  // Animate fill on mount
  useEffect(() => {
    let start = null;
    const target = percent;
    const duration = 1800;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      setDisplayPct(ease(t) * target);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [percent]);

  // Spark when percent jumps
  useEffect(() => {
    if (Math.abs(percent - prevPct.current) > 2) {
      const canvas = canvasRef.current;
      if (canvas) {
        const fillX = (displayPct / 100) * (canvas.width - 4) + 2;
        burstSpark(fillX, canvas.height / 2);
      }
    }
    prevPct.current = percent;
  }, [percent, burstSpark, displayPct]);

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
      <style>{`
        @keyframes meterGlow {
          0%,100% { box-shadow: 0 0 12px rgba(233,49,114,0.5); }
          50%      { box-shadow: 0 0 28px rgba(233,49,114,0.9); }
        }
        @keyframes scanSweep {
          0%   { left: -30%; }
          100% { left: 110%; }
        }
      `}</style>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#E93172", textTransform: "uppercase" }}>
          Weapon Charged
        </span>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(225,225,225,0.35)", textTransform: "uppercase" }}>
          Target: ${goal.toLocaleString()}
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          position: "relative",
          height: 12,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(233,49,114,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            height: "100%",
            width: `${displayPct}%`,
            background: "linear-gradient(90deg, #B61A66, #E93172)",
            animation: "meterGlow 2s ease-in-out infinite",
            transition: "width 0.1s",
          }}
        />
        {/* Scan sweep */}
        <div
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            width: "30%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation: "scanSweep 2.4s linear infinite",
          }}
        />
        {/* Spark canvas overlay */}
        <canvas
          ref={canvasRef}
          width={680}
          height={12}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        />
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.75rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#E93172",
              letterSpacing: "0.04em",
            }}
          >
            ${raised.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "rgba(225,225,225,0.3)",
              textTransform: "uppercase",
              marginLeft: "0.5rem",
            }}
          >
            raised
          </span>
        </div>
        <span
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "rgba(225,225,225,0.2)",
            letterSpacing: "0.04em",
          }}
        >
          {Math.round(displayPct)}%
        </span>
      </div>

      {/* Tier markers */}
      <div style={{ position: "relative", height: 24, marginTop: "0.25rem" }}>
        {[25, 50, 75, 100].map((mark) => (
          <div
            key={mark}
            style={{
              position: "absolute",
              left: `${mark}%`,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div style={{ width: 1, height: 6, background: displayPct >= mark ? "#E93172" : "rgba(255,255,255,0.15)" }} />
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.1em", color: displayPct >= mark ? "#E93172" : "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>
              {mark}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Donation Tier Card ────────────────────────────────────────────────────────
function TierCard({ tier, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;

  return (
    <>
      <style>{`
        @keyframes tierSpark {
          0%   { box-shadow: 0 0 0 rgba(233,49,114,0); }
          40%  { box-shadow: 0 0 24px rgba(233,49,114,0.6), inset 0 0 12px rgba(233,49,114,0.08); }
          100% { box-shadow: 0 0 8px rgba(233,49,114,0.2); }
        }
      `}</style>
      <div
        onClick={() => onSelect(tier)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: selected
            ? "1px solid #E93172"
            : hovered
            ? "1px solid rgba(233,49,114,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          background: selected
            ? "rgba(233,49,114,0.07)"
            : "rgba(15,17,8,0.7)",
          padding: "1.75rem 1.5rem",
          cursor: "pointer",
          position: "relative",
          transition: "border-color 0.2s, background 0.2s",
          animation: selected ? "tierSpark 0.5s ease-out forwards" : "none",
          userSelect: "none",
        }}
      >
        {tier.featured && (
          <div
            style={{
              position: "absolute",
              top: -1,
              right: "1.5rem",
              background: "#E93172",
              padding: "0.2rem 0.6rem",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Most Popular
          </div>
        )}

        {/* Corner marks */}
        {[
          { top: 0, left: 0, borderTop: "1px solid", borderLeft: "1px solid" },
          { top: 0, right: 0, borderTop: "1px solid", borderRight: "1px solid" },
          { bottom: 0, left: 0, borderBottom: "1px solid", borderLeft: "1px solid" },
          { bottom: 0, right: 0, borderBottom: "1px solid", borderRight: "1px solid" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              borderColor: active ? "#E93172" : "rgba(255,255,255,0.15)",
              transition: "border-color 0.2s",
              ...s,
            }}
          />
        ))}

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: selected ? "#E93172" : "rgba(225,225,225,0.35)",
            marginBottom: "0.5rem",
            transition: "color 0.2s",
          }}
        >
          {tier.label}
        </div>
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "2.2rem",
            fontWeight: 700,
            color: "#E1E1E1",
            letterSpacing: "0.04em",
            lineHeight: 1,
            marginBottom: "0.75rem",
          }}
        >
          ${tier.amount}
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem",
            lineHeight: 1.6,
            color: "rgba(225,225,225,0.5)",
            margin: 0,
          }}
        >
          {tier.description}
        </p>

        {tier.perks && (
          <ul style={{ margin: "1rem 0 0", padding: 0, listStyle: "none" }}>
            {tier.perks.map((perk) => (
              <li
                key={perk}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(225,225,225,0.45)",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  marginBottom: "0.35rem",
                }}
              >
                <span style={{ color: "#E93172", flexShrink: 0, marginTop: 1 }}>—</span>
                {perk}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

// ── Breakdown Bar ─────────────────────────────────────────────────────────────
function BreakdownBar({ label, pct, detail }) {
  const [filled, setFilled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setFilled(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#E1E1E1", letterSpacing: "0.06em" }}>
          {label}
        </span>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#E93172" }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, height: "100%",
            width: filled ? `${pct}%` : "0%",
            background: "linear-gradient(90deg, #B61A66, #E93172)",
            transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 0 8px rgba(233,49,114,0.5)",
          }}
        />
      </div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(225,225,225,0.35)", margin: "0.4rem 0 0", lineHeight: 1.5 }}>
        {detail}
      </p>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <>
      <style>{`
        @keyframes toastIn  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-8px); } }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#E93172",
          color: "#fff",
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: "0.85rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "0.75rem 2rem",
          zIndex: 999,
          pointerEvents: "none",
          animation: visible ? "toastIn 0.3s ease-out forwards" : "toastOut 0.3s ease-in forwards",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    label: "Spark",
    amount: 10,
    description: "Every dollar counts. You're part of the pit crew now.",
    perks: ["Name in our credits", "Season update emails"],
  },
  {
    label: "Armor",
    amount: 50,
    description: "Help us keep Lil Bro battle-ready between fights.",
    perks: ["Name in credits", "Exclusive backer Discord", "Behind-the-scenes updates"],
    featured: true,
  },
  {
    label: "Weapon",
    amount: 100,
    description: "Fund the beater bar. You're the reason it hits harder.",
    perks: ["Name on the bot (sticker)", "All Armor perks", "Signed team photo"],
  },
  {
    label: "Overhaul",
    amount: 250,
    description: "Season-level support. You're practically on the team.",
    perks: ["All Weapon perks", "Video shoutout", "Early season access"],
  },
];

const BREAKDOWN = [
  { label: "Parts & Materials",  pct: 45, detail: "Titanium armor, AR500 steel, weapon components, and hardware." },
  { label: "Machining & Fab",    pct: 25, detail: "CNC time, welding, and finishing work to build it right." },
  { label: "Electronics & Drive",pct: 20, detail: "ESCs, motors, receivers, batteries, and wiring." },
  { label: "Travel & Logistics", pct: 10, detail: "Getting the bot and team to the arena and back." },
];

const CAMPAIGN_GOAL = 5000;
const CAMPAIGN_RAISED = 0;

export default function SupportPage() {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [copied, setCopied] = useState(false);

  const finalAmount = useCustom
    ? parseFloat(customAmount) || 0
    : selectedTier?.amount || 0;

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleDonate = () => {
    if (finalAmount <= 0) {
      showToast("Enter a valid amount");
      return;
    }
    // Replace with your real payment link / Stripe / PayPal
    window.open(
      `https://buy.stripe.com/YOUR_LINK?amount=${finalAmount * 100}`,
      "_blank"
    );
    showToast(`Redirecting — thank you for $${finalAmount}!`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const pct = Math.min((CAMPAIGN_RAISED / CAMPAIGN_GOAL) * 100, 100);

  return (
    <div
      style={{
        background: "#0F1108",
        minHeight: "100vh",
        color: "#E1E1E1",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <FontLoader />
      <Scanlines />

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(182,26,102,0.1) 0%, transparent 60%)",
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "7rem 4vw 4rem",
          textAlign: "center",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "1.75rem",
            opacity: 0.5,
          }}
        >
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
            NHRL
          </span>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
        </div>

        <h1
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(2.8rem, 9vw, 6rem)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#E1E1E1",
            margin: "0 0 1rem",
            lineHeight: 0.95,
            textTransform: "uppercase",
          }}
        >
          Fuel the{" "}
          <span
            style={{
              color: "#E93172",
              textShadow: "0 0 30px rgba(233,49,114,0.5)",
            }}
          >
            Fight
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            lineHeight: 1.8,
            color: "rgba(225,225,225,0.5)",
            maxWidth: 520,
            margin: "0 auto 3rem",
          }}
        >
          Lil Bro is built by a student team running on passion and
          titanium. Every dollar you put in goes directly onto the machine —
          and into the arena.
        </p>

        {/* Charge meter */}
        <ChargeMeter
          percent={pct}
          goal={CAMPAIGN_GOAL}
          raised={CAMPAIGN_RAISED}
        />

        {/* Quick social proof */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "2.5rem",
          }}
        >
          {[
            { val: "0", label: "Backers" },
            { val: "31", label: "Days Left" },
            { val: "0", label: "Arena Wins" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#E93172",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  textShadow: "0 0 16px rgba(233,49,114,0.4)",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  color: "rgba(225,225,225,0.3)",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIERS ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "4rem 4vw",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E93172",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          Choose Your Level
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {TIERS.map((tier) => (
            <TierCard
              key={tier.label}
              tier={tier}
              selected={!useCustom && selectedTier?.label === tier.label}
              onSelect={(t) => {
                setSelectedTier(t);
                setUseCustom(false);
              }}
            />
          ))}
        </div>

        {/* Custom amount */}
        <div
          style={{
            marginTop: "1px",
            background: "rgba(255,255,255,0.02)",
            border: useCustom ? "1px solid #E93172" : "1px solid rgba(255,255,255,0.06)",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            transition: "border-color 0.2s",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: useCustom ? "#E93172" : "rgba(225,225,225,0.3)",
              transition: "color 0.2s",
              flexShrink: 0,
            }}
          >
            Custom Amount
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexGrow: 1 }}>
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: useCustom ? "#E93172" : "rgba(225,225,225,0.2)",
                padding: "0.4rem 0.6rem",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRight: "none",
                lineHeight: 1,
              }}
            >
              $
            </span>
            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setUseCustom(true);
              }}
              onFocus={() => setUseCustom(true)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#E1E1E1",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 600,
                padding: "0.4rem 0.75rem",
                outline: "none",
                width: "100%",
                maxWidth: 200,
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={handleDonate}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "1rem 3rem",
              border: "none",
              background: finalAmount > 0 ? "#E93172" : "rgba(233,49,114,0.3)",
              color: "#fff",
              cursor: finalAmount > 0 ? "pointer" : "default",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: finalAmount > 0 ? "0 0 20px rgba(233,49,114,0.35)" : "none",
            }}
            onMouseEnter={(e) => { if (finalAmount > 0) e.target.style.background = "#B61A66"; }}
            onMouseLeave={(e) => { if (finalAmount > 0) e.target.style.background = "#E93172"; }}
          >
            {finalAmount > 0 ? `Back with $${finalAmount}` : "Select a tier"}
          </button>

          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(225,225,225,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            Secure checkout via Stripe
          </span>
        </div>

        {/* Fine print */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "rgba(225,225,225,0.2)",
            marginTop: "1rem",
            lineHeight: 1.6,
          }}
        >
          Donations support NHRL directly. This is not a
          tax-deductible charitable contribution. Perks are fulfilled by the
          team post-season.
        </p>
      </section>

      {/* ── WHERE IT GOES ─────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 1,
          padding: "5rem 4vw",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#E93172",
                marginBottom: "1.25rem",
              }}
            >
              Budget Breakdown
            </p>
            <h2
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#E1E1E1",
                margin: "0 0 1rem",
                lineHeight: 1.1,
              }}
            >
              Every dollar has a destination.
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.8,
                color: "rgba(225,225,225,0.45)",
                margin: 0,
              }}
            >
              We publish our budget openly. Nothing goes to profit — it all goes
              to making Lil Bro the most dangerous thing in the arena.
            </p>
          </div>

          <div>
            {BREAKDOWN.map((b) => (
              <BreakdownBar key={b.label} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ALTERNATIVES ─────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 1,
          padding: "5rem 4vw",
          background: "rgba(233,49,114,0.025)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#E93172",
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
            Other Ways to Help
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {[
              {
                icon: "⚡",
                title: "Share the Page",
                body: "The biggest thing you can do for free. Every share reaches a potential backer.",
                action: "Copy Link",
                onClick: handleCopy,
              },
              {
                icon: "🔧",
                title: "Sponsor the Team",
                body: "Companies get logo placement on the bot and full sponsor recognition.",
                action: "Sponsor Inquiry →",
                onClick: () => window.location.href = "/contact",
              },
              {
                icon: "📦",
                title: "Donate Materials",
                body: "We can use steel, titanium, carbon fiber, and electronics components.",
                action: "Get in Touch →",
                onClick: () => window.location.href = "/contact",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#0F1108",
                  padding: "2rem 1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{card.icon}</span>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#E1E1E1",
                    letterSpacing: "0.06em",
                  }}
                >
                  {card.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    lineHeight: 1.6,
                    color: "rgba(225,225,225,0.45)",
                    margin: 0,
                    flexGrow: 1,
                  }}
                >
                  {card.body}
                </p>
                <button
                  onClick={card.onClick}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#E93172",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left",
                    fontWeight: 500,
                  }}
                >
                  {copied && card.title === "Share the Page" ? "Copied!" : card.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 1,
          padding: "5rem 4vw",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E93172",
            marginBottom: "2.5rem",
          }}
        >
          FAQ
        </p>

        {[
          {
            q: "Is my donation secure?",
            a: "Yes. We use Stripe for all payment processing — your card details never touch our servers.",
          },
          {
            q: "When do I receive my perks?",
            a: "Perks are fulfilled after the season ends, typically within 60 days. You'll get an email from us.",
          },
          {
            q: "Can I get a refund?",
            a: "Donations are non-refundable, but if something goes wrong on our end, contact us directly and we'll make it right.",
          },
          {
            q: "Is this tax-deductible?",
            a: "No —  we are not a registered nonprofit. Donations are a direct contribution to the team, not a charitable gift.",
          },
          {
            q: "What if you exceed the goal?",
            a: "Any funds beyond the goal go toward the next season's build and testing budget.",
          },
        ].map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "2rem 4vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.15em", color: "#E93172" }}>
          Lil Bro
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(225,225,225,0.2)", textTransform: "uppercase" }}>
          © 2025 NHRL
        </span>
      </footer>

      {/* Toast */}
      {(toast.visible || toast.message) && (
        <Toast message={toast.message} visible={toast.visible} />
      )}
    </div>
  );
}

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "1.25rem 0",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: 0,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#E1E1E1",
            letterSpacing: "0.04em",
          }}
        >
          {q}
        </span>
        <span
          style={{
            color: "#E93172",
            fontSize: "1.2rem",
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            flexShrink: 0,
            marginLeft: "1rem",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            color: "rgba(225,225,225,0.45)",
            margin: "0.75rem 0 0",
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}