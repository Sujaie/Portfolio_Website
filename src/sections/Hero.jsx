import React from 'react';
import { portfolioData } from '../data/portfolio.js';

export default function Hero() {
  const { hero } = portfolioData;

  return (
    <section
      id="home"
      className="relative w-full min-h-[100svh] bg-[var(--bg-base)] overflow-hidden flex flex-col justify-between pt-28 md:pt-36 pb-10 px-6 md:px-12 lg:px-16"
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
      <div className="relative z-20 max-w-[1600px] w-full mx-auto">
        <div className="inline-flex items-center gap-3 text-[11px] md:text-xs tracking-[0.25em] font-mono text-[var(--text-secondary)] uppercase">
          <span className="w-2 h-2 rounded-full bg-[var(--color-highlight)] shadow-[0_0_10px_var(--color-highlight)] animate-pulse" />
          <span>{hero.introLabel}</span>
        </div>
      </div>

      {/* MIDDLE: ASYMMETRICAL EDITORIAL HEADLINE */}
      <div className="relative z-20 max-w-[1600px] w-full mx-auto my-auto py-6 md:py-10 select-text">
        {/* Row 1: "CREATIVE" offset left */}
        <div className="overflow-hidden py-1">
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[9.5vw] lg:text-[8.8vw] font-light leading-[0.88] tracking-[-0.035em] text-[var(--text-primary)] font-sans">
            {hero.headlinePart1}
          </h1>
        </div>

        {/* Row 2: "SOFTWARE" italic serif accent offset right */}
        <div className="overflow-hidden py-1 flex justify-start sm:justify-center md:justify-end md:pr-[10vw]">
          <span className="font-serif italic font-normal text-[15vw] sm:text-[13vw] md:text-[10.5vw] lg:text-[9.8vw] leading-[0.9] text-[var(--color-accent)] drop-shadow-[0_0_45px_var(--glow-gold)]">
            {hero.headlineAccent}
          </span>
        </div>

        {/* Row 3: "DEVELOPER" lower row extending right */}
        <div className="overflow-hidden py-1 flex justify-end">
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[9.5vw] lg:text-[8.8vw] font-light leading-[0.88] tracking-[-0.035em] text-[var(--text-primary)] font-sans">
            {hero.headlinePart2}
          </h1>
        </div>
      </div>

      {/* BOTTOM: METADATA BLOCKS & SCROLL INDICATOR */}
      <div className="relative z-20 max-w-[1600px] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[var(--border-default)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 lg:gap-16">
          {hero.metadata.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-[10px] tracking-[0.25em] text-[var(--text-secondary)] font-mono font-medium uppercase">
                {item.label}
              </span>
              <span className="text-xs md:text-sm tracking-wider text-[var(--text-primary)] font-light">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#about"
          className="group flex items-center gap-3 text-[10px] tracking-[0.25em] font-mono text-[var(--text-secondary)] hover:text-[var(--color-accent)] uppercase transition-colors"
        >
          <span>EXPLORE</span>
          <div className="w-5 h-8 rounded-full border border-[var(--border-elevated)] flex items-start justify-center p-1 group-hover:border-[var(--color-accent)]/60 transition-colors">
            <span className="w-1 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
