import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound.js';

const navLinks = [
  { name: 'HOME', href: '#home' },
  { name: 'ABOUT', href: '#about' },
  { name: 'WORK', href: '#work' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
          const scrollPos = window.scrollY + 200;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const rect = el.getBoundingClientRect();
              const top = rect.top + window.scrollY;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const active = sound.toggle();
    setSoundEnabled(active);
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    sound.playClick();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      data-active-section={activeSection}
      className="fixed top-0 left-0 right-0 z-[1000] px-[var(--page-gutter)] py-5 md:py-6 bg-[var(--bg-base)] border-b border-[var(--border-default)] transition-colors duration-[var(--dur-base)]"
    >
      <div className="max-w-[var(--content-max-width)] w-full mx-auto flex items-center justify-between">
        
        {/* Monogram / Brand */}
        <a 
          href="#home" 
          onClick={(e) => scrollToSection(e, '#home')}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-3 text-caption tracking-mono-lg font-mono uppercase font-semibold text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)] cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]"></span>
          <span>SUJAIE / DEV</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-11">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                onMouseEnter={() => sound.playHover()}
                className="group relative py-1 text-xs font-mono tracking-mono-md font-medium transition-colors duration-[var(--dur-base)] cursor-pointer"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span className="group-hover:text-white transition-colors duration-[var(--dur-base)]">
                  {link.name}
                </span>
                
                {/* Active Underline Indicator */}
                <span 
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-[var(--color-accent)] transition-all duration-[var(--dur-slow)] ${
                    isActive ? 'w-full opacity-100 shadow-[var(--glow-gold-sm)]' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-60'
                  }`}
                />
              </a>
            );
          })}

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => sound.playHover()}
            title={soundEnabled ? "Mute interactive audio" : "Enable tactile synthesized sound"}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-default)] hover:border-[var(--color-accent)]/60 text-2xs font-mono tracking-mono-sm uppercase text-[var(--text-secondary)] hover:text-white transition-colors duration-[var(--dur-base)] cursor-pointer"
            aria-label="Toggle Sound"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundEnabled ? 'bg-[var(--color-status-success)] shadow-[0_0_6px_var(--color-status-success)]' : 'bg-white/20'}`} />
            <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </nav>

        {/* Mobile Menu & Sound Control */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="text-2xs font-mono tracking-wider px-2.5 py-1 rounded border border-[var(--border-default)] bg-black/40 text-[var(--text-secondary)]"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? 'SFX: ON' : 'SFX: OFF'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-xs tracking-mono-md uppercase text-[var(--text-primary)] px-3 py-1.5 rounded border border-[var(--border-default)] bg-black/40 backdrop-blur-md"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 p-6 bg-[var(--bg-raised)]/98 border border-[var(--border-default)] rounded-[var(--radius-lg)] backdrop-blur-xl flex flex-col gap-4 shadow-[var(--shadow-modal)]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-xs tracking-mono-lg font-mono uppercase font-medium text-[var(--text-secondary)] hover:text-[var(--color-accent)] py-2 border-b border-[var(--border-subtle)] cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
