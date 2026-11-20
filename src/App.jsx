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
      {/* Exactly ONE Global Glass Magnifier Lens Active Across the Entire Website */}
      <GlobalCursorMagnifier />

      {route === 'styleguide' ? (
        <StyleGuide onBack={handleBackToPortfolio} />
      ) : (
        <>
          {/* Minimal Fixed Top Navigation */}
          <Navbar />

          {/* Main Scrollable Content */}
          <main data-magnifier-source className="w-full">
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
