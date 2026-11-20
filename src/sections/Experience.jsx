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
              <span>CAREER & CHRONOLOGY</span>
            </div>
            <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
              EXPERIENCE & <span className="font-serif italic text-[var(--color-accent)]">IMPACT</span>
            </h2>
          </div>
          <span className="text-sm tracking-mono-md uppercase text-[var(--text-secondary)] pb-2 font-mono">
            CHRONOLOGICAL TRAJECTORY
          </span>
        </div>

        {/* Timeline Container with Continuous Vertical Spine */}
        <div className="relative pl-6 md:pl-10">
          
          {/* Base Vertical Timeline Spine Track */}
          <div
            className="absolute left-[11px] md:left-[19px] top-6 bottom-6 w-[2px] bg-[var(--border-default)]"
            aria-hidden="true"
          >
            {/* Luminous Animated Scroll-Drawn Progress Line */}
            <div
              ref={lineRef}
              className="w-full bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-data)] to-[var(--color-accent)] shadow-[var(--glow-gold-sm)] transition-[height] duration-150 ease-out"
              style={{ height: '0%' }}
            />
          </div>

          {/* Timeline Items Stack */}
          <div className="space-y-12 md:space-y-16">
            {experience.map((item, idx) => {
              const isIgnited = activeNodes[idx];
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={idx}
                  className={`timeline-item relative rounded-[var(--radius-xl)] bg-[var(--surface-card-start)]/60 border p-6 md:p-8 transition-all duration-[var(--dur-base)] ease-[var(--ease-standard)] shadow-[var(--shadow-card)] ${
                    isIgnited
                      ? 'border-[var(--color-accent)]/40 shadow-[var(--glow-gold-sm)]'
                      : 'border-[var(--border-subtle)] opacity-70'
                  }`}
                >
                  {/* Milestone Node on the Spine */}
                  <div
                    aria-hidden="true"
                    className={`absolute -left-[30px] md:-left-[37px] top-8 w-4 h-4 rounded-full border-2 transition-all duration-[var(--dur-slow)] flex items-center justify-center ${
                      isIgnited
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[var(--glow-gold-md)] scale-125'
                        : 'bg-[var(--bg-base)] border-[var(--border-elevated)]'
                    }`}
                  >
                    {isIgnited && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </div>

                  {/* 3-Column Editorial Grid: Mono Years Left, Role Center, Outcome Right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline">
                    
                    {/* Column 1: Monospaced Period & Tag */}
                    <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-2">
                      <span className={`text-sm font-mono tracking-widest font-semibold ${isIgnited ? 'text-[var(--color-accent)]' : 'text-[var(--text-secondary)]'}`}>
                        {item.period}
                      </span>
                      <span className="text-2xs font-mono tracking-widest text-[var(--color-data)] uppercase">
                        [{item.tag}]
                      </span>
                    </div>

                    {/* Column 2: Role & Organization */}
                    <div className="md:col-span-4">
                      <h3 className="text-xl font-light text-[var(--text-primary)]">
                        {item.role}
                      </h3>
                      <div className="text-sm tracking-wider uppercase text-[var(--color-data)] font-medium mt-1 font-mono">
                        {item.organization}
                      </div>
                    </div>

                    {/* Column 3: Outcome & Action Toggle */}
                    <div className="md:col-span-5 flex flex-col justify-between gap-4">
                      <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => toggleExpand(idx)}
                          aria-expanded={isExpanded}
                          aria-controls={`exp-detail-${idx}`}
                          className="text-2xs font-mono tracking-mono-sm uppercase text-[var(--color-accent)] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{isExpanded ? '[-] COLLAPSE METRICS' : '[+] INSPECT VERIFICATION'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Key Deliverables & Architecture Verification */}
                  {isExpanded && (
                    <div
                      id={`exp-detail-${idx}`}
                      className="mt-6 pt-6 border-t border-[var(--border-default)] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-[var(--text-secondary)]"
                    >
                      <div className="p-3 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)]">
                        <span className="text-2xs text-[var(--color-data)] uppercase block mb-1">Architecture Scope:</span>
                        <span className="text-[var(--text-primary)]">High-throughput microservices, telemetry monitoring, sub-second latency bounds.</span>
                      </div>
                      <div className="p-3 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)]">
                        <span className="text-2xs text-[var(--color-accent)] uppercase block mb-1">Production Verification:</span>
                        <span className="text-[var(--text-primary)]">Zero incident deployment with 100% automated regression test coverage.</span>
                      </div>
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
