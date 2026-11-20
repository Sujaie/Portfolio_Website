import React, { useState, useRef } from 'react';
import { animate } from 'animejs';
import { portfolioData } from '../data/portfolio.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function About() {
  const { about, showcase } = portfolioData;
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef(null);
  const animRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const handleSlideChange = (newIndex) => {
    if (newIndex === activeIndex) return;

    if (prefersReduced) {
      setActiveIndex(newIndex);
      return;
    }

    if (animRef.current?.pause) {
      animRef.current.pause();
    }

    animRef.current = animate('.showcase-active-content', {
      opacity: [1, 0],
      translateX: [0, newIndex > activeIndex ? -20 : 20],
      duration: 180,
      ease: 'inQuad',
      onComplete: () => {
        setActiveIndex(newIndex);
        animRef.current = animate('.showcase-active-content', {
          opacity: [0, 1],
          translateX: [newIndex > activeIndex ? 20 : -20, 0],
          duration: 260,
          ease: 'outCubic'
        });
      }
    });
  };

  const nextSlide = () => {
    handleSlideChange((activeIndex + 1) % showcase.length);
  };

  const prevSlide = () => {
    handleSlideChange((activeIndex - 1 + showcase.length) % showcase.length);
  };

  const currentItem = showcase[activeIndex];

  return (
    <section
      id="about"
      className="relative w-full min-h-[100svh] py-28 md:py-36 px-6 md:px-12 lg:px-16 overflow-hidden flex items-center bg-[#050609]"
    >
      {/* VIBRANT MESH GRADIENT ATMOSPHERE (Accurately Recreating Section 2 of Video) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(0)' }}>
        {/* Magenta & Purple illumination (upper-left) */}
        <div
          className="absolute -top-[12%] -left-[10%] w-[600px] md:w-[850px] h-[600px] md:h-[850px] rounded-full blur-[140px] opacity-40 animate-pulse-subtle"
          style={{ background: 'radial-gradient(circle, #C90070 0%, #7c3aed 50%, transparent 75%)' }}
        />
        {/* Vibrant Cyan/Teal illumination (upper-right) */}
        <div
          className="absolute -top-[15%] right-[-5%] w-[650px] md:w-[900px] h-[650px] md:h-[900px] rounded-full blur-[150px] opacity-35"
          style={{ background: 'radial-gradient(circle, #00BFC4 0%, #0f766e 55%, transparent 75%)' }}
        />
        {/* Yellow/Gold illumination (lower-left) */}
        <div
          className="absolute bottom-[-10%] left-[12%] w-[500px] md:w-[750px] h-[500px] md:h-[750px] rounded-full blur-[140px] opacity-30"
          style={{ background: 'radial-gradient(circle, #F5BE37 0%, #E9A927 45%, transparent 75%)' }}
        />
        {/* Red/Orange illumination (bottom-right) */}
        <div
          className="absolute -bottom-[15%] right-[8%] w-[550px] md:w-[800px] h-[550px] md:h-[800px] rounded-full blur-[140px] opacity-30"
          style={{ background: 'radial-gradient(circle, #FF6543 0%, #C90070 50%, transparent 75%)' }}
        />
        {/* Subtle noise layer */}
        <div className="absolute inset-0 bg-noise opacity-40" />
      </div>

      <div className="relative z-10 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: EDITORIAL INTRODUCTION */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] font-mono text-[#E9A927] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E9A927] shadow-[0_0_8px_#E9A927]" />
            <span>{about.badge}</span>
          </div>

          {/* Lead statement */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#F4F3F0] mb-6 leading-[1.18]">
            {about.lead} <br />
            <span className="font-serif italic text-[#E9A927]">
              Crafting systems
            </span> with intention & intelligence.
          </h2>

          {/* Body paragraphs */}
          <div className="space-y-4 text-sm md:text-base text-[#A8ABB2] font-light leading-relaxed max-w-lg">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Technical focus pills */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-2">
            {about.highlights.map((item) => (
              <span
                key={item}
                className="text-[11px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F4F3F0]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE DARK SHOWCASE PANEL */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl bg-[#080D14]/90 border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[500px]">
            
            {/* Top Bar: Categories & Controls */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {showcase.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSlideChange(idx)}
                    className={`text-[10px] tracking-[0.2em] font-mono uppercase px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? 'bg-[#E9A927] text-black font-semibold shadow-[0_0_14px_rgba(233,169,39,0.45)]'
                        : 'text-[#A8ABB2] hover:text-white bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {item.category}
                  </button>
                ))}
              </div>

              {/* Prev / Next Controls (Accessible 44x44px target) */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A8ABB2] hover:text-white hover:border-[#E9A927] transition-colors cursor-pointer"
                  aria-label="Previous Project"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A8ABB2] hover:text-white hover:border-[#E9A927] transition-colors cursor-pointer"
                  aria-label="Next Project"
                >
                  →
                </button>
              </div>
            </div>

            {/* Active Showcase Content (Animated) */}
            <div ref={slideRef} className="showcase-active-content my-6">
              
              {/* Product Preview Interface Mockup */}
              <div className="relative w-full h-48 sm:h-56 rounded-xl bg-gradient-to-br from-[#0c1421] to-[#060a10] border border-white/10 p-4 mb-6 overflow-hidden flex flex-col justify-between">
                
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] tracking-wider text-[#A8ABB2] font-mono">
                    {currentItem.title.toLowerCase().replace(/\s+/g, '-')}.local
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    CONNECTED
                  </span>
                </div>

                {/* Mock UI Canvas / Telemetry Grid */}
                <div className="grid grid-cols-3 gap-3 my-auto py-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] font-mono text-[#A8ABB2] uppercase">Engine State</div>
                    <div className="text-sm font-semibold text-[#00BFC4] mt-1">OPTIMIZED</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] font-mono text-[#A8ABB2] uppercase">Throughput</div>
                    <div className="text-sm font-semibold text-[#E9A927] mt-1">{currentItem.metrics.split('•')[0]}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] font-mono text-[#A8ABB2] uppercase">Latency</div>
                    <div className="text-sm font-semibold text-white mt-1">{currentItem.metrics.split('•')[1] || 'Sub-ms'}</div>
                  </div>
                </div>

                {/* Bottom Timeline Sparkline */}
                <div className="flex items-end gap-1.5 h-4 opacity-75">
                  {[35, 60, 28, 80, 95, 45, 65, 75, 92, 48, 85, 100, 72, 88, 62].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#00BFC4] to-[#1769B5] rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                <h3 className="text-2xl font-light text-white">
                  {currentItem.title}
                </h3>
                <span className="text-xs text-[#E9A927] font-medium tracking-wide">
                  {currentItem.tagline}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#A8ABB2] font-light leading-relaxed mb-4">
                {currentItem.description}
              </p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1.5">
                {currentItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-wider font-mono px-2.5 py-1 rounded bg-black/50 text-[#F4F3F0] border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Slide Pagination Dots & Links */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                {showcase.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSlideChange(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeIndex ? 'w-6 bg-[#E9A927]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Jump to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs tracking-wider uppercase font-mono">
                <a
                  href={currentItem.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A8ABB2] hover:text-[#E9A927] transition-colors"
                >
                  GitHub ↗
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
