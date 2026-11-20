import React from 'react';
import GlobalCursorMagnifier from './components/GlobalCursorMagnifier.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import Skills from './sections/Skills.jsx';
import Experience from './sections/Experience.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  return (
    <div className="relative bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen selection:bg-[var(--color-accent)]/30 selection:text-white">
      {/* Exactly ONE Global Glass Magnifier Lens Active Across the Entire Website */}
      <GlobalCursorMagnifier />

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
    </div>
  );
}
