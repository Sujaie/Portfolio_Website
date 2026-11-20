import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { portfolioData } from '../data/portfolio.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function Hero() {
  const { hero } = portfolioData;
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Hero "Ignition" Signature Choreography
  useGSAP(
    () => {
      if (prefersReduced) {
        gsap.set('.hero-intro, .hero-line-1, .hero-line-2, .hero-accent, .hero-meta-item, .hero-explore', {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
          clearProps: 'transform,opacity'
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Intro metadata label fades in smoothly
      tl.fromTo(
        '.hero-intro',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15 }
      );

      // 2. Line 1: "CREATIVE" rises smoothly from overflow mask
      tl.fromTo(
        '.hero-line-1',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85 },
        '-=0.3'
      );

      // 3. Line 3: "DEVELOPER" rises second
      tl.fromTo(
        '.hero-line-2',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85 },
        '-=0.55'
      );

      // 4. Line 2: "SOFTWARE" in gold serif italic resolves LAST to draw the eye
      tl.fromTo(
        '.hero-accent',
        { yPercent: 120, opacity: 0, scale: 0.94 },
        { yPercent: 0, opacity: 1, scale: 1, duration: 0.95, ease: 'power2.out' },
        '-=0.45'
      );

      // 5. Metadata blocks stagger-fade in
      tl.fromTo(
        '.hero-meta-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.4'
      );

      // 6. Explore scroll indicator fades in at the end
      tl.fromTo(
        '.hero-explore',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    },
    { scope: containerRef, dependencies: [prefersReduced] }
  );

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-[100svh] bg-transparent overflow-hidden flex flex-col justify-between pt-28 md:pt-36 pb-10 px-[var(--page-gutter)]"
    >
      {/* TOP CONTENT: INTRO METADATA LABEL */}
      <div className="hero-intro relative z-20 max-w-[var(--content-max-width)] w-full mx-auto">
        <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--text-secondary)] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)] shadow-[var(--glow-cyan-sm)] animate-pulse" />
          <span>{hero.introLabel}</span>
        </div>
      </div>

      {/* MIDDLE: ASYMMETRICAL EDITORIAL HEADLINE WITH OVERFLOW MASKS */}
      <div className="relative z-20 max-w-[var(--content-max-width)] w-full mx-auto my-auto py-6 md:py-10 select-text">
        {/* Row 1: "CREATIVE" offset left */}
        <div className="overflow-hidden py-1">
          <h1 className="hero-line-1 text-hero-display font-light leading-hero tracking-hero text-[var(--text-primary)] font-sans will-change-transform">
            {hero.headlinePart1}
          </h1>
        </div>

        {/* Row 2: "SOFTWARE" italic serif accent offset right (Resolves LAST) */}
        <div className="overflow-hidden py-1 flex justify-start sm:justify-center md:justify-end md:pr-[10vw]">
          <span className="hero-accent font-serif italic font-normal text-hero-accent leading-hero-accent text-[var(--color-accent)] drop-shadow-[var(--glow-gold-lg)] will-change-transform">
            {hero.headlineAccent}
          </span>
        </div>

        {/* Row 3: "DEVELOPER" lower row extending right */}
        <div className="overflow-hidden py-1 flex justify-end">
          <h1 className="hero-line-2 text-hero-display font-light leading-hero tracking-hero text-[var(--text-primary)] font-sans will-change-transform">
            {hero.headlinePart2}
          </h1>
        </div>
      </div>

      {/* BOTTOM: METADATA BLOCKS & SCROLL INDICATOR */}
      <div className="relative z-20 max-w-[var(--content-max-width)] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[var(--border-default)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 lg:gap-16">
          {hero.metadata.map((item) => (
            <div key={item.label} className="hero-meta-item flex flex-col gap-1">
              <span className="text-2xs tracking-mono-lg text-[var(--text-secondary)] font-mono font-medium uppercase">
                {item.label}
              </span>
              <span className="text-sm tracking-wider text-[var(--text-primary)] font-light">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#about"
          aria-label="Explore: scroll down to About section"
          className="hero-explore group flex items-center gap-3 text-2xs tracking-mono-lg font-mono text-[var(--text-secondary)] hover:text-[var(--color-accent)] uppercase transition-colors duration-[var(--dur-base)] cursor-pointer"
        >
          <span>EXPLORE</span>
          <div className="w-5 h-8 rounded-full border border-[var(--border-elevated)] flex items-start justify-center p-1 group-hover:border-[var(--color-accent)]/60 transition-colors duration-[var(--dur-base)]">
            <span className="w-1 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
