import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolio.js';
import { sound } from '../utils/sound.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function Experience() {
  const { experience } = portfolioData;
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [activeNodes, setActiveNodes] = useState([true, false, false]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Experience Scroll-Driven Trajectory & Node Ignition
  useEffect(() => {
    if (prefersReduced) {
      setActiveNodes([true, true, true]);
      if (lineRef.current) lineRef.current.style.height = '100%';
      gsap.set('.timeline-item, .timeline-node', { opacity: 1, clearProps: 'all' });
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the section
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const progress = Math.min(
        1,
        Math.max(0, (windowHeight * 0.7 - sectionTop) / (sectionHeight * 0.8))
      );

      if (lineRef.current) {
        lineRef.current.style.height = `${(progress * 100).toFixed(1)}%`;
      }

      // Check node intersection thresholds
      const items = sectionRef.current.querySelectorAll('.timeline-item');
      const newActive = [false, false, false];
      items.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.75) {
          newActive[idx] = true;
        }
      });

      setActiveNodes(newActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Stagger reveal on intersection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              '.timeline-item',
              { opacity: 0, x: -15 },
              { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [prefersReduced]);

  const toggleExpand = (idx) => {
    sound.playClick();
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

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
              <span>BUILDS, TEAMS & LEARNING.</span>
            </div>
            <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
              BUILDING, LEARNING & <span className="font-serif italic text-[var(--color-accent)]">CONTRIBUTING</span>
            </h2>
          </div>
          <span className="text-sm tracking-mono-md uppercase text-[var(--text-secondary)] pb-2 font-mono">
            EARLY IN THE JOURNEY. ALREADY IN MOTION.
          </span>
        </div>

        {/* Timeline Container with Continuous Vertical Spine */}
        <div className="relative pl-5 md:pl-8">
          
          {/* Base Vertical Timeline Spine Track (1px hairline) */}
          <div
            className="absolute left-[9px] md:left-[15px] top-6 bottom-6 w-[1px] bg-white/[0.08]"
            aria-hidden="true"
          >
            {/* Animated Scroll-Drawn Progress Line (subtle gradient, no harsh glow) */}
            <div
              ref={lineRef}
              className="w-full bg-gradient-to-b from-[var(--color-accent)]/60 via-[var(--color-data)]/50 to-[var(--color-accent)]/60 transition-[height] duration-150 ease-out"
              style={{ height: '0%' }}
            />
          </div>

          {/* Timeline Items Stack (compact vertical rhythm) */}
          <div className="space-y-5 md:space-y-6">
            {experience.map((item, idx) => {
              const isIgnited = activeNodes[idx];
              const isExpanded = expandedIndex === idx;
              const isPrimary = item.highlight === 'primary';
              const isSecondary = item.highlight === 'secondary';

              return (
                <div
                  key={idx}
                  className={`timeline-item relative rounded-[var(--radius-lg)] bg-[var(--surface-card-start)]/40 border py-4 px-4 sm:py-5 sm:px-6 transition-all duration-[var(--dur-base)] ease-[var(--ease-standard)] shadow-[var(--shadow-card)] ${
                    isIgnited
                      ? isPrimary
                        ? 'border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]/50 shadow-[0_2px_12px_rgba(240,189,88,0.06)]'
                        : isSecondary
                        ? 'border-[var(--color-data)]/25 hover:border-[var(--color-data)]/40 shadow-[0_2px_12px_rgba(53,214,223,0.04)]'
                        : 'border-[var(--border-subtle)] hover:border-white/10'
                      : isPrimary
                      ? 'border-[var(--color-accent)]/15 opacity-75'
                      : 'border-[var(--border-subtle)]/60 opacity-60'
                  }`}
                >
                  {/* Refined Small Milestone Node on Spine (aligned with content top) */}
                  <div
                    aria-hidden="true"
                    className={`absolute -left-[22px] md:-left-[28px] top-6 w-3 h-3 rounded-full border transition-all duration-[var(--dur-slow)] flex items-center justify-center ${
                      isIgnited
                        ? isPrimary
                          ? 'bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_6px_rgba(240,189,88,0.35)]'
                          : isSecondary
                          ? 'bg-[var(--color-data)] border-[var(--color-data)] shadow-[0_0_6px_rgba(53,214,223,0.3)]'
                          : 'bg-[var(--surface-3)] border-white/20'
                        : 'bg-[var(--bg-base)] border-white/10'
                    }`}
                  >
                    {isIgnited && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isPrimary || isSecondary ? 'bg-black' : 'bg-white/40'
                        }`}
                      />
                    )}
                  </div>

                  {/* 3-Column Editorial Grid: Date Left, Role Center, Story & Tags Right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 items-start">
                    
                    {/* Column 1: Monospaced Period & Category (subtle metadata) */}
                    <div className="md:col-span-2 flex flex-row md:flex-col justify-between md:justify-start gap-1 pt-0.5">
                      <span
                        className={`text-xs font-mono tracking-wider font-medium ${
                          isIgnited
                            ? isPrimary
                              ? 'text-[var(--color-accent)]/90'
                              : isSecondary
                              ? 'text-[var(--color-data)]/90'
                              : 'text-[var(--text-secondary)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {item.period}
                      </span>
                      <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
                        [{item.tag}]
                      </span>
                    </div>

                    {/* Column 2: Role (Primary) & Organization (Secondary) */}
                    <div className="md:col-span-4">
                      <h3 className="text-base sm:text-[17px] font-normal text-[var(--text-primary)] leading-snug">
                        {item.role}
                      </h3>
                      <div className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                        {item.organization}
                      </div>
                      {item.achievement && (
                        <div className="text-[11px] font-mono text-[var(--color-accent)]/90 mt-1 flex items-center gap-1 font-medium">
                          <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]/80" />
                          <span>{item.achievement}</span>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Concise Story, Limited Tags & Quiet Action Link */}
                    <div className="md:col-span-6 flex flex-col justify-between gap-2.5">
                      <p className="text-[13px] sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        {/* 2-3 Compact Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono tracking-mono-sm px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[var(--text-secondary)]/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quiet Details Toggle */}
                        <button
                          onClick={() => toggleExpand(idx)}
                          aria-expanded={isExpanded}
                          aria-controls={`exp-detail-${idx}`}
                          className="text-[11px] font-mono tracking-mono-sm uppercase text-[var(--color-accent)]/80 hover:text-[var(--color-accent)] transition-colors cursor-pointer inline-flex items-center gap-1 ml-auto self-center"
                        >
                          <span>{isExpanded ? '[-] COLLAPSE' : '[+] VIEW DETAILS'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Key Deliverables & Case-Study Verification (Compact) */}
                  {isExpanded && item.verification && (
                    <div
                      id={`exp-detail-${idx}`}
                      className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs text-[var(--text-secondary)]"
                    >
                      {item.verification.map((vBlock, vIdx) => (
                        <div
                          key={vIdx}
                          className="p-3 sm:p-3.5 rounded-[var(--radius-md)] bg-black/30 border border-white/[0.06] flex flex-col justify-start gap-2"
                        >
                          <span className="text-[10px] uppercase font-mono tracking-[0.12em] text-[var(--text-secondary)]/70 font-medium">
                            {vBlock.label}:
                          </span>
                          <ul className="space-y-1 text-[var(--text-primary)]/90 font-sans text-xs font-light">
                            {vBlock.items.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2">
                                <span
                                  className="text-[var(--color-accent)]/50 text-[11px] select-none pt-0.5"
                                  aria-hidden="true"
                                >
                                  ↳
                                </span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
