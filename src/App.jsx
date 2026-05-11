import { BrowserRouter, Routes, Route } from "react-router-dom";

import About from "./about";
import Contact from "./contact";
import Media from "./media";
import Support from "./support";
import Navbar from './navbar';
import Home from './home';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/media" element={<Media />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;