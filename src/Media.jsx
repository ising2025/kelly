import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import oct2026Bot from "./assets/Oct2026/IMG_6568.jpg";
import oct2026BotSide from "./assets/Oct2026/IMG_6572.jpg";
import oct2026PitsA from "./assets/Oct2026/IMG_6560.jpg";
import oct2026PitsB from "./assets/Oct2026/IMG_6562.jpg";
import oct2026Weapon from "./assets/Oct2026/IMG_6575.jpg";
import oct2026Arena from "./assets/Oct2026/IMG_6595.jpg";

// Videos are linked straight from NHRL's BrettZone storage, not hosted here.
const NHRL = "https://nhrl-matches.us-east-1.linodeobjects.com/proxy";

// competitions must stay in sync with About.jsx — mediaAnchor here = id on each section
const competitions = [
  {
    id: "october-2026",
    date: "October 2026",
    name: "October 2026 NHRL XP",
    // ratio = width / height, so each photo keeps its shape in the collage.
    photos: [
      { src: oct2026Bot, alt: "Lil Bro on the pit table, front view", ratio: 1600 / 1173 },
      { src: oct2026PitsA, alt: "Team member working on Lil Bro in the pits", ratio: 3 / 4 },
      { src: oct2026BotSide, alt: "Lil Bro on the pit table, angled view", ratio: 3 / 4 },
      { src: oct2026PitsB, alt: "Team member repairing Lil Bro in the pits", ratio: 3 / 4 },
      { src: oct2026Weapon, alt: "Close-up of Lil Bro's weapon", ratio: 1562 / 1600 },
      { src: oct2026Arena, alt: "Lil Bro in the NHRL arena", ratio: 3 / 4 },
    ],
    // Each video is one slide; options are the tabs (hero shots or camera angles).
    videos: [
      {
        title: "Hero Shots",
        link: "https://brettzone.nhrl.io/brettZone/v2/heros/lilbro",
        loop: true,
        options: [
          { label: "Bot", src: `${NHRL}/clips/clip-2026-10-03_17-39-12.754-c3973353_720p.mp4` },
          // trimEnd: seconds cut off the end (the file is NHRL's, so it's trimmed during playback).
          { label: "Builder", src: `${NHRL}/clips/clip-2026-10-03_17-37-33.181-d26c9c2d_720p.mp4`, trimEnd: 2 },
        ],
      },
      {
        title: "Lil Bro vs. Fracture",
        description: "Qualifying R1 · Win by Tap Out",
        link: "https://brettzone.nhrl.io/brettZone/v2/f/EX-5c56ba5c12be4dae?tournamentID=nhrl_oct26_3lbxp",
        options: [
          { label: "Overhead", src: `${NHRL}/Cage-5-Overhead-High-2026-10-03_17-44-43.103_720p.mp4` },
          { label: "Red", src: `${NHRL}/Cage-5-Red-High-2026-10-03_17-44-42.251_720p.mp4` },
          { label: "Blue", src: `${NHRL}/Cage-5-Blue-High-2026-10-03_17-44-42.760_720p.mp4` },
        ],
      },
      {
        title: "Lil Bro vs. YEETUS",
        description: "Qualifying R2 · Loss by KO",
        link: "https://brettzone.nhrl.io/brettZone/v2/f/EX-e2175dede65a4103?tournamentID=nhrl_oct26_3lbxp",
        options: [
          { label: "Overhead", src: `${NHRL}/Cage-5-Overhead-High-2026-10-03_18-21-49.306_720p.mp4` },
          { label: "Red", src: `${NHRL}/Cage-5-Red-High-2026-10-03_18-21-50.468_720p.mp4` },
        ],
      },
      {
        title: "Lil Bro vs. HiveMind",
        description: "Quarterfinal · Win by Judges' Decision",
        link: "https://brettzone.nhrl.io/brettZone/v2/f/W-2?tournamentID=nhrl_oct26_3lbxp",
        options: [
          { label: "Overhead", src: `${NHRL}/Cage-5-Overhead-High-2026-10-03_21-43-23.526_720p.mp4` },
          { label: "Red", src: `${NHRL}/Cage-5-Red-High-2026-10-03_21-43-23.528_720p.mp4` },
          { label: "Blue", src: `${NHRL}/Cage-5-Blue-High-2026-10-03_21-43-23.525_720p.mp4` },
        ],
      },
      {
        title: "Lil Bro vs. Split Decision",
        description: "Semifinal · Loss by KO",
        link: "https://brettzone.nhrl.io/brettZone/v2/f/W-5?tournamentID=nhrl_oct26_3lbxp",
        options: [
          { label: "Overhead", src: `${NHRL}/Cage-6-Overhead-High-2026-10-03_22-10-45.377_720p.mp4` },
          { label: "Red", src: `${NHRL}/Cage-6-Red-2026-10-03_22-10-45.150_720p.mp4` },
          { label: "Blue", src: `${NHRL}/Cage-6-Blue-2026-10-03_22-10-46.259_720p.mp4` },
        ],
      },
    ],
  },
  // { //placeholder examples
  //   id: "january-2026",
  //   date: "January 2026",
  //   name: "Placeholder Event Name",
  //   photos: [],
  //   videos: [],
  // },
  // {
  //   id: "march-2026",
  //   date: "March 2026",
  //   name: "Placeholder Event Name",
  //   photos: [],
  //   videos: [],
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

// Splits photos into rows; each photo's width follows its ratio so a row shares one height.
function PhotoCollage({ photos }) {
  const query = "(max-width: 640px)";
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setNarrow(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const perRow = narrow ? 2 : 3;
  const rows = [];
  for (let i = 0; i < photos.length; i += perRow) rows.push(photos.slice(i, i + perRow));

  return (
    <>
      <div className="media-collage">
        {rows.map((row, i) => (
          <div className="media-collage-row" key={i}>
            {row.map((photo, j) => (
              <button key={photo.src} type="button" className="media-collage-item" style={{ flexGrow: photo.ratio, aspectRatio: photo.ratio }} aria-label={`Enlarge: ${photo.alt}`} onClick={() => setOpenIndex(i * perRow + j)}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </button>
            ))}
          </div>
        ))}
      </div>
      {openIndex !== null && <PhotoLightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />}
    </>
  );
}

function PhotoLightbox({ photos, index, onChange, onClose }) {
  const closeRef = useRef(null);
  const photo = photos[index];
  const prev = (index - 1 + photos.length) % photos.length;
  const next = (index + 1) % photos.length;

  useEffect(() => {
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onChange(prev);
      else if (e.key === "ArrowRight") onChange(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onChange, onClose]);

  return (
    <div className="media-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button ref={closeRef} type="button" className="media-lightbox-close" aria-label="Close" onClick={onClose}>✕</button>
      <button type="button" className="media-lightbox-arrow prev" aria-label="Previous photo" onClick={() => onChange(prev)}>←</button>
      <figure onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={photo.src} alt={photo.alt} />
        <figcaption>{index + 1} / {photos.length}</figcaption>
      </figure>
      <button type="button" className="media-lightbox-arrow next" aria-label="Next photo" onClick={() => onChange(next)}>→</button>
    </div>
  );
}

function VideoCarousel({ videos }) {
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeOption, setActiveOption] = useState(0);
  const video = videos[activeVideo];
  const option = video.options[activeOption];
  const changeVideo = (index) => {
    setActiveVideo(index);
    setActiveOption(0);
  };

  return (
    <div className="media-player" role="region" aria-roledescription="carousel" aria-label="Videos">
      <div className="media-player-frame">
        <video
          key={option.src}
          src={option.src}
          controls
          playsInline
          preload="metadata"
          loop={video.loop}
          muted={video.loop}
          autoPlay={video.loop}
          onTimeUpdate={option.trimEnd ? (e) => {
            const v = e.currentTarget;
            if (!v.duration || v.currentTime < v.duration - option.trimEnd) return;
            if (video.loop) v.currentTime = 0;
            else v.pause();
          } : undefined}
        />
      </div>
      {video.options.length > 1 && (
        <div className="media-tabs" role="tablist" aria-label={video.loop ? "Shot" : "Camera angle"}>
          {video.options.map((opt, index) => (
            <button key={opt.label} type="button" role="tab" aria-selected={index === activeOption} onClick={() => setActiveOption(index)}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
      <div className="media-player-info">
        <div>
          <h3 aria-live="polite">{video.title}</h3>
          {video.description && <p>{video.description}</p>}
        </div>
        {video.link && (
          <a className="fight-watch" href={video.link} target="_blank" rel="noopener noreferrer">
            View on BrettZone →
          </a>
        )}
      </div>
      {videos.length > 1 && (
        <div className="fight-controls fight-match-controls">
          <button type="button" aria-label="Previous video" onClick={() => changeVideo((activeVideo - 1 + videos.length) % videos.length)}>←</button>
          <span>Video {activeVideo + 1} / {videos.length}</span>
          <button type="button" aria-label="Next video" onClick={() => changeVideo((activeVideo + 1) % videos.length)}>→</button>
        </div>
      )}
    </div>
  );
}

export default function Media() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  }, [hash]);

  return (
    <div style={{ background: "#0F1108", minHeight: "100vh", overflowX: "hidden", fontFamily: "'Inter', sans-serif", color: "#E1E1E1" }}>
      <Scanlines />

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem 4vw 4rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem", opacity: 0.6 }}>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#E1E1E1" }}>
            WWSD
          </span>
          <div style={{ width: 40, height: 1, background: "#E93172" }} />
        </div>
        <GlitchText
          text="Combat Log"
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
        <p style={{ fontSize: "0.95rem", color: "rgba(225,225,225,0.45)", marginTop: "1.25rem", letterSpacing: "0.05em" }}>
          Photos and videos from every competition.
        </p>
      </section>

      {/* ── COMPETITION SECTIONS ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 4vw 8rem" }}>
        {competitions.map((comp, i) => (
          <section
            key={comp.id}
            id={comp.id}
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "4rem 0", background: i % 2 === 1 ? "rgba(233,49,114,0.02)" : "transparent" }}
          >
            {/* Section header */}
            <div style={{ marginBottom: "2.5rem" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E93172", display: "block", marginBottom: "0.5rem" }}>
                {comp.date}
              </span>
              <GlitchText
                text={comp.name}
                as="h2"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#E1E1E1",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              />
            </div>

            {/* Photos */}
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(225,225,225,0.35)", display: "block", marginBottom: "1rem" }}>
                Photos
              </span>
              {comp.photos.length > 0 ? (
                <PhotoCollage photos={comp.photos} />
              ) : (
                <div style={{
                  border: "1px dashed rgba(233,49,114,0.2)",
                  padding: "3rem 2rem",
                  textAlign: "center",
                  color: "rgba(225,225,225,0.2)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}>
                  Photos coming soon
                </div>
              )}
            </div>

            {/* Videos */}
            <div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(225,225,225,0.35)", display: "block", marginBottom: "1rem" }}>
                Videos
              </span>
              {comp.videos.length > 0 ? (
                <VideoCarousel videos={comp.videos} />
              ) : (
                <div style={{
                  border: "1px dashed rgba(233,49,114,0.2)",
                  padding: "3rem 2rem",
                  textAlign: "center",
                  color: "rgba(225,225,225,0.2)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}>
                  Videos coming soon
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
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
