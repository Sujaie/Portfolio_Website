import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolio.js';
import { sound } from '../utils/sound.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

// Calculate skill tier segments (1 to 4)
function getLevelSegments(level) {
  const norm = (level || '').toLowerCase();
  if (norm.includes('advanced')) return 4;
  if (norm.includes('proficient')) return 3;
  if (norm.includes('familiar')) return 2;
  return 2;
}

export default function Skills() {
  const { skills, projects } = portfolioData;
  const sectionRef = useRef(null);
  const isRevealedRef = useRef(false);
  const prefersReduced = useReducedMotion();
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Identify related projects for the hovered skill
  const relatedProjects = React.useMemo(() => {
    if (!hoveredSkill) return [];
    const skillNorm = hoveredSkill.toLowerCase();
    return projects.filter((p) =>
      p.stack.some((s) => skillNorm.includes(s.toLowerCase()) || s.toLowerCase().includes(skillNorm))
    );
  }, [hoveredSkill, projects]);

  // Skills Reveal Sequence with GSAP
  useEffect(() => {
    if (prefersReduced) {
      gsap.set('.skill-card, .skill-meter-segment', { opacity: 1, y: 0, scaleX: 1, clearProps: 'all' });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealedRef.current && sectionRef.current) {
            isRevealedRef.current = true;

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            // 1. Cards stagger in
            tl.fromTo(
              '.skill-card',
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }
            );

            // 2. Telemetry meter segments fill with glowing stagger
            tl.fromTo(
              '.skill-meter-segment-filled',
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.02, transformOrigin: 'left' },
              '-=0.3'
            );

            // 3. Exploring ticker fades in
            tl.fromTo(
              '.skills-exploring-row',
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.5 },
              '-=0.2'
            );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReduced]);

  const handleSkillHover = (skillName) => {
    setHoveredSkill(skillName);
    sound.playHover();
  };

  const handleSkillLeave = () => {
    setHoveredSkill(null);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] bg-transparent border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[var(--section-header-mb)]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-accent)] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
              <span>CORE PROFICIENCIES & GRAPH</span>
            </div>
            <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
              TECHNICAL <span className="font-serif italic text-[var(--color-accent)]">ARSENAL</span>
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] font-light leading-relaxed">
              Curated toolsets and runtime systems mastered across production environments, algorithmic research, and interactive engineering.
            </p>
          </div>

          {/* Active Constellation Telemetry Chip */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/90 border border-[var(--border-subtle)] min-w-[280px] font-mono text-xs">
            <div className="text-2xs text-[var(--text-secondary)] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Constellation State</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] animate-ping" />
            </div>
            {hoveredSkill ? (
              <div>
                <div className="text-sm font-semibold text-[var(--color-accent)] flex items-center gap-1.5">
                  <span>FOCUS:</span>
                  <span>{hoveredSkill}</span>
                </div>
                <div className="text-2xs text-[var(--text-secondary)] mt-1">
                  {relatedProjects.length > 0
                    ? `Deployed in: ${relatedProjects.map((p) => p.name).join(', ')}`
                    : 'Universal engineering foundation'}
                </div>
              </div>
            ) : (
              <div className="text-[var(--text-secondary)]">
                Hover any node to trace architecture affinities & linked productions
              </div>
            )}
          </div>
        </div>

        {/* Skills Constellation Grid: 2/3 Column Layout with Dimming / Lighting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items]) => {
            const hasCategoryFocus = hoveredSkill && items.some((s) => s.name === hoveredSkill);
            const isCategoryDimmed = hoveredSkill && !hasCategoryFocus;

            return (
              <div
                key={category}
                className={`skill-card p-6 md:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-2)]/90 border transition-all duration-[var(--dur-base)] ease-[var(--ease-standard)] shadow-[var(--shadow-card)] ${
                  hasCategoryFocus
                    ? 'border-[var(--color-data)] shadow-[var(--glow-cyan-sm)] -translate-y-1'
                    : isCategoryDimmed
                    ? 'border-[var(--border-subtle)] opacity-40'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                }`}
              >
                <h3 className="text-xs font-mono tracking-mono-md uppercase pb-4 mb-6 border-b border-[var(--border-default)] flex items-center justify-between">
                  <span className={hasCategoryFocus ? 'text-[var(--color-data)] font-semibold' : 'text-[var(--color-data)]'}>
                    {category}
                  </span>
                  <span className="text-2xs text-[var(--text-secondary)] opacity-60 font-mono">
                    [{items.length}]
                  </span>
                </h3>

                <div className="space-y-4">
                  {items.map((skill) => {
                    const isSkillHovered = hoveredSkill === skill.name;
                    const segments = getLevelSegments(skill.level);

                    return (
                      <div
                        key={skill.name}
                        onMouseEnter={() => handleSkillHover(skill.name)}
                        onMouseLeave={handleSkillLeave}
                        className={`group cursor-pointer py-1.5 px-2 -mx-2 rounded-[var(--radius-sm)] border-b border-white/[0.03] transition-all duration-[var(--dur-base)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isSkillHovered
                            ? 'bg-white/5 border-[var(--color-accent)]/40'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <span
                          className={`text-sm tracking-wide transition-colors duration-[var(--dur-base)] ${
                            isSkillHovered
                              ? 'text-[var(--color-accent)] font-medium'
                              : 'text-[var(--text-primary)] font-light group-hover:text-[var(--color-accent)]'
                          }`}
                        >
                          {skill.name}
                        </span>

                        {/* Segmented Telemetry Meter (4 Segments) */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map((seg) => {
                              const isFilled = seg <= segments;
                              return (
                                <div
                                  key={seg}
                                  className={`w-3.5 h-1.5 rounded-[1px] transition-all duration-[var(--dur-base)] ${
                                    isFilled
                                      ? isSkillHovered
                                        ? 'skill-meter-segment skill-meter-segment-filled bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]'
                                        : 'skill-meter-segment skill-meter-segment-filled bg-[var(--color-data)] shadow-[var(--glow-cyan-sm)]'
                                      : 'skill-meter-segment bg-white/10'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-2xs font-mono text-[var(--text-secondary)] uppercase w-16 text-right opacity-80">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Look Bible Signature: Currently Learning & Exploring Row */}
        <div className="skills-exploring-row mt-12 pt-8 border-t border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--color-data)] uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--color-data)] animate-pulse shadow-[var(--glow-cyan-sm)]" />
            <span className="font-semibold">CURRENTLY EXPLORING & RESEARCHING:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-2xs tracking-mono-sm uppercase text-[var(--text-secondary)]">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--border-subtle)] text-[var(--text-primary)]">
              WebGPU Computes
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--border-subtle)] text-[var(--text-primary)]">
              Distributed Raft Consensus
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--border-subtle)] text-[var(--text-primary)]">
              vLLM PagedAttention
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-[var(--border-subtle)] text-[var(--text-primary)]">
              eBPF Kernel Probing
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
