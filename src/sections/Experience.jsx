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
      className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#050609] border-t border-white/5"
    >
      <div className="relative z-10 max-w-[1600px] w-full mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-20">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-semibold text-[#00BFC4] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00BFC4] shadow-[0_0_8px_#00BFC4]" />
              <span>CAREER & MILESTONES</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-light text-[#F4F3F0] tracking-tight">
              EXPERIENCE & <span className="font-serif italic text-[#E9A927]">IMPACT</span>
            </h2>
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-[#A8ABB2] pb-2 font-mono">
            CHRONOLOGICAL TRAJECTORY
          </span>
        </div>

        {/* Timeline Stack */}
        <div className="divide-y divide-white/10">
          {experience.map((item, idx) => (
            <div
              key={idx}
              className="timeline-item py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline group hover:bg-white/[0.015] px-4 -mx-4 rounded-xl transition-colors"
            >
              {/* Period & Tag */}
              <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-2">
                <span className="text-xs font-mono tracking-widest text-[#E9A927]">
                  {item.period}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#A8ABB2] uppercase">
                  [{item.tag}]
                </span>
              </div>

              {/* Role & Org */}
              <div className="md:col-span-4">
                <h3 className="text-xl sm:text-2xl font-light text-[#F4F3F0] group-hover:text-white transition-colors">
                  {item.role}
                </h3>
                <div className="text-xs tracking-wider uppercase text-[#00BFC4] font-medium mt-1">
                  {item.organization}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm text-[#A8ABB2] font-light leading-relaxed">
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

