import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { portfolioData } from '../data/portfolio.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function Skills() {
  const { skills } = portfolioData;
  const sectionRef = useRef(null);
  const animRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    // Reveal animation for skill rows when section scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animRef.current = animate('.skill-card', {
              opacity: [0, 1],
              translateY: [30, 0],
              delay: (el, i) => i * 80,
              duration: 700,
              ease: 'outQuad',
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (animRef.current?.pause) animRef.current.pause();
    };
  }, [prefersReduced]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#050609] border-t border-white/5"
    >
      <div className="relative z-10 max-w-[1600px] w-full mx-auto">
        
        {/* Section Header */}
        <div className="mb-20 max-w-xl">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold text-[#E9A927] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E9A927] shadow-[0_0_8px_#E9A927]" />
            <span>CORE PROFICIENCIES</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-light text-[#F4F3F0] tracking-tight">
            TECHNICAL <span className="font-serif italic text-[#E9A927]">ARSENAL</span>
          </h2>
          <p className="mt-4 text-sm text-[#A8ABB2] font-light leading-relaxed">
            Curated toolsets and runtime systems mastered across production environments, algorithmic research, and interactive engineering.
          </p>
        </div>

        {/* Skills Grid: Editorial Minimal 2/3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="skill-card p-6 md:p-8 rounded-2xl bg-[#080D14]/70 border border-white/5 hover:border-white/15 transition-all duration-300"
            >
              <h3 className="text-xs font-mono tracking-[0.2em] text-[#00BFC4] uppercase pb-4 mb-6 border-b border-white/10 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-[10px] text-[#A8ABB2] opacity-60">[{items.length}]</span>
              </h3>

              <div className="space-y-4">
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex items-center justify-between py-1 border-b border-white/[0.03] hover:border-white/10 transition-colors"
                  >
                    <span className="text-sm text-[#F4F3F0] font-light group-hover:text-[#E9A927] transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider text-[#A8ABB2] uppercase">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

