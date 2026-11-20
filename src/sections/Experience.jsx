import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { portfolioData } from '../data/portfolio.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function Experience() {
  const { experience } = portfolioData;
  const sectionRef = useRef(null);
  const animRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionRef.current) {
            const items = sectionRef.current.querySelectorAll('.timeline-item');
            if (items.length) {
              animRef.current = animate(items, {
                opacity: [0, 1],
                translateX: [-25, 0],
                delay: (el, i) => i * 120,
                duration: 750,
                ease: 'outQuad',
              });
            }
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
      id="experience"
      ref={sectionRef}
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] bg-transparent border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-[var(--section-header-mb)]">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-data)] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] shadow-[var(--glow-cyan-sm)]" />
              <span>CAREER & MILESTONES</span>
            </div>
            <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
              EXPERIENCE & <span className="font-serif italic text-[var(--color-accent)]">IMPACT</span>
            </h2>
          </div>
          <span className="text-sm tracking-mono-md uppercase text-[var(--text-secondary)] pb-2 font-mono">
            CHRONOLOGICAL TRAJECTORY
          </span>
        </div>

        {/* Timeline Stack */}
        <div className="divide-y divide-[var(--border-default)]">
          {experience.map((item, idx) => (
            <div
              key={idx}
              className="timeline-item py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline group hover:bg-white/[0.015] px-4 -mx-4 rounded-[var(--radius-lg)] transition-colors duration-[var(--dur-base)]"
            >
              {/* Period & Tag */}
              <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-2">
                <span className="text-sm font-mono tracking-widest text-[var(--color-accent)]">
                  {item.period}
                </span>
                <span className="text-2xs font-mono tracking-widest text-[var(--text-secondary)] uppercase">
                  [{item.tag}]
                </span>
              </div>

              {/* Role & Org */}
              <div className="md:col-span-4">
                <h3 className="text-xl font-light text-[var(--text-primary)] group-hover:text-white transition-colors duration-[var(--dur-base)]">
                  {item.role}
                </h3>
                <div className="text-sm tracking-wider uppercase text-[var(--color-data)] font-medium mt-1">
                  {item.organization}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
