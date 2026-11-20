import React, { useState, useEffect, useRef } from 'react';
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

  const navRef = useRef(null);
  const linkRefs = useRef({});
  const mobileToggleRef = useRef(null);
  const firstMobileLinkRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    transform: 'translate3d(0, 0, 0)',
    width: '0px',
    opacity: 0,
  });

  // 1. IntersectionObserver for smooth, flicker-free active section detection
  useEffect(() => {
    const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
    const sectionElements = sections.map((id) => document.getElementById(id)).filter(Boolean);

    if (!sectionElements.length) return;

    // Viewport focal region: 80px below navbar down to 60% of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by distance to top of viewport
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          const dominant = visibleEntries[0].target.id;
          setActiveSection((prev) => (prev !== dominant ? dominant : prev));
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Edge guard for top & bottom bounds
    const handleScrollEdges = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY <= 50) {
        setActiveSection((prev) => (prev !== 'home' ? 'home' : prev));
      } else if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        setActiveSection((prev) => (prev !== 'contact' ? 'contact' : prev));
      }
    };

    window.addEventListener('scroll', handleScrollEdges, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollEdges);
    };
  }, []);

  // 2. Single sliding underline indicator positioning (transforms + width)
  useEffect(() => {
    const updateIndicator = () => {
      const activeLink = linkRefs.current[activeSection];
      if (activeLink && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const left = linkRect.left - navRect.left;
        const width = linkRect.width;

        setIndicatorStyle({
          transform: `translate3d(${left}px, 0, 0)`,
          width: `${width}px`,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  // 3. Mobile menu keyboard accessibility & focus management
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first link on open
      setTimeout(() => firstMobileLinkRef.current?.focus(), 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
          mobileToggleRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

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
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      if (window.history?.replaceState) {
        window.history.replaceState(null, '', href);
      }
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      mobileToggleRef.current?.focus();
    }
  };

  return (
    <header
      id="main-navbar"
      data-active-section={activeSection}
      className="fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] px-[var(--page-gutter)] bg-[var(--bg-base)] border-b border-[var(--border-default)] transition-colors duration-[var(--dur-base)] flex items-center"
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

        {/* Desktop Navigation with Single Sliding Indicator */}
        <nav
          ref={navRef}
          aria-label="Primary Navigation"
          className="relative hidden md:flex items-center gap-8 lg:gap-11 py-2"
        >
          {navLinks.map((link) => {
            const sectionKey = link.href.slice(1);
            const isActive = activeSection === sectionKey;
            return (
              <a
                key={link.name}
                ref={(el) => (linkRefs.current[sectionKey] = el)}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                onMouseEnter={() => sound.playHover()}
                className={`group relative py-1 text-xs font-mono tracking-mono-md font-medium transition-colors duration-[var(--dur-base)] cursor-pointer ${
                  isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <span>{link.name}</span>
              </a>
            );
          })}

          {/* Single Reusable Sliding Underline Indicator */}
          <span
            className="absolute bottom-0 left-0 h-[1.5px] bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)] transition-[transform,width,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)] pointer-events-none"
            style={indicatorStyle}
            aria-hidden="true"
          />

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => sound.playHover()}
            title={soundEnabled ? "Mute interactive audio" : "Enable tactile synthesized sound"}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-default)] hover:border-[var(--color-accent)]/60 text-2xs font-mono tracking-mono-sm uppercase text-[var(--text-secondary)] hover:text-white transition-colors duration-[var(--dur-base)] cursor-pointer ml-2"
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
            ref={mobileToggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label="Toggle Navigation Menu"
            className="text-xs tracking-mono-md uppercase text-[var(--text-primary)] px-3 py-1.5 rounded border border-[var(--border-default)] bg-black/40 backdrop-blur-md cursor-pointer"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden fixed inset-x-0 top-[var(--nav-height)] p-6 bg-[var(--bg-raised)]/98 border-b border-[var(--border-default)] backdrop-blur-xl shadow-[var(--shadow-modal)] flex flex-col gap-2"
        >
          {navLinks.map((link, idx) => {
            const sectionKey = link.href.slice(1);
            const isActive = activeSection === sectionKey;
            return (
              <a
                key={link.name}
                ref={idx === 0 ? firstMobileLinkRef : null}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-xs tracking-mono-lg font-mono uppercase font-medium py-3 border-b border-[var(--border-subtle)] flex items-center justify-between cursor-pointer transition-colors duration-[var(--dur-base)] ${
                  isActive
                    ? 'text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
                )}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
