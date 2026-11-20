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
          if (entry.isIntersecting) {
            animRef.current = animate('.timeline-item', {
              opacity: [0, 1],
              translateX: [-25, 0],
              delay: (el, i) => i * 120,
              duration: 750,
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
      id="experience"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[1600px] w-full mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-20">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold text-[var(--color-data)] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] shadow-[0_0_8px_var(--color-data)]" />
              <span>CAREER & MILESTONES</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-light text-[var(--text-primary)] tracking-tight">
              EXPERIENCE & <span className="font-serif italic text-[var(--color-accent)]">IMPACT</span>
            </h2>
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-[var(--text-secondary)] pb-2 font-mono">
            CHRONOLOGICAL TRAJECTORY
          </span>
        </div>

        {/* Timeline Stack */}
        <div className="divide-y divide-[var(--border-default)]">
          {experience.map((item, idx) => (
            <div
              key={idx}
              className="timeline-item py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline group hover:bg-white/[0.015] px-4 -mx-4 rounded-xl transition-colors"
            >
              {/* Period & Tag */}
              <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-2">
                <span className="text-xs font-mono tracking-widest text-[var(--color-accent)]">
                  {item.period}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase">
                  [{item.tag}]
                </span>
              </div>

              {/* Role & Org */}
              <div className="md:col-span-4">
                <h3 className="text-xl sm:text-2xl font-light text-[var(--text-primary)] group-hover:text-white transition-colors">
                  {item.role}
                </h3>
                <div className="text-xs tracking-wider uppercase text-[var(--color-data)] font-medium mt-1">
                  {item.organization}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
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
