import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolio.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { sound } from '../utils/sound.js';

/**
 * Tab Content Definition for About Section Right-Hand Card
 * Easily editable array containing content, metrics, tags, and links for each domain.
 */
export const ABOUT_TABS = [
  {
    id: 'builder',
    label: 'BUILDER',
    terminal: {
      filename: 'artinova.pipeline',
      status: '● SIH 2026 · INTERNAL FINALIST',
    },
    stats: [
      { label: 'ROLE', value: 'Team Lead', isNumeric: false },
      { label: 'AI FEATURES', value: 5, isNumeric: true },
      { label: 'STATUS', value: 'Working App', isNumeric: false },
    ],
    title: 'ArtiNova',
    subtitle: 'AI Commerce Platform for Artisans',
    description:
      "Turns a product photo and a few spoken words into a polished, priced online listing, in the artisan's own language. Built for SIH 2026, where we made it to the internal finals.",
    featureChips: [
      'Image Enhancement',
      'Multilingual Voice Cataloguing',
      'Smart Cataloguing',
      'Price Recommendations',
      'Market Recommendations',
    ],
    tags: ['Flutter', 'FastAPI', 'PostgreSQL', 'Ollama'],
    links: {
      primary: { label: 'VIEW PROJECT →', href: '#work' },
      // TODO: add repo URL
      secondary: { label: 'GITHUB ↗', href: '#' },
    },
  },
  {
    id: 'leader',
    label: 'LEADER',
    terminal: {
      filename: 'leadership.log',
      status: '● ACTIVE',
    },
    stats: [
      { label: 'NCC RANK', value: 'Leading Cadet', isNumeric: false },
      { label: 'CAMPS', value: 'NTAC + CATC', isNumeric: false },
      { label: 'TEAM ROLE', value: 'SIH Lead', isNumeric: false },
    ],
    title: 'Leading in Code and in Uniform',
    subtitle: 'SIH Team · NCC Navy Wing',
    description:
      'I led ideation, problem analysis and planning for my SIH team, and serve as a Leading Cadet in the NCC Navy wing, with camps at INS Shivaji, Mumbai and CATC, Chennai.',
    tags: ['Teamwork', 'Discipline', 'Planning', 'Public Speaking'],
    links: {
      primary: { label: 'SEE EXPERIENCE →', href: '#experience' },
    },
  },
  {
    id: 'learner',
    label: 'LEARNER',
    terminal: {
      filename: 'learning.log',
      status: '● IN PROGRESS',
    },
    stats: [
      { label: 'SEMESTER', value: '4 of 8', isNumeric: false },
      { label: 'CERTIFICATES', value: 3, isNumeric: true },
      { label: 'BUILDING NOW', value: 'DevAtlas', isNumeric: false },
    ],
    title: 'Always Building the Next Thing',
    subtitle: 'B.E. CSE · SVCE Chennai · 2025–29',
    description:
      "Certified in C (Infosys Springboard), MongoDB and Python fundamentals. Right now I'm building DevAtlas, a React-based tool that helps developers navigate and understand unfamiliar code repositories faster.",
    tags: ['Data Structures', 'DBMS', 'OOP', 'Data Mining'],
    links: {
      // TODO: add certificates URL
      primary: { label: 'VIEW CERTIFICATES →', href: '#' },
    },
  },
  {
    id: 'beyond-code',
    label: 'BEYOND CODE',
    terminal: {
      filename: 'off-duty.log',
      status: '● ONLINE',
    },
    stats: [
      { label: 'STAGE', value: 'Speaker & Host', isNumeric: false },
      { label: 'EVENTS', value: 'Cultural Organiser', isNumeric: false },
      { label: 'ENDURANCE', value: 'Up to 10 km', isNumeric: false },
    ],
    title: 'Not Just a Screen Person',
    subtitle: 'Speaking · Events · Running',
    description:
      'I enjoy speaking on stage, organising and hosting cultural events, and endurance running, with marathon-event distances up to 10 km.',
    tags: ['Public Speaking', 'Event Management', 'Running'],
    links: {
      primary: { label: "LET'S TALK →", href: '#contact' },
    },
  },
];

