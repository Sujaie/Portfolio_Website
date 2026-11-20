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
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] bg-[var(--bg-base)] border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto">
        
        {/* Section Header */}
        <div className="mb-[var(--section-header-mb)] max-w-xl">
          <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-accent)] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
            <span>CORE PROFICIENCIES</span>
          </div>
          <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
            TECHNICAL <span className="font-serif italic text-[var(--color-accent)]">ARSENAL</span>
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] font-light leading-relaxed">
            Curated toolsets and runtime systems mastered across production environments, algorithmic research, and interactive engineering.
          </p>
        </div>

        {/* Skills Grid: Editorial Minimal 2/3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="skill-card p-6 md:p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)]/70 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all duration-[var(--dur-slow)]"
            >
              <h3 className="text-xs font-mono tracking-mono-md text-[var(--color-data)] uppercase pb-4 mb-6 border-b border-[var(--border-default)] flex items-center justify-between">
                <span>{category}</span>
                <span className="text-2xs text-[var(--text-secondary)] opacity-60 font-mono">[{items.length}]</span>
              </h3>

              <div className="space-y-4">
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex items-center justify-between py-1 border-b border-white/[0.03] hover:border-[var(--border-default)] transition-colors duration-[var(--dur-base)]"
                  >
                    <span className="text-base text-[var(--text-primary)] font-light group-hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)]">
                      {skill.name}
                    </span>
                    <span className="text-2xs font-mono tracking-mono-sm text-[var(--text-secondary)] uppercase">
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
