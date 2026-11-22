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
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.slice(1);
      if (['home', 'about', 'work', 'skills', 'experience', 'contact'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => sound.isEnabled());

  const navRef = useRef(null);
  const linkRefs = useRef({});
  const mobileToggleRef = useRef(null);
  const firstMobileLinkRef = useRef(null);
  const isClickScrollingRef = useRef(false);
  const clickScrollTimerRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    transform: 'translate3d(0, 0, 0)',
    width: '0px',
    opacity: 0,
  });

  // 1. Precise active section detection based on reading focal plane (~140px below fixed nav)
  const determineActiveSection = () => {
    if (isClickScrollingRef.current) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const windowHeight = window.innerHeight || 800;
    const maxScroll = Math.max(0, scrollHeight - windowHeight);

    // Edge guard: top of page (<= 50px) is strictly 'home'
    if (scrollY <= 50) {
      setActiveSection((prev) => (prev !== 'home' ? 'home' : prev));
      return;
    }

    // Edge guard: bottom of page (within 50px of document bottom) is strictly 'contact'
    if (maxScroll > 0 && scrollY >= maxScroll - 50) {
      setActiveSection((prev) => (prev !== 'contact' ? 'contact' : prev));
      return;
    }

    const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
    // Reading focal point: 140px below fixed navbar
    const focalY = scrollY + 140;

    let dominantSection = 'home';
    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const top = el.getBoundingClientRect().top + scrollY;
        if (focalY >= top) {
          dominantSection = sections[i];
        } else {
          break;
        }
      }
    }

    setActiveSection((prev) => (prev !== dominantSection ? dominantSection : prev));
  };

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          determineActiveSection();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', determineActiveSection, { passive: true });

    // Handle initial hash on page load if present (e.g. #experience)
    if (window.location.hash) {
      const hashTarget = window.location.hash.slice(1);
      const targetEl = document.getElementById(hashTarget);
      if (targetEl) {
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        const targetPos = Math.max(0, targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight);
        window.scrollTo({ top: targetPos, behavior: 'instant' });
      }
    }

    determineActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', determineActiveSection);
      if (rafId) cancelAnimationFrame(rafId);
      if (clickScrollTimerRef.current) clearTimeout(clickScrollTimerRef.current);
    };
  }, []);

  // 2. Sliding underline indicator positioning (transforms + width)
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
    if (document.fonts?.ready) {
      document.fonts.ready.then(updateIndicator);
    }
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  // 3. Mobile menu keyboard accessibility & focus management
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
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

    // Immediately indicate the clicked section
    setActiveSection(targetId);

    // Lock scroll tracking for 850ms so intermediate sections don't cause jitter
    isClickScrollingRef.current = true;
    if (clickScrollTimerRef.current) clearTimeout(clickScrollTimerRef.current);
    clickScrollTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
      determineActiveSection();
    }, 850);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'instant' : 'smooth' });
      if (window.history?.replaceState) {
        window.history.replaceState(null, '', href);
      }
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - navHeight);

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReduced ? 'instant' : 'smooth',
        });

        if (window.history?.replaceState) {
          window.history.replaceState(null, '', href);
        }
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
      className="fixed top-0 left-0 right-0 z-[1000] h-[var(--nav-height)] px-[var(--page-gutter)] bg-[var(--bg-base)]/95 backdrop-blur-md border-b border-[var(--border-default)] transition-colors duration-[var(--dur-base)] flex items-center"
    >
      <div className="max-w-[var(--content-max-width)] w-full mx-auto flex items-center justify-between">
        
        {/* Monogram / Brand */}
        <a 
          href="#home" 
          aria-label="Sujaie Developer Portfolio Home"
          onClick={(e) => scrollToSection(e, '#home')}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-3 text-caption tracking-mono-lg font-mono uppercase font-semibold text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)] cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
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
                aria-current={isActive ? 'page' : undefined}
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
            className="absolute bottom-0 left-0 h-[1.5px] bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)] transition-[transform,width,opacity] duration-[var(--dur-base)] ease-[var(--ease-standard)] pointer-events-none"
            style={indicatorStyle}
            aria-hidden="true"
          />

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => sound.playHover()}
            title={soundEnabled ? "Mute interactive audio" : "Enable tactile synthesized sound"}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? "Mute interactive sound effects" : "Enable tactile synthesized sound effects"}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-default)] hover:border-[var(--color-accent)]/60 text-2xs font-mono tracking-mono-sm uppercase text-[var(--text-secondary)] hover:text-white transition-colors duration-[var(--dur-base)] cursor-pointer ml-2"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundEnabled ? 'bg-[var(--color-status-success)] shadow-[0_0_6px_var(--color-status-success)]' : 'bg-white/20'}`} />
            <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </nav>

        {/* Mobile Menu & Sound Control */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? "Mute interactive sound effects" : "Enable tactile synthesized sound effects"}
            className="text-2xs font-mono tracking-wider px-2.5 py-1 rounded border border-[var(--border-default)] bg-black/40 text-[var(--text-secondary)]"
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
                aria-current={isActive ? 'page' : undefined}
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
