// navbar.tsx
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Media", path: "/media" },
  { name: "Support", path: "/support" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-black transition hover:opacity-80"
        >
          Lil Bro
        </Link>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}