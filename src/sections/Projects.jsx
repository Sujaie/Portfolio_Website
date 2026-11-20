import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolio.js';
import { sound } from '../utils/sound.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

function AnimatedCounter({ target, label, colorClass }) {
  const [displayValue, setDisplayValue] = useState(target);
  const elementRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Parse numeric part
            const numericMatch = target.match(/[\d.]+/);
            if (numericMatch) {
              const targetNum = parseFloat(numericMatch[0]);
              const prefix = target.startsWith('<') ? '< ' : '';
              const suffix = target.replace(prefix, '').replace(numericMatch[0], '');

              const obj = { val: 0 };
              gsap.to(obj, {
                val: targetNum,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => {
                  const formatted = targetNum % 1 !== 0 
                    ? obj.val.toFixed(1) 
                    : Math.round(obj.val);
                  setDisplayValue(`${prefix}${formatted}${suffix}`);
                },
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, prefersReduced]);

  return (
    <div ref={elementRef} className="p-3 rounded-[var(--radius-md)] bg-white/[0.03] border border-[var(--border-subtle)]">
      <div className="text-2xs font-mono text-[var(--text-secondary)] uppercase">{label}</div>
      <div className={`text-sm font-semibold mt-1 font-mono ${colorClass}`}>
        {displayValue}
      </div>
    </div>
  );
}

function TiltProjectCard({ proj, isEven, nextProj }) {
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const rectRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'arch' | 'terminal'
  const [terminalInput, setTerminalInput] = useState('');
  const [isBooted, setIsBooted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    'cluster.node.01: healthy (latency: 12ms)',
    'vector.index: 768-dim HNSW initialized',
    'security.audit: zero vulnerable endpoints'
  ]);

  useEffect(() => {
    if (prefersReduced) {
      setIsBooted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isBooted) {
            setIsBooted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isBooted, prefersReduced]);

  const handleMouseEnter = () => {
    if (prefersReduced) return;
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (prefersReduced) return;
    if (!cardRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    if (sheenRef.current) {
      sheenRef.current.style.background = `radial-gradient(circle 350px at ${shineX.toFixed(1)}% ${shineY.toFixed(1)}%, rgba(31, 194, 201, 0.16), transparent 70%)`;
      sheenRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
    if (sheenRef.current) {
      sheenRef.current.style.opacity = '0';
    }
  };

  const runCommand = (cmd) => {
    sound.playClick();
    if (cmd === 'ping') {
      setTerminalLogs((prev) => [...prev, '$ ping', '→ 64 bytes from edge.cluster: icmp_seq=1 time=0.84ms']);
    } else if (cmd === 'stack') {
      setTerminalLogs((prev) => [...prev, '$ stack', `→ ${proj.stack.join(', ')}`]);
    } else if (cmd === 'clear') {
      setTerminalLogs(['$ terminal reset']);
    } else {
      setTerminalLogs((prev) => [...prev, `$ ${cmd || 'status'}`, '→ system operational. all services nominal.']);
    }
    setTerminalInput('');
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
        isEven ? '' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Visual Interactive Preview with 3D Tilt & Machine Booting */}
      <div className={`lg:col-span-7 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
        <div
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform var(--dur-fast) var(--ease-out)',
          }}
          className="relative rounded-[var(--radius-xl)] bg-gradient-to-b from-[var(--surface-card-start)] to-[var(--surface-card-end)] border border-[var(--border-default)] p-[var(--card-padding)] overflow-hidden hover:border-[var(--color-data)]/50 hover:-translate-y-1 transition-[transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-standard)] group will-change-transform shadow-[var(--shadow-card)]"
        >
          {/* Dynamic Cursor Light Sheen */}
          <div
            ref={sheenRef}
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--dur-slow)]"
            style={{
              background: 'radial-gradient(circle 350px at 50% 50%, rgba(31, 194, 201, 0.14), transparent 70%)',
            }}
          />

          {/* Window Title Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)] mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className={`w-2.5 h-2.5 rounded-full ${isBooted ? 'bg-green-500/80 shadow-[var(--glow-cyan-sm)]' : 'bg-green-500/40 animate-pulse'}`} />
              <span className="text-2xs tracking-wider text-[var(--text-secondary)] font-mono ml-2">
                {proj.name.toLowerCase().replace(/\s+/g, '-')}.sys
              </span>
              <span className="text-2xs font-mono text-[var(--color-data)] ml-3 hidden sm:inline">
                [{isBooted ? 'ONLINE' : 'BOOTING...'}]
              </span>
            </div>

            {/* Interactive View Modes: Telemetry / Architecture / CLI */}
            <div
              role="tablist"
              aria-label="Project card display modes"
              className="flex items-center gap-1 bg-black/40 p-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
            >
              {['telemetry', 'arch', 'terminal'].map((mode) => (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={activeTab === mode}
                  aria-controls={`proj-panel-${proj.num}-${mode}`}
                  id={`proj-tab-${proj.num}-${mode}`}
                  aria-label={`Switch to ${mode} mode`}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(mode);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`text-2xs font-mono tracking-mono-sm uppercase px-2 py-0.5 rounded cursor-pointer transition-colors duration-[var(--dur-base)] ${
                    activeTab === mode
                      ? 'bg-[var(--color-accent)] text-black font-semibold shadow-[var(--glow-gold-sm)]'
                      : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Telemetry View with Live Counter Rollup */}
          {activeTab === 'telemetry' && (
            <div
              id={`proj-panel-${proj.num}-telemetry`}
              role="tabpanel"
              aria-labelledby={`proj-tab-${proj.num}-telemetry`}
              className="relative z-10 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/95 border border-[var(--border-subtle)] p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-md)] bg-white/5 border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-data)] animate-ping" />
                  <span className="text-sm font-mono text-[var(--text-primary)]">Streaming Telemetry Feed</span>
                </div>
                <span className="text-sm font-mono text-[var(--color-accent)] font-medium">
                  {proj.impact}
                </span>
              </div>

              {/* Sparkline & Animated Counters */}
              <div className="grid grid-cols-3 gap-3">
                <AnimatedCounter
                  label="Throughput"
                  target="1.2M RPS"
                  colorClass="text-[var(--color-data)]"
                />
                <AnimatedCounter
                  label="Memory Footprint"
                  target="42 MB"
                  colorClass="text-[var(--color-accent)]"
                />
                <AnimatedCounter
                  label="Latency"
                  target="< 14ms"
                  colorClass="text-[var(--color-status-success)]"
                />
              </div>

              {/* Live Activity Sparkline */}
              <div className="flex items-end gap-1.5 h-6 pt-2 opacity-80">
                {[40, 65, 30, 85, 90, 48, 70, 80, 95, 55, 88, 100, 75, 92, 68].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[var(--color-data)] to-[var(--color-accent)] rounded-t-[var(--radius-sm)] transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Architecture Diagram */}
          {activeTab === 'arch' && (
            <div
              id={`proj-panel-${proj.num}-arch`}
              role="tabpanel"
              aria-labelledby={`proj-tab-${proj.num}-arch`}
              className="relative z-10 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/95 border border-[var(--border-subtle)] p-6 space-y-4 font-mono text-xs"
            >
              <div className="text-[var(--text-secondary)] text-2xs uppercase tracking-wider mb-2">SYSTEM TOPOLOGY:</div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-white/5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] text-center">
                <div className="px-3 py-1.5 bg-[var(--color-data)]/20 border border-[var(--color-data)]/40 rounded-[var(--radius-md)] text-[var(--color-data)]">Edge Proxy (gRPC)</div>
                <span className="text-[var(--color-accent)]">→</span>
                <div className="px-3 py-1.5 bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 rounded-[var(--radius-md)] text-[var(--color-accent)]">Worker Pool</div>
                <span className="text-[var(--color-accent)]">→</span>
                <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-[var(--radius-md)] text-[var(--color-status-success)]">PostgreSQL (pgvector)</div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Asynchronous state pipeline with automated backpressure regulation and zero-copy JSON parsing.
              </p>
            </div>
          )}

          {/* Tab 3: Interactive Terminal */}
          {activeTab === 'terminal' && (
            <div
              id={`proj-panel-${proj.num}-terminal`}
              role="tabpanel"
              aria-labelledby={`proj-tab-${proj.num}-terminal`}
              className="relative z-10 rounded-[var(--radius-lg)] bg-black/90 border border-[var(--border-default)] p-4 font-mono text-xs space-y-2"
            >
              <div className="max-h-32 overflow-y-auto space-y-1 text-[var(--text-secondary)]">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={log.startsWith('$') ? 'text-white' : 'text-[var(--color-data)]'}>
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Quick Command Chips */}
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-default)]">
                <span className="text-2xs text-[var(--color-accent)]">RUN:</span>
                {['ping', 'stack', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => runCommand(cmd)}
                    aria-label={`Run terminal ${cmd} command`}
                    className="text-2xs px-2 py-0.5 rounded-[var(--radius-sm)] bg-white/10 hover:bg-[var(--color-accent)] hover:text-black transition-colors duration-[var(--dur-base)] cursor-pointer"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Details Column */}
      <div className={`lg:col-span-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'} flex flex-col justify-center`}>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-num-display font-mono font-light text-[var(--color-accent)]/80">
            {proj.num}
          </span>
          <span className="text-2xs tracking-mono-md uppercase font-mono font-semibold text-[var(--color-data)] px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-data)]/10 border border-[var(--color-data)]/20">
            {proj.role}
          </span>
        </div>

        <h3 className="text-3xl font-light text-[var(--text-primary)] mb-4">
          {proj.name}
        </h3>

        <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed mb-6">
          {proj.description}
        </p>

        <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-white/[0.03] border border-[var(--border-subtle)]">
          <div className="text-2xs font-mono tracking-mono-sm uppercase text-[var(--color-accent)] font-semibold mb-1">
            IMPACT & HIGHLIGHT
          </div>
          <div className="text-sm text-[var(--text-primary)] font-light leading-normal">
            {proj.impact}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {proj.stack.map((item) => (
            <span
              key={item}
              className="text-2xs tracking-mono-sm font-mono px-3 py-1 rounded-full bg-white/5 border border-[var(--border-default)] text-[var(--text-primary)]"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Links & Next Project Teaser */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-6 text-sm tracking-mono-md font-mono uppercase font-semibold">
            <a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code for ${proj.name} on GitHub (opens in new tab)`}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)] flex items-center gap-1.5"
            >
              <span>SOURCE CODE</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          {nextProj && (
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                const nextEl = document.getElementById(`proj-${nextProj.num}`);
                if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-2xs font-mono text-[var(--text-secondary)] hover:text-[var(--color-data)] transition-colors uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>NEXT: {nextProj.num} {nextProj.name}</span>
              <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects } = portfolioData;

  return (
    <section
      id="work"
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] bg-transparent border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-[var(--section-header-mb)]">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-data)] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] shadow-[var(--glow-cyan-sm)]" />
              <span>SELECTED PRODUCTIONS</span>
            </div>
            <h2 className="text-section-heading font-light text-[var(--text-primary)] tracking-section leading-section">
              FEATURED <span className="font-serif italic text-[var(--color-accent)]">WORKS</span>
            </h2>
          </div>
          <span className="text-sm tracking-mono-md uppercase text-[var(--text-secondary)] pb-2 font-mono">
            ARCHIVE 2024 — 2026
          </span>
        </div>

        <div className="space-y-24 md:space-y-36">
          {projects.map((proj, idx) => (
            <div key={proj.num} id={`proj-${proj.num}`}>
              <TiltProjectCard
                proj={proj}
                isEven={idx % 2 === 0}
                nextProj={projects[(idx + 1) % projects.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
