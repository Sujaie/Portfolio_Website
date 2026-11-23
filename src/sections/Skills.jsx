import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/sound.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

// =========================================================================
// 1. CARDS DATA ARRAY (All 7 cards: 6 in 3x2 grid, 1 full-width Tools strip)
// =========================================================================
export const SKILL_CARDS = [
  {
    id: 'languages',
    title: 'LANGUAGES',
    group: 'A',
    skills: [
      { name: 'Python', pips: 3 },
      { name: 'JavaScript', pips: 3 },
      { name: 'SQL', pips: 3 },
      { name: 'C', pips: 2 },
      { name: 'C++', pips: 2 },
    ],
  },
  {
    id: 'frontend-mobile',
    title: 'FRONTEND & MOBILE',
    group: 'A',
    skills: [
      { name: 'HTML & CSS', pips: 3 },
      { name: 'Tailwind CSS', pips: 3 },
      { name: 'React.js', pips: 3 },
      { name: 'Flutter', pips: 2 },
      { name: 'Dart', pips: 2 },
    ],
  },
  {
    id: 'backend-apis',
    title: 'BACKEND & APIs',
    group: 'A',
    skills: [
      { name: 'FastAPI', pips: 2 },
      { name: 'REST APIs', pips: 2 },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI / MACHINE LEARNING',
    group: 'B',
    skills: [
      { name: 'NumPy & Pandas', pips: 3 },
      { name: 'HuggingFace', pips: 2 },
      { name: 'PyTorch', pips: 2 },
      { name: 'Ollama / Local LLMs', pips: 2 },
      { name: 'LiveKit', pips: 1 },
    ],
  },
  {
    id: 'databases',
    title: 'DATABASES',
    group: 'B',
    skills: [
      { name: 'MySQL', pips: 3 },
      { name: 'PostgreSQL', pips: 2 },
      { name: 'MongoDB', pips: 1 },
    ],
  },
  {
    id: 'cs-foundations',
    title: 'CS FOUNDATIONS',
    group: 'C',
    skills: [
      { name: 'OOP', pips: 3 },
      { name: 'DBMS', pips: 3 },
      { name: 'File Handling', pips: 3 },
      { name: 'Data Structures', pips: 2 },
      { name: 'Data Mining', pips: 2 },
      { name: '8086 Microprocessors', pips: 2 },
    ],
  },
  {
    id: 'tools-design',
    title: 'TOOLS & DESIGN',
    group: 'C',
    isFullWidth: true,
    skills: [
      { name: 'Git', pips: 1 },
      { name: 'GitHub', pips: 1 },
      { name: 'Figma', pips: 1 },
    ],
  },
];

// =========================================================================
// 2. CONSTELLATION / GRAPH PROJECT NODES & MAPPING
// =========================================================================
export const PROJECT_NODES = [
  'ArtiNova',
  'DevAtlas',
  'Fashion Sizing API',
  'Chess Game',
];

// TODO: confirm links
export const SKILL_PROJECT_MAP = {
  'Python': ['ArtiNova', 'Fashion Sizing API', 'Chess Game'],
  'FastAPI': ['ArtiNova'],
  'Flutter': ['ArtiNova'],
  'Dart': ['ArtiNova'],
  'PostgreSQL': ['ArtiNova'],
  'Ollama / Local LLMs': ['ArtiNova'],
  'HuggingFace': ['Fashion Sizing API'],
  'PyTorch': ['Fashion Sizing API'],
  'React.js': ['DevAtlas'],
  'JavaScript': ['DevAtlas'],
  'C': 'Coursework',
  'C++': 'Coursework',
  'Data Structures': 'Coursework',
  'OOP': 'Coursework',
};

// =========================================================================
// 3. CURRENTLY EXPLORING
// =========================================================================
export const CURRENTLY_EXPLORING = [
  'RAG & VECTOR SEARCH',
  'LOCAL LLMS WITH OLLAMA',
  'VOICE AGENTS (LIVEKIT)',
  'SYSTEM DESIGN BASICS',
  'DSA PRACTICE',
];

// =========================================================================
// 4. SOFT SKILLS (BEYOND THE STACK)
// =========================================================================
export const SOFT_SKILLS = [
  'Leadership',
  'Teamwork',
  'Commitment',
  'Adaptability',
  'Stage Speaking',
  'Event Management',
  'Problem Solving',
  'Discipline',
  'Planning & Coordination',
  'Communication',
  'Consistency',
];

// =========================================================================
// 5. CERTIFICATES
// =========================================================================
// TODO: add certificate URLs
export const CERTIFICATES = [
  {
    title: 'Programming in C',
    issuer: 'Infosys Springboard',
    // TODO: add certificate URL
    url: '#',
  },
  {
    title: 'MongoDB Course',
    issuer: 'MongoDB',
    // TODO: add certificate URL
    url: '#',
  },
  {
    title: 'Python Fundamentals',
    issuer: 'Course Certification',
    // TODO: add certificate URL
    url: '#',
  },
];

// =========================================================================
// 6. THIS SITE IS BUILT WITH (Directly detected from package.json)
// =========================================================================
export const BUILT_WITH = [
  'React 19',
  'Vite',
  'Tailwind CSS',
  'GSAP',
];

// =========================================================================
// Helper: 3-Pip Tier Labels
// Group A: 3 = COMFORTABLE, 2 = BUILDING WITH, 1 = LEARNING
// Group B: 3 = HANDS-ON, 2 = PROJECT-USED, 1 = EXPLORING
// Group C: 3 = SOLID, 2 = GROWING, 1 = BEGINNER
// =========================================================================
export function getTierLabel(group, pips) {
  if (group === 'A') {
    if (pips === 3) return 'COMFORTABLE';
    if (pips === 2) return 'BUILDING WITH';
    return 'LEARNING';
  }
  if (group === 'B') {
    if (pips === 3) return 'HANDS-ON';
    if (pips === 2) return 'PROJECT-USED';
    return 'EXPLORING';
  }
  if (group === 'C') {
    if (pips === 3) return 'SOLID';
    if (pips === 2) return 'GROWING';
    return 'BEGINNER';
  }
  return '';
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isRevealedRef = useRef(false);
  const prefersReduced = useReducedMotion();
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Active project connections for hovered skill
  const activeAffinity = useMemo(() => {
    if (!hoveredSkill) return null;
    return SKILL_PROJECT_MAP[hoveredSkill] || null;
  }, [hoveredSkill]);

  // Skills Reveal Sequence with GSAP
  useEffect(() => {
    if (prefersReduced) {
      gsap.set(
        '.skill-card, .tools-strip-card, .skill-meter-segment, .skills-exploring-row, .skills-soft-row, .skills-cert-row, .skills-built-row',
        { opacity: 1, y: 0, scaleX: 1, clearProps: 'all' }
      );
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
              '.skill-card, .tools-strip-card',
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }
            );

            // 2. 3-pip telemetry segments fill with glowing stagger
            tl.fromTo(
              '.skill-pip-filled',
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.35, stagger: 0.015, transformOrigin: 'left' },
              '-=0.3'
            );

            // 3. Exploring ticker, soft skills, and certs fade in
            tl.fromTo(
              '.skills-exploring-row, .skills-soft-row, .skills-cert-row, .skills-built-row',
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
              '-=0.2'
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

    return () => observer.disconnect();
  }, [prefersReduced]);

  const handleSkillHover = (skillName) => {
    setHoveredSkill(skillName);
    sound.playHover();
  };

  const handleSkillLeave = () => {
    setHoveredSkill(null);
  };

  const gridCards = SKILL_CARDS.slice(0, 6);
  const toolsCard = SKILL_CARDS[6];

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
              <span>TOOLS & FOUNDATIONS</span>
            </div>
            <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
              TECHNICAL <span className="font-serif italic text-[var(--color-accent)]">ARSENAL</span>
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] font-light leading-relaxed">
              Curated tools and foundations I use to build my projects, and the areas where I'm still growing.
            </p>
          </div>

          {/* Active Constellation Telemetry Chip (Top Right) */}
          <div className="p-4 md:p-5 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/90 border border-[var(--border-subtle)] min-w-[280px] sm:min-w-[340px] font-mono text-xs shadow-[var(--shadow-card)]">
            <div className="text-2xs text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] animate-pulse" />
                <span>Project Constellation</span>
              </span>
              <span className="text-2xs text-[var(--text-muted)] font-mono">Live Trace</span>
            </div>

            {hoveredSkill ? (
              <div className="space-y-2.5">
                <div className="text-sm font-semibold text-[var(--color-accent)] flex items-center gap-1.5">
                  <span className="text-[var(--text-secondary)] font-normal text-xs">FOCUS:</span>
                  <span>{hoveredSkill}</span>
                </div>
                
                {/* Linked projects or coursework */}
                {Array.isArray(activeAffinity) && activeAffinity.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xs text-[var(--color-data)] uppercase">Used In:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PROJECT_NODES.map((proj) => {
                        const isLinked = activeAffinity.includes(proj);
                        return (
                          <span
                            key={proj}
                            className={`px-2 py-0.5 rounded text-2xs transition-all duration-[var(--dur-fast)] ${
                              isLinked
                                ? 'bg-[var(--color-data)]/20 border border-[var(--color-data)] text-white shadow-[var(--glow-cyan-sm)] font-medium'
                                : 'bg-white/5 border border-white/5 text-[var(--text-muted)] opacity-30'
                            }`}
                          >
                            {proj}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : activeAffinity === 'Coursework' ? (
                  <div className="flex items-center gap-2 text-2xs text-[var(--color-accent)]">
                    <span className="px-2.5 py-1 rounded bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-medium">
                      Coursework / Academic Foundation
                    </span>
                  </div>
                ) : (
                  <div className="text-2xs text-[var(--text-muted)]">
                    Foundational tool · Independent practice
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Hover a skill to see where I've used it.
                </p>
                <div className="flex flex-wrap gap-1.5 opacity-60">
                  {PROJECT_NODES.map((proj) => (
                    <span
                      key={proj}
                      className="px-2 py-0.5 rounded text-2xs bg-white/5 border border-white/10 text-[var(--text-secondary)] font-mono"
                    >
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            SKILLS GRID: 3x2 Grid for the first 6 Cards
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gridCards.map((card) => {
            const hasCardFocus = hoveredSkill && card.skills.some((s) => s.name === hoveredSkill);
            const isCardDimmed = hoveredSkill && !hasCardFocus;

            return (
              <div
                key={card.id}
                className={`skill-card p-6 md:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-2)]/90 border transition-all duration-[var(--dur-base)] ease-[var(--ease-standard)] shadow-[var(--shadow-card)] flex flex-col justify-between ${
                  hasCardFocus
                    ? 'border-[var(--color-data)] shadow-[var(--glow-cyan-sm)] -translate-y-1'
                    : isCardDimmed
                    ? 'border-[var(--border-subtle)] opacity-40'
                    : 'border-[var(--border-subtle)] hover:border-[var(--color-data)]/50 hover:shadow-[var(--glow-cyan-sm)]'
                }`}
              >
                <div>
                  <h3 className="text-xs font-mono tracking-mono-md uppercase pb-4 mb-6 border-b border-[var(--border-default)] flex items-center justify-between">
                    <span className={hasCardFocus ? 'text-[var(--color-data)] font-semibold' : 'text-[var(--color-data)]'}>
                      {card.title}
                    </span>
                    <span className="text-2xs text-[var(--text-secondary)] opacity-60 font-mono">
                      [{card.skills.length}]
                    </span>
                  </h3>

                  <div className="space-y-3.5">
                    {card.skills.map((skill) => {
                      const isSkillHovered = hoveredSkill === skill.name;
                      const tierLabel = getTierLabel(card.group, skill.pips);

                      return (
                        <div
                          key={skill.name}
                          tabIndex={0}
                          onMouseEnter={() => handleSkillHover(skill.name)}
                          onMouseLeave={handleSkillLeave}
                          onFocus={() => handleSkillHover(skill.name)}
                          onBlur={handleSkillLeave}
                          aria-label={`${skill.name}, ${skill.pips} of 3 pips: ${tierLabel}`}
                          className={`group cursor-pointer py-1.5 px-2 -mx-2 rounded-[var(--radius-sm)] border-b border-white/[0.03] transition-all duration-[var(--dur-base)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 focus:outline-none focus:bg-white/5 focus:border-[var(--color-accent)]/40 ${
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

                          {/* 3-Pip Telemetry Indicator + Tier Label */}
                          <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3].map((pipIndex) => {
                                const isFilled = pipIndex <= skill.pips;
                                return (
                                  <div
                                    key={pipIndex}
                                    className={`w-3.5 h-1.5 rounded-[1px] transition-all duration-[var(--dur-base)] ${
                                      isFilled
                                        ? isSkillHovered
                                          ? 'skill-meter-segment skill-meter-segment-filled skill-pip skill-pip-filled bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]'
                                          : 'skill-meter-segment skill-meter-segment-filled skill-pip skill-pip-filled bg-[var(--color-data)] shadow-[var(--glow-cyan-sm)]'
                                        : 'skill-meter-segment skill-pip bg-white/10'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-2xs font-mono text-[var(--text-secondary)] uppercase w-28 text-right font-medium">
                              {tierLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            7. TOOLS & DESIGN: Full-Width Horizontal Strip Below Grid
            ========================================================================= */}
        {toolsCard && (
          <div className="tools-strip-card mt-8 p-6 md:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-2)]/90 border border-[var(--border-subtle)] hover:border-[var(--color-data)]/50 hover:shadow-[var(--glow-cyan-sm)] transition-all duration-[var(--dur-base)] shadow-[var(--shadow-card)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono tracking-mono-md uppercase text-[var(--color-data)] font-semibold">
                  {toolsCard.title}
                </span>
                <span className="text-2xs text-[var(--text-secondary)] opacity-60 font-mono">
                  [{toolsCard.skills.length}]
                </span>
              </div>
              <span className="text-2xs font-mono text-[var(--text-secondary)] uppercase">
                Workflow, Versioning & Prototyping
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {toolsCard.skills.map((skill) => {
                const isSkillHovered = hoveredSkill === skill.name;
                const tierLabel = getTierLabel(toolsCard.group, skill.pips);

                return (
                  <div
                    key={skill.name}
                    tabIndex={0}
                    onMouseEnter={() => handleSkillHover(skill.name)}
                    onMouseLeave={handleSkillLeave}
                    onFocus={() => handleSkillHover(skill.name)}
                    onBlur={handleSkillLeave}
                    aria-label={`${skill.name}, ${skill.pips} of 3 pips: ${tierLabel}`}
                    className={`group cursor-pointer py-2.5 px-3.5 rounded-[var(--radius-md)] border transition-all duration-[var(--dur-base)] flex items-center justify-between gap-3 focus:outline-none focus:border-[var(--color-accent)] ${
                      isSkillHovered
                        ? 'bg-white/5 border-[var(--color-accent)]/50 -translate-y-0.5'
                        : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
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

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((pipIndex) => {
                          const isFilled = pipIndex <= skill.pips;
                          return (
                            <div
                              key={pipIndex}
                              className={`w-3.5 h-1.5 rounded-[1px] transition-all duration-[var(--dur-base)] ${
                                isFilled
                                  ? isSkillHovered
                                    ? 'skill-meter-segment skill-meter-segment-filled skill-pip skill-pip-filled bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]'
                                    : 'skill-meter-segment skill-meter-segment-filled skill-pip skill-pip-filled bg-[var(--color-data)] shadow-[var(--glow-cyan-sm)]'
                                  : 'skill-meter-segment skill-pip bg-white/10'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-2xs font-mono text-[var(--text-secondary)] uppercase w-20 text-right font-medium">
                        {tierLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            CURRENTLY EXPLORING STRIP
            ========================================================================= */}
        <div className="skills-exploring-row mt-12 pt-8 border-t border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--color-data)] uppercase flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--color-data)] animate-pulse shadow-[var(--glow-cyan-sm)]" />
            <span className="font-semibold">CURRENTLY EXPLORING:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-2xs tracking-mono-sm uppercase text-[var(--text-secondary)]">
            {CURRENTLY_EXPLORING.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-[var(--border-subtle)] hover:border-[var(--color-data)]/40 hover:text-[var(--text-primary)] transition-colors text-[var(--text-primary)] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================================
            BEYOND THE STACK (SOFT SKILLS)
            ========================================================================= */}
        <div className="skills-soft-row mt-8 pt-8 border-t border-[var(--border-default)] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--color-accent)] uppercase flex-shrink-0 sm:pt-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
            <span className="font-semibold">BEYOND THE STACK:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-2xs tracking-mono-sm uppercase text-[var(--text-secondary)] sm:max-w-2xl">
            {SOFT_SKILLS.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[var(--border-subtle)] hover:border-[var(--color-accent)]/40 hover:text-[var(--text-primary)] transition-colors text-[var(--text-primary)]"
              >
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CERTIFICATES STRIP
            ========================================================================= */}
        <div className="skills-cert-row mt-8 pt-8 border-t border-[var(--border-default)] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="inline-flex items-center gap-3 text-xs tracking-mono-lg font-mono text-[var(--color-data)] uppercase flex-shrink-0 sm:pt-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-data)] shadow-[var(--glow-cyan-sm)]" />
            <span className="font-semibold">CERTIFIED:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:max-w-2xl">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.title}
                className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/90 border border-[var(--border-subtle)] hover:border-[var(--color-accent)]/50 transition-all flex flex-col justify-between gap-2.5 group"
              >
                <div>
                  <h4 className="text-xs font-mono font-medium text-[var(--text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    {cert.title}
                  </h4>
                  {cert.issuer && (
                    <p className="text-2xs font-mono text-[var(--text-secondary)] mt-0.5">
                      {cert.issuer}
                    </p>
                  )}
                </div>
                {/* TODO: add certificate URL */}
                <a
                  href={cert.url}
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="inline-flex items-center gap-1 text-2xs font-mono text-[var(--color-accent)] hover:underline uppercase self-start"
                >
                  <span>VIEW</span>
                  <span>↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            THIS SITE IS BUILT WITH
            ========================================================================= */}
        <div className="skills-built-row mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-2xs font-mono text-[var(--text-secondary)] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="font-medium text-[var(--text-secondary)]">THIS SITE IS BUILT WITH:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono">
            {BUILT_WITH.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[var(--text-primary)] tracking-mono-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
