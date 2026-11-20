import React from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function Hero() {
  const { hero } = portfolioData;

  return (
    <section
      id="home"
      className="relative w-full min-h-[100svh] bg-[var(--bg-base)] overflow-hidden flex flex-col justify-between pt-28 md:pt-36 pb-10 px-[var(--page-gutter)]"
    >
      {/* ATMOSPHERIC BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-noise pointer-events-none z-10 opacity-35" />

      {/* Atmospheric Ambient Depth (GPU-isolated composite layer) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(0)' }}>
        <div
          className="absolute top-1/4 right-[5%] w-[650px] md:w-[950px] h-[650px] md:h-[950px] rounded-full pointer-events-none blur-[140px] opacity-40"
          style={{
            background: 'radial-gradient(circle, var(--hero-ambient-navy) 0%, var(--bg-raised) 60%, transparent 80%)'
          }}
        />
        <div
          className="absolute top-[22%] left-[12%] md:left-[24%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full pointer-events-none blur-[120px] opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(23,105,181,0.3) 0%, rgba(0,191,196,0.12) 45%, transparent 75%)'
          }}
        />
        <div
          className="absolute -bottom-24 -left-20 w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full pointer-events-none blur-[130px] opacity-25"
          style={{
            background: 'radial-gradient(circle, var(--hero-ambient-cyan) 0%, var(--hero-ambient-blue) 50%, transparent 80%)'
          }}
        />
      </div>

      {/* TOP CONTENT: INTRO METADATA LABEL */}
      <div className="relative z-20 max-w-[var(--content-max-width)] w-full mx-auto">
        <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--text-secondary)] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)] shadow-[var(--glow-cyan-sm)] animate-pulse" />
          <span>{hero.introLabel}</span>
        </div>
      </div>

      {/* MIDDLE: ASYMMETRICAL EDITORIAL HEADLINE */}
      <div className="relative z-20 max-w-[var(--content-max-width)] w-full mx-auto my-auto py-6 md:py-10 select-text">
        {/* Row 1: "CREATIVE" offset left */}
        <div className="overflow-hidden py-1">
          <h1 className="text-hero-display font-light leading-hero tracking-hero text-[var(--text-primary)] font-sans">
            {hero.headlinePart1}
          </h1>
        </div>

        {/* Row 2: "SOFTWARE" italic serif accent offset right */}
        <div className="overflow-hidden py-1 flex justify-start sm:justify-center md:justify-end md:pr-[10vw]">
          <span className="font-serif italic font-normal text-hero-accent leading-hero-accent text-[var(--color-accent)] drop-shadow-[var(--glow-gold-lg)]">
            {hero.headlineAccent}
          </span>
        </div>

        {/* Row 3: "DEVELOPER" lower row extending right */}
        <div className="overflow-hidden py-1 flex justify-end">
          <h1 className="text-hero-display font-light leading-hero tracking-hero text-[var(--text-primary)] font-sans">
            {hero.headlinePart2}
          </h1>
        </div>
      </div>

      {/* BOTTOM: METADATA BLOCKS & SCROLL INDICATOR */}
      <div className="relative z-20 max-w-[var(--content-max-width)] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[var(--border-default)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 lg:gap-16">
          {hero.metadata.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
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
          className="group flex items-center gap-3 text-2xs tracking-mono-lg font-mono text-[var(--text-secondary)] hover:text-[var(--color-accent)] uppercase transition-colors duration-[var(--dur-base)]"
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
