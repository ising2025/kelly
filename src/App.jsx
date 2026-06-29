import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import About from "./About";
import Contact from "./Contact";
import Media from "./Media";
import Support from "./Support";
import Navbar from './Navbar';
import Home from './Home';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    window.requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, left: 0, behavior: "auto" });
    });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter basename="/kelly">
      <ScrollManager />
      <Navbar />
      {/* Add a wrapper with pt-24 (matching your navbar h-24) */}
      <div className="pt-24"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media" element={<Media />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
