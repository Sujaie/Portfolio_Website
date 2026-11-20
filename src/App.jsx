import React, { useState, useEffect } from 'react';
import GlobalCursorMagnifier from './components/GlobalCursorMagnifier.jsx';
import Navbar from './components/Navbar.jsx';
import StyleGuide from './components/StyleGuide.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import Skills from './sections/Skills.jsx';
import Experience from './sections/Experience.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') return 'portfolio';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('styleguide') || hash.includes('styleguide') ? 'styleguide' : 'portfolio';
  });

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setRoute(path.includes('styleguide') || hash.includes('styleguide') ? 'styleguide' : 'portfolio');
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleBackToPortfolio = () => {
    if (window.history?.pushState) {
      window.history.pushState(null, '', '/');
    }
    setRoute('portfolio');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen selection:bg-[var(--color-accent)]/30 selection:text-white">
      {/* GLOBAL ATMOSPHERIC BACKGROUND LAYER (Compositor-only, persistent behind all content) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        style={{ transform: 'translateZ(0)' }}
        aria-hidden="true"
      >
        {/* Top-Right Navy/Slate Ambient Well */}
        <div
          className="absolute top-[-10%] right-[-5%] w-[750px] md:w-[1000px] h-[750px] md:h-[1000px] rounded-full blur-[160px] opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--ambient-navy) 0%, transparent 70%)',
          }}
        />

        {/* Center-Left Deep Blue Atmospheric Well */}
        <div
          className="absolute top-[35%] left-[-10%] w-[650px] md:w-[900px] h-[650px] md:h-[900px] rounded-full blur-[150px] opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--ambient-blue) 0%, transparent 70%)',
          }}
        />

        {/* Bottom-Right Subtle Teal/Cyan Well */}
        <div
          className="absolute bottom-[-10%] right-[10%] w-[550px] md:w-[800px] h-[550px] md:h-[800px] rounded-full blur-[140px] opacity-15 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--teal-900) 0%, transparent 70%)',
          }}
        />

        {/* Subtle SVG Fractal Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      </div>

      {/* Exactly ONE Global Glass Magnifier Lens Active Across the Entire Website */}
      <GlobalCursorMagnifier />

      {route === 'styleguide' ? (
        <div className="relative z-10">
          <StyleGuide onBack={handleBackToPortfolio} />
        </div>
      ) : (
        <>
          {/* Minimal Fixed Top Navigation */}
          <Navbar />

          {/* Main Scrollable Content */}
          <main className="relative z-10 w-full">
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
}
