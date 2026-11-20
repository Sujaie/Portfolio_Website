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
      className="fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12 lg:px-16 py-5 md:py-6 bg-[#050609] border-b border-white/10 transition-colors duration-200"
    >
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
        
        {/* Monogram / Brand */}
        <a 
          href="#home" 
          onClick={(e) => scrollToSection(e, '#home')}
          onMouseEnter={() => sound.playHover()}
          className="flex items-center gap-3 text-xs tracking-[0.25em] font-mono uppercase font-semibold text-[#F4F3F0] hover:text-[#E9A927] transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#E9A927] shadow-[0_0_8px_#E9A927]"></span>
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
                className="group relative py-1 text-[11px] font-mono tracking-[0.2em] font-medium transition-colors cursor-pointer"
                style={{
                  color: isActive ? '#F4F3F0' : '#A8ABB2',
                }}
              >
                <span className="group-hover:text-white transition-colors">
                  {link.name}
                </span>
                
                {/* Active Underline Indicator */}
                <span 
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#E9A927] transition-all duration-300 ${
                    isActive ? 'w-full opacity-100 shadow-[0_0_8px_#E9A927]' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-60'
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
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 hover:border-[#E9A927]/60 text-[10px] font-mono tracking-widest uppercase text-[#A8ABB2] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Sound"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundEnabled ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-white/20'}`} />
            <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>
        </nav>

        {/* Mobile Menu & Sound Control */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded border border-white/10 bg-black/40 text-[#A8ABB2]"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? 'SFX: ON' : 'SFX: OFF'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[11px] tracking-[0.2em] uppercase text-[#F4F3F0] px-3 py-1.5 rounded border border-white/10 bg-black/40 backdrop-blur-md"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 p-6 bg-[#080D14]/98 border border-white/10 rounded-xl backdrop-blur-xl flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-xs tracking-[0.25em] font-mono uppercase font-medium text-[#A8ABB2] hover:text-[#E9A927] py-2 border-b border-white/5 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
