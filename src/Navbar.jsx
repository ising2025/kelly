// Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "ABOUT", path: "/about" },
  { name: "MEDIA", path: "/media" },
  { name: "SUPPORT US", path: "/support" },
  { name: "CONTACT", path: "/contact" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 z-50 w-full">

      {/* Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

      {/* Red glow line */}
      <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#E93172]/50 to-transparent" />

      <div className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)} className="group relative z-50">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.6em] text-[#E93172]">
              NHRL
            </span>
            <span className="text-3xl font-black tracking-[0.2em] text-white transition duration-300 group-hover:text-[#E93172]">
              WWSD
            </span>
          </div>
          <div className="absolute -inset-4 -z-10 rounded-full bg-[#E93172]/0 blur-2xl transition duration-500 group-hover:bg-[#E93172]/20" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`group relative py-2 text-sm uppercase tracking-[0.3em] transition duration-300 ${
                  isActive ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-[#E93172] transition-all duration-500 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-50 flex md:hidden flex-col justify-center items-center w-10 h-10 gap-[6px] group"
        >
          <span
            className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${
              menuOpen ? "w-6 translate-y-[7.5px] rotate-45 bg-[#E93172]" : "w-6"
            }`}
          />
          <span
            className={`block h-[1.5px] bg-white transition-all duration-300 ${
              menuOpen ? "w-0 opacity-0" : "w-5"
            }`}
          />
          <span
            className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${
              menuOpen ? "w-6 -translate-y-[7.5px] -rotate-45 bg-[#E93172]" : "w-4"
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col transition-all duration-500 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#0F1108]/95 backdrop-blur-2xl" />

        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(182,26,102,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Links */}
        <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-2 pt-24">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${i * 60 + 80}ms` : "0ms",
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: "transform 0.4s ease, opacity 0.4s ease",
                }}
                className={`relative px-8 py-5 text-2xl uppercase tracking-[0.3em] font-black transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {/* Active / hover underline */}
                <span
                  className={`absolute bottom-3 left-8 right-8 h-[1px] bg-[#E93172] transition-all duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}

          {/* Divider + social hint */}
          <div
            style={{
              transitionDelay: menuOpen ? "340ms" : "0ms",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
              transition: "transform 0.4s ease, opacity 0.4s ease",
            }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <div className="h-px w-12 bg-[#E93172]/40" />
            <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase">
              WWSD
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