/* =========================================================================
   MINI VISUAL 1: Pipeline of 5 Nodes (Tab 1: BUILDER)
   PHOTO → ENHANCE → VOICE CATALOGUE → PRICE → MARKET
   Glowing dot travels in a loop, nodes light teal as dot passes.
   ========================================================================= */
function PipelineVisual({ prefersReduced }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 700);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  const nodes = ['PHOTO', 'ENHANCE', 'VOICE CATALOGUE', 'PRICE', 'MARKET'];

  return (
    <div className="w-full py-2.5 px-3 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] my-3">
      <div className="flex items-center justify-between text-2xs font-mono text-[var(--text-secondary)] uppercase mb-2">
        <span className="flex items-center gap-1.5 text-[var(--color-data)] font-medium">
          <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-data)] ${prefersReduced ? '' : 'animate-ping'}`} />
          Autonomous Listing Pipeline
        </span>
        <span className="text-2xs font-mono text-[var(--text-tertiary)]">SIH Workflow</span>
      </div>
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
        {nodes.map((node, i) => {
          const isActive = prefersReduced ? true : i === activeStep;
          return (
            <React.Fragment key={node}>
              <div
                className={`relative px-2 py-1 rounded-[var(--radius-sm)] border text-2xs font-mono uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'border-[var(--color-data)] bg-[var(--color-data)]/15 text-white shadow-[0_0_12px_rgba(53,214,223,0.35)] font-semibold'
                    : 'border-[var(--border-subtle)] bg-white/5 text-[var(--text-tertiary)]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-[var(--color-data)] shadow-[0_0_6px_var(--color-data)]' : 'bg-white/20'
                  }`}
                />
                <span>{node}</span>
              </div>
              {i < nodes.length - 1 && (
                <span className="text-[var(--color-data)]/50 text-2xs font-mono shrink-0 select-none">
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   MINI VISUAL 2: Two-Lane Timeline (Tab 2: LEADER)
   CODE lane: SIH 2026
   UNIFORM lane: NTAC at INS Shivaji (Mumbai), CATC (Chennai)
   Dots appear sequentially and pulse softly.
   ========================================================================= */
function TimelineVisual({ prefersReduced }) {
  const [revealed, setRevealed] = useState(prefersReduced ? [true, true, true] : [false, false, false]);

  useEffect(() => {
    if (prefersReduced) return;
    const t1 = setTimeout(() => setRevealed([true, false, false]), 100);
    const t2 = setTimeout(() => setRevealed([true, true, false]), 350);
    const t3 = setTimeout(() => setRevealed([true, true, true]), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [prefersReduced]);

  return (
    <div className="w-full py-2.5 px-3 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] my-3 space-y-2.5">
      {/* CODE Lane */}
      <div className="flex items-center gap-3">
        <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-data)]/10 border border-[var(--color-data)]/30 text-[var(--color-data)] w-16 text-center uppercase tracking-wider shrink-0">
          CODE
        </span>
        <div className="relative flex-1 h-[1px] bg-[var(--border-default)] flex items-center">
          <div
            className={`flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--color-data)]/40 px-2 py-0.5 rounded-full text-2xs font-mono text-white transition-all duration-300 ml-4 sm:ml-8 ${
              revealed[0] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-data)] ${prefersReduced ? '' : 'animate-ping'}`} />
            <span>SIH 2026 · Team Lead</span>
          </div>
        </div>
      </div>

      {/* UNIFORM Lane */}
      <div className="flex items-center gap-3">
        <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] w-16 text-center uppercase tracking-wider shrink-0">
          UNIFORM
        </span>
        <div className="relative flex-1 h-[1px] bg-[var(--border-default)] flex items-center justify-between sm:justify-start sm:gap-4 overflow-hidden">
          <div
            className={`flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--color-accent)]/40 px-2 py-0.5 rounded-full text-2xs font-mono text-white transition-all duration-300 ${
              revealed[1] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] ${prefersReduced ? '' : 'animate-pulse'}`} />
            <span className="truncate max-w-[120px] sm:max-w-none">NTAC · INS Shivaji</span>
          </div>
          <div
            className={`flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--color-accent)]/40 px-2 py-0.5 rounded-full text-2xs font-mono text-white transition-all duration-300 ${
              revealed[2] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] ${prefersReduced ? '' : 'animate-pulse'}`} />
            <span>CATC · Chennai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MINI VISUAL 3: 8-Segment Semester Progress Bar (Tab 3: LEARNER)
   1-4 filled in teal, 5th pulsing in gold, 6-8 dim.
   ========================================================================= */
function SemesterVisual({ prefersReduced }) {
  return (
    <div className="w-full py-2.5 px-3 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] my-3">
      <div className="flex items-center justify-between text-2xs font-mono uppercase text-[var(--text-secondary)] mb-2">
        <span className="flex items-center gap-1.5 text-[var(--color-accent)] font-medium">
          <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] ${prefersReduced ? '' : 'animate-pulse'}`} />
          B.E. CSE Academic Trajectory
        </span>
        <span className="text-[var(--text-primary)] font-medium font-mono text-2xs">Semester 4 of 8</span>
      </div>
      <div className="grid grid-cols-8 gap-1.5 py-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
          let styleClass = '';
          if (sem <= 4) {
            styleClass = 'bg-[var(--color-data)] text-black shadow-[0_0_8px_rgba(53,214,223,0.3)]';
          } else if (sem === 5) {
            styleClass = `bg-[var(--color-accent)] text-black ${prefersReduced ? '' : 'animate-pulse'} shadow-[0_0_10px_rgba(240,189,88,0.5)]`;
          } else {
            styleClass = 'bg-white/10 text-white/30 border border-white/5';
          }

          return (
            <div key={sem} className="flex flex-col items-center gap-1">
              <div className={`w-full h-2.5 rounded-sm transition-all duration-300 ${styleClass}`} />
              <span className="text-2xs font-mono text-[var(--text-tertiary)]">S{sem}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   MINI VISUAL 4: Running Track Loop with Circling Dot (Tab 4: BEYOND CODE)
   SVG stadium track loop with continuously orbiting dot and 10 KM marker.
   ========================================================================= */
function RunningTrackVisual({ prefersReduced }) {
  return (
    <div className="w-full py-2 px-3 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] my-3 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-2xs font-mono uppercase text-[var(--color-data)] tracking-wider flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)]" />
          Endurance Circuit
        </span>
        <span className="text-xs text-[var(--text-secondary)] font-light">Long-Distance Road & Track</span>
      </div>

      <div className="relative flex items-center justify-center shrink-0 w-[180px] sm:w-[220px] h-[50px]">
        <svg viewBox="0 0 220 50" className="w-full h-full overflow-visible">
          {/* Track Outer Oval */}
          <rect
            x="4"
            y="4"
            width="212"
            height="42"
            rx="21"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Track Inner Border */}
          <rect
            x="14"
            y="13"
            width="192"
            height="24"
            rx="12"
            fill="none"
            stroke="rgba(53, 214, 223, 0.15)"
            strokeWidth="1"
          />

          {/* Animated Runner Dot */}
          {!prefersReduced ? (
            <circle r="4" fill="var(--color-data)" className="filter drop-shadow-[0_0_6px_var(--color-data)]">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 25 4 H 195 A 21 21 0 0 1 195 46 H 25 A 21 21 0 0 1 25 4 Z"
              />
            </circle>
          ) : (
            <circle cx="195" cy="4" r="4" fill="var(--color-data)" />
          )}

          {/* 10 KM Milestone Badge */}
          <g transform="translate(110, 25)">
            <rect x="-24" y="-9" width="48" height="18" rx="9" fill="#050810" stroke="var(--color-accent)" strokeWidth="1" />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-accent)"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="0.08em"
            >
              10 KM
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* =========================================================================
   STAT TILE WITH NUMERIC COUNT-UP & FADE-IN
   Smooth count-up (~600ms) for numbers; gentle fade-in for text.
   ========================================================================= */
function StatTile({ stat, prefersReduced, activeIndex }) {
  const [val, setVal] = useState(prefersReduced ? stat.value : (stat.isNumeric ? 0 : stat.value));

  useEffect(() => {
    if (!stat.isNumeric || prefersReduced) {
      setVal(stat.value);
      return;
    }

    setVal(0);
    const target = Number(stat.value);
    const duration = 600;
    const steps = 15;
    const stepTime = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const current = Math.round((step / steps) * target);
      setVal(current);
      if (step >= steps) {
        setVal(target);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [stat, prefersReduced, activeIndex]);

  return (
    <div className="p-2.5 sm:p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)]/90 border border-[var(--border-subtle)] flex flex-col justify-between">
      <div className="text-2xs font-mono text-[var(--text-secondary)] uppercase truncate">
        {stat.label}
      </div>
      <div className="text-sm sm:text-base font-semibold text-[var(--color-accent)] mt-1 font-mono truncate">
        {stat.isNumeric ? val : stat.value}
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN ABOUT COMPONENT
   ========================================================================= */
export default function About() {
  const { about } = portfolioData;
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const editorialRef = useRef(null);
  const scanLineRef = useRef(null);
  const isRevealedRef = useRef(false);
  const prefersReduced = useReducedMotion();

  // Auto-rotation & User Interaction Tracking
  const hasUserInteracted = useRef(false);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const autoRotateTimerRef = useRef(null);
  const cardRef = useRef(null);

  // Typewriter effect state for terminal filename (~25ms per char)
  const currentTab = ABOUT_TABS[activeIndex];
  const [typewrittenFilename, setTypewrittenFilename] = useState(
    prefersReduced ? currentTab.terminal.filename : ''
  );

  useEffect(() => {
    if (prefersReduced) {
      setTypewrittenFilename(currentTab.terminal.filename);
      return;
    }

    setTypewrittenFilename('');
    let i = 0;
    const fullText = currentTab.terminal.filename;
    const interval = setInterval(() => {
      i++;
      setTypewrittenFilename(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentTab.terminal.filename, prefersReduced]);

  // Entrance signature: scan-line wipe & editorial brightening
  useEffect(() => {
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealedRef.current && editorialRef.current) {
            isRevealedRef.current = true;

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            if (scanLineRef.current) {
              tl.fromTo(
                scanLineRef.current,
                { top: '0%', opacity: 0.8 },
                { top: '100%', opacity: 0, duration: 1.2, ease: 'power1.inOut' }
              );
            }

            tl.fromTo(
              '.about-lead-text',
              { opacity: 0.35, y: 8 },
              { opacity: 1, y: 0, duration: 0.8 },
              0.1
            );

            tl.fromTo(
              '.about-paragraph',
              { opacity: 0.35, y: 6 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
              0.3
            );

            if (editorialRef.current?.querySelector('.about-highlight-title')) {
              tl.fromTo(
                '.about-highlight-title',
                { opacity: 0, y: 5 },
                { opacity: 1, y: 0, duration: 0.4 },
                0.55
              );
            }

            tl.fromTo(
              '.about-highlight-pill',
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08 },
              0.6
            );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReduced]);

  // Tab switching with vertical crossfade (~300ms)
  const handleSlideChange = (newIndex) => {
    if (newIndex === activeIndex) return;

    if (prefersReduced) {
      setActiveIndex(newIndex);
      return;
    }

    gsap.to('.showcase-active-content', {
      opacity: 0,
      y: newIndex > activeIndex ? -12 : 12,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(newIndex);
        gsap.fromTo(
          '.showcase-active-content',
          { opacity: 0, y: newIndex > activeIndex ? 12 : -12 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      },
    });
  };

  // User-initiated tab switch: stops auto-rotation permanently and plays SFX
  const handleUserSlideChange = (newIndex) => {
    hasUserInteracted.current = true;
    if (autoRotateTimerRef.current) {
      clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    sound.playClick();
    handleSlideChange(newIndex);
  };

  // Auto-rotate every 8s until user interacts manually
  useEffect(() => {
    if (prefersReduced) return;

    const startTimer = () => {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = setInterval(() => {
        if (!hasUserInteracted.current && !isHoveredRef.current && !isFocusedRef.current) {
          setActiveIndex((prev) => (prev + 1) % ABOUT_TABS.length);
        }
      }, 8000);
    };

    startTimer();
    return () => {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
    };
  }, [prefersReduced]);

  const nextSlide = () => {
    handleUserSlideChange((activeIndex + 1) % ABOUT_TABS.length);
  };

  const prevSlide = () => {
    handleUserSlideChange((activeIndex - 1 + ABOUT_TABS.length) % ABOUT_TABS.length);
  };

  // Keyboard navigation: Left/Right arrows switch tabs
  const handleCardKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  };

  // Mobile Touch Swipe Handling
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] overflow-hidden bg-transparent border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[var(--grid-gap-lg)] items-start">
        
        {/* =========================================================================
            LEFT COLUMN: EDITORIAL INTRODUCTION & TWEAKS
            ========================================================================= */}
        <div ref={editorialRef} className="relative lg:col-span-5 flex flex-col justify-center">
          
          {/* Luminous Transmission Beam (Sweeps vertically when revealed) */}
          <div
            ref={scanLineRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-data)] to-transparent shadow-[var(--glow-cyan-sm)] opacity-0"
            style={{ willChange: 'top, opacity' }}
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--color-accent)] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
            <span>{about.badge}</span>
          </div>

          {/* Lead statement */}
          <h2 className="about-lead-text text-section-lead font-light tracking-tight text-[var(--text-primary)] mb-6 leading-section-lead">
            {about.lead} <br />
            <span className="font-serif italic text-[var(--color-accent)]">
              {about.headlineAccent || "Building useful"}
            </span>{' '}
            {about.headlineRest || "things with code & curiosity."}
          </h2>

          {/* Body paragraphs */}
          <div className="space-y-4 text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-lg">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="about-paragraph">{p}</p>
            ))}
          </div>

          {/* Technical focus pills ("INTEREST IN") */}
          <div className="mt-8 pt-6 border-t border-[var(--border-default)] flex flex-col gap-3">
            {about.highlightsTitle && (
              <div className="about-highlight-title inline-flex items-center gap-2 text-2xs font-mono tracking-mono-lg text-[var(--text-secondary)] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                <span>{about.highlightsTitle}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {about.highlights.map((item) => (
                <span
                  key={item}
                  className="about-highlight-pill text-xs font-mono tracking-mono-sm uppercase px-3 py-1.5 rounded-full bg-[var(--about-pill-bg)] border border-[var(--border-default)] text-[var(--text-primary)]"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Left Column CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#work"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-black font-mono text-2xs tracking-mono-sm uppercase font-semibold hover:bg-[var(--color-accent-hover)] transition-all shadow-[var(--glow-gold-sm)] cursor-pointer"
              >
                VIEW MY WORK →
              </a>
              {/* TODO: place PDF in /public */}
              <a
                href="/Resume_Sujaie.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-default)] bg-white/5 hover:border-[var(--color-accent)] text-[var(--text-secondary)] hover:text-white font-mono text-2xs tracking-mono-sm uppercase transition-colors cursor-pointer"
              >
                RESUME ↓
              </a>
            </div>

            {/* Left Column Quick-Facts Row */}
            <div className="mt-4 pt-4 border-t border-[var(--border-default)] grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-2xs font-mono tracking-mono-lg text-[var(--text-secondary)] uppercase">
                  BASED IN
                </span>
                <span className="text-xs text-[var(--text-primary)] font-light">
                  Chennai, India
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xs font-mono tracking-mono-lg text-[var(--text-secondary)] uppercase">
                  EDUCATION
                </span>
                <span className="text-xs text-[var(--text-primary)] font-light">
                  B.E. CSE · 2025–29
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xs font-mono tracking-mono-lg text-[var(--text-secondary)] uppercase">
                  FOCUS
                </span>
                <span className="text-xs text-[var(--text-primary)] font-light">
                  AI-Powered Apps
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xs font-mono tracking-mono-lg text-[var(--text-secondary)] uppercase">
                  STATUS
                </span>
                <span className="text-xs text-[var(--text-primary)] font-medium inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  Open to Internships
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: REWORKED TABBED CARD
            ========================================================================= */}
        <div className="relative lg:col-span-7">
          
          {/* Decorative Ambient Aura (strictly positioned behind card with lower z-index, non-intercepting) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 -right-8 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(53,214,223,0.12)_0%,rgba(13,30,54,0.18)_50%,transparent_75%)] blur-3xl -z-10 opacity-30 select-none"
          />

          {/* Interactive Card Container */}
          <div
            ref={cardRef}
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            onKeyDown={handleCardKeyDown}
            aria-label="Interactive portfolio dimension showcase card. Use Left and Right arrows to switch tabs."
            className="relative z-10 rounded-[var(--radius-xl)] bg-[var(--about-card-bg)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] backdrop-blur-2xl p-[var(--card-padding)] flex flex-col justify-between min-h-[530px] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-[min-height] duration-300"
          >
            
            {/* Top Bar: Categories & Controls */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[var(--border-default)] gap-2">
              <div
                role="tablist"
                aria-label="Profile Dimension Tabs"
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
              >
                {ABOUT_TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    role="tab"
                    id={`showcase-tab-${tab.id}`}
                    aria-selected={idx === activeIndex}
                    aria-controls={`showcase-panel-${tab.id}`}
                    onClick={() => handleUserSlideChange(idx)}
                    className={`text-2xs tracking-mono-md font-mono uppercase px-3 py-1.5 rounded-full transition-all duration-[var(--dur-slow)] cursor-pointer whitespace-nowrap ${
                      idx === activeIndex
                        ? 'bg-[var(--color-accent)] text-black font-semibold shadow-[var(--glow-gold-md)]'
                        : 'text-[var(--text-secondary)] hover:text-white bg-[var(--about-pill-bg)] hover:bg-[var(--about-pill-bg-hover)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--color-accent)] transition-colors duration-[var(--dur-base)] cursor-pointer relative z-20"
                  aria-label="Previous Project"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--color-accent)] transition-colors duration-[var(--dur-base)] cursor-pointer relative z-20"
                  aria-label="Next Project"
                >
                  →
                </button>
              </div>
            </div>

            {/* Active Content Stage (Animated) */}
            <div
              id={`showcase-panel-${currentTab.id}`}
              role="tabpanel"
              aria-labelledby={`showcase-tab-${currentTab.id}`}
              className="showcase-active-content my-4 sm:my-5 flex flex-col justify-between flex-1"
            >
              
              {/* Terminal Window Header */}
              <div className="relative w-full rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--surface-preview-start)] to-[var(--surface-preview-end)] border border-[var(--border-default)] p-3 sm:p-4 mb-4 overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2 mb-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--window-dot-red)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--window-dot-yellow)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--window-dot-green)]" />
                  </div>

                  {/* Typewritten Filename (Fixed min-height to prevent layout shift) */}
                  <div className="text-2xs tracking-wider text-[var(--text-secondary)] font-mono min-h-[16px] flex items-center justify-center px-2 truncate">
                    <span>{typewrittenFilename}</span>
                    {!prefersReduced && typewrittenFilename.length < currentTab.terminal.filename.length && (
                      <span className="text-[var(--color-data)] animate-pulse ml-0.5">_</span>
                    )}
                  </div>

                  <span className="text-2xs text-[var(--color-status-success)] font-mono flex items-center gap-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-status-success)] ${prefersReduced ? '' : 'animate-ping'}`} />
                    <span className="truncate max-w-[120px] sm:max-w-none">{currentTab.terminal.status}</span>
                  </span>
                </div>

                {/* 3 Stat Tiles */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 my-2">
                  {currentTab.stats.map((stat) => (
                    <StatTile
                      key={stat.label}
                      stat={stat}
                      prefersReduced={prefersReduced}
                      activeIndex={activeIndex}
                    />
                  ))}
                </div>

                {/* Mini Visual Area */}
                {currentTab.id === 'builder' && <PipelineVisual prefersReduced={prefersReduced} />}
                {currentTab.id === 'leader' && <TimelineVisual prefersReduced={prefersReduced} />}
                {currentTab.id === 'learner' && <SemesterVisual prefersReduced={prefersReduced} />}
                {currentTab.id === 'beyond-code' && <RunningTrackVisual prefersReduced={prefersReduced} />}
              </div>

              {/* Title & Gold Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                  {currentTab.title}
                </h3>
                <span className="text-xs sm:text-sm font-serif italic text-[var(--color-accent)] font-normal tracking-wide">
                  {currentTab.subtitle}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-3">
                {currentTab.description}
              </p>

              {/* Feature Chips for BUILDER tab */}
              {currentTab.featureChips && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {currentTab.featureChips.map((chip) => (
                    <span
                      key={chip}
                      className="text-2xs font-mono px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-data)]/10 text-[var(--color-data)] border border-[var(--color-data)]/25 tracking-wide"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              {/* Tech / Skill Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentTab.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-2xs tracking-mono-sm font-mono px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--about-tag-bg)] text-[var(--text-primary)] border border-[var(--border-default)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Slide Pagination Dots & Links */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)] gap-3 mt-auto">
              <div className="flex items-center gap-2">
                {ABOUT_TABS.map((tab, i) => (
                  <button
                    key={tab.id}
                    onClick={() => handleUserSlideChange(i)}
                    className={`h-1.5 rounded-full transition-all duration-[var(--dur-slow)] cursor-pointer ${
                      i === activeIndex ? 'w-6 bg-[var(--color-accent)]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Jump to tab ${tab.label}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm tracking-wider uppercase font-mono">
                {currentTab.links.secondary && (
                  /* TODO: add repo URL */
                  <a
                    href={currentTab.links.secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    onMouseEnter={() => sound.playHover()}
                    aria-label={`View ${currentTab.title} GitHub repository (opens in new tab)`}
                    className="text-[var(--text-secondary)] hover:text-white transition-colors duration-[var(--dur-base)]"
                  >
                    {currentTab.links.secondary.label}
                  </a>
                )}
                {currentTab.links.primary && (
                  currentTab.links.primary.href.startsWith('#') ? (
                    <a
                      href={currentTab.links.primary.href}
                      onClick={() => sound.playClick()}
                      onMouseEnter={() => sound.playHover()}
                      className="text-[var(--color-accent)] hover:text-white transition-colors duration-[var(--dur-base)] font-semibold flex items-center gap-1"
                    >
                      {currentTab.links.primary.label}
                    </a>
                  ) : (
                    /* TODO: add certificates URL */
                    <a
                      href={currentTab.links.primary.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      onMouseEnter={() => sound.playHover()}
                      className="text-[var(--color-accent)] hover:text-white transition-colors duration-[var(--dur-base)] font-semibold flex items-center gap-1"
                    >
                      {currentTab.links.primary.label}
                    </a>
                  )
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
