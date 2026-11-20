import React, { useState } from 'react';

export default function StyleGuide({ onBack }) {
  const [debugGrid, setDebugGrid] = useState(false);
  const [motionActive, setMotionActive] = useState({
    fast: false,
    base: false,
    slow: false,
    deliberate: false,
  });

  const triggerMotion = (key) => {
    setMotionActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. Primitive Palette (Look Bible Values)
  const primitiveColors = [
    { group: 'Inks (Canvas, Depth Planes & Elevation)', items: [
      { token: '--ink-950', val: '#04070b', desc: 'Base Canvas (Plane 0)' },
      { token: '--ink-900', val: '#070c12', desc: 'Substrate & Recessed (Plane 1)' },
      { token: '--ink-850', val: '#091018', desc: 'Telemetry Bed (Plane 1.5)' },
      { token: '--ink-800', val: '#0c131b', desc: 'Standard Panels (Plane 2)' },
      { token: '--ink-700', val: '#121b25', desc: 'Raised / Active Cards (Plane 3)' },
      { token: '--ink-600', val: '#1b2633', desc: 'Popovers & Tooltips (Plane 4)' },
      { token: '--ink-500', val: '#263545', desc: 'Overlays & Dialogs (Plane 5)' },
    ]},
    { group: 'Papers & Greys (Typography & Hierarchy)', items: [
      { token: '--paper-50', val: '#f6f3ee', desc: 'Primary Text (Bone White, 18.2:1)' },
      { token: '--paper-100', val: '#ffffff', desc: 'Pure White (Emphasis)' },
      { token: '--grey-300', val: '#b5bcc6', desc: 'Secondary Metadata (10.6:1)' },
      { token: '--grey-400', val: '#949ea9', desc: 'Muted Labels (7.2:1)' },
      { token: '--grey-500', val: '#7d8793', desc: 'Borders & Rules (5.1:1)' },
    ]},
    { group: 'Golds & Ambers (Warm Accents & Ignition)', items: [
      { token: '--gold-300', val: '#fad47e', desc: 'Ambient Gold Stop' },
      { token: '--gold-400', val: '#f4be54', desc: 'Luminous Gold Hover' },
      { token: '--gold-500', val: '#e8a823', desc: 'Architectural Gold Focal Accent' },
      { token: '--gold-600', val: '#b88114', desc: 'Deep Gold Border Accent' },
    ]},
    { group: 'Teals & Cyans (Telemetry & Technical Signal)', items: [
      { token: '--teal-300', val: '#4ee2e8', desc: 'Bright Data Glow' },
      { token: '--teal-400', val: '#1fc2c9', desc: 'Electric Cyan Technical Signal' },
      { token: '--teal-500', val: '#159ea4', desc: 'Deep Cyan Border Accent' },
      { token: '--teal-900', val: '#063133', desc: 'Atmospheric Well Cyan' },
    ]},
  ];

  // 2. The Six Depth Planes
  const depthPlanes = [
    { plane: 'Plane 0', token: '--plane-0', ref: 'var(--ink-950)', desc: 'Base canvas underneath all content', bg: '#04070b' },
    { plane: 'Plane 1', token: '--plane-1', ref: 'var(--ink-900)', desc: 'Substrate: sections, recessed areas, cards', bg: '#070c12' },
    { plane: 'Plane 2', token: '--plane-2', ref: 'var(--ink-800)', desc: 'Panel: standard cards, showcase, timeline beds', bg: '#0c131b' },
    { plane: 'Plane 3', token: '--plane-3', ref: 'var(--ink-700)', desc: 'Raised: active cards, terminal, hovered items', bg: '#121b25' },
    { plane: 'Plane 4', token: '--plane-4', ref: 'var(--ink-600)', desc: 'Popover: dropdowns, tooltips, toasts', bg: '#1b2633' },
    { plane: 'Plane 5', token: '--plane-5', ref: 'var(--ink-500)', desc: 'Overlay: modal dialogs, lightbox', bg: '#263545' },
  ];

  // 3. Semantic Tokens
  const semanticTokens = [
    { token: '--bg-base', ref: 'var(--plane-0)', desc: 'Main canvas background' },
    { token: '--bg-raised', ref: 'var(--plane-1)', desc: 'Primary cards & panels' },
    { token: '--surface-1', ref: 'var(--plane-1)', desc: 'Surface tier 1' },
    { token: '--surface-2', ref: 'var(--plane-2)', desc: 'Surface tier 2 (nested data)' },
    { token: '--surface-3', ref: 'var(--plane-3)', desc: 'Surface tier 3 (elevated active)' },
    { token: '--text-primary', ref: 'var(--paper-50)', desc: 'Primary headings & body' },
    { token: '--text-secondary', ref: 'var(--grey-300)', desc: 'Metadata, labels & captions' },
    { token: '--text-muted', ref: 'var(--grey-400)', desc: 'Subdued telemetry chips' },
    { token: '--color-accent', ref: 'var(--gold-500)', desc: 'Interactive gold & badges' },
    { token: '--color-data', ref: 'var(--teal-400)', desc: 'Electric cyan telemetry' },
    { token: '--border-subtle', ref: 'rgba(255, 255, 255, 0.06)', desc: 'Dividers & soft borders' },
    { token: '--border-default', ref: 'rgba(255, 255, 255, 0.10)', desc: 'Standard card outlines' },
    { token: '--border-strong', ref: 'rgba(255, 255, 255, 0.16)', desc: 'Emphasized containers' },
    { token: '--border-elevated', ref: 'rgba(255, 255, 255, 0.22)', desc: 'Interactive outlines' },
  ];

  // 4. Spacing Scale
  const spacingScale = [
    { token: '--space-1', val: '0.25rem', px: '4px' },
    { token: '--space-2', val: '0.5rem', px: '8px' },
    { token: '--space-3', val: '0.75rem', px: '12px' },
    { token: '--space-4', val: '1rem', px: '16px' },
    { token: '--space-5', val: '1.25rem', px: '20px' },
    { token: '--space-6', val: '1.5rem', px: '24px' },
    { token: '--space-8', val: '2rem', px: '32px' },
    { token: '--space-10', val: '2.5rem', px: '40px' },
    { token: '--space-12', val: '3rem', px: '48px' },
    { token: '--space-16', val: '4rem', px: '64px' },
    { token: '--space-20', val: '5rem', px: '80px' },
    { token: '--space-24', val: '6rem', px: '96px' },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans pb-32">
      
      {/* Optional Debug Grid Overlay */}
      {debugGrid && (
        <div className="fixed inset-0 pointer-events-none z-50 px-[var(--page-gutter)] max-w-[var(--content-max-width)] mx-auto grid grid-cols-12 gap-[var(--grid-gap-lg)] opacity-15">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full bg-red-500 border-x border-red-400" />
          ))}
        </div>
      )}

      {/* Sticky Style Guide Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-base)]/95 backdrop-blur-md border-b border-[var(--border-default)] px-[var(--page-gutter)] py-4">
        <div className="max-w-[var(--content-max-width)] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              aria-label="Return to portfolio application"
              className="px-3 py-1.5 rounded-full border border-[var(--border-default)] hover:border-[var(--color-accent)] text-xs font-mono text-[var(--text-secondary)] hover:text-white transition-colors duration-[var(--dur-base)] cursor-pointer"
            >
              ← PORTFOLIO
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
              <h1 className="text-sm font-mono tracking-mono-lg uppercase font-semibold text-[var(--text-primary)]">
                DESIGN SYSTEM SPECIFICATION
              </h1>
            </div>
            <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CORE LOOK VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDebugGrid(!debugGrid)}
              aria-pressed={debugGrid}
              className={`px-3 py-1.5 rounded-full text-2xs font-mono tracking-mono-sm uppercase transition-colors duration-[var(--dur-base)] cursor-pointer border ${
                debugGrid
                  ? 'bg-[var(--color-data)] text-black font-semibold border-[var(--color-data)]'
                  : 'bg-white/5 text-[var(--text-secondary)] border-[var(--border-default)] hover:text-white'
              }`}
            >
              {debugGrid ? 'GRID: ON' : 'GRID: OFF'}
            </button>
            <nav className="hidden xl:flex items-center gap-4 text-2xs font-mono uppercase text-[var(--text-secondary)]">
              <a href="#planes" className="hover:text-white">Planes</a>
              <a href="#colors" className="hover:text-white">Colors</a>
              <a href="#typography" className="hover:text-white">Typography</a>
              <a href="#spacing" className="hover:text-white">Spacing</a>
              <a href="#radius" className="hover:text-white">Radius</a>
              <a href="#elevation" className="hover:text-white">Elevation</a>
              <a href="#motion" className="hover:text-white">Motion</a>
              <a href="#cursor" className="hover:text-white">Cursor</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-[var(--content-max-width)] mx-auto px-[var(--page-gutter)] pt-12 space-y-24">

        {/* 1. THE SIX DEPTH PLANES SHOWCASE */}
        <section id="planes" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 01
            </div>
            <h2 className="text-3xl font-light text-white">The Six Depth Planes</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Rigid surface hierarchy from Plane 0 (deep canvas) through Plane 5 (interactive overlays).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {depthPlanes.map((dp) => (
              <div
                key={dp.plane}
                className="p-6 rounded-[var(--radius-xl)] border border-[var(--border-default)] space-y-4"
                style={{ backgroundColor: dp.bg }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-semibold text-[var(--color-accent)] uppercase">
                    {dp.plane}
                  </span>
                  <span className="text-2xs font-mono text-[var(--text-secondary)]">
                    {dp.bg}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-mono text-white">{dp.token}</div>
                  <div className="text-2xs text-[var(--text-secondary)] font-light mt-1">{dp.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. COLOR TOKENS SHOWCASE */}
        <section id="colors" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 02
            </div>
            <h2 className="text-3xl font-light text-white">Color System Architecture</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Two-level token hierarchy: Level 1 primitives and Level 2 semantic abstractions.
            </p>
          </div>

          {/* Primitive Swatches */}
          <div className="space-y-8">
            {primitiveColors.map((group) => (
              <div key={group.group} className="space-y-3">
                <h3 className="text-xs font-mono tracking-mono-md uppercase text-[var(--text-secondary)]">
                  {group.group}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {group.items.map((c) => (
                    <div
                      key={c.token}
                      className="p-3 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-subtle)] space-y-2.5"
                    >
                      <div
                        className="w-full h-12 rounded-[var(--radius-md)] border border-white/10 shadow-inner"
                        style={{ backgroundColor: c.val }}
                      />
                      <div>
                        <div className="text-2xs font-mono font-semibold text-white truncate" title={c.token}>
                          {c.token}
                        </div>
                        <div className="text-2xs font-mono text-[var(--color-accent)]">{c.val}</div>
                        <div className="text-2xs text-[var(--text-secondary)] font-light truncate mt-0.5">
                          {c.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Semantic Swatches */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-mono tracking-mono-md uppercase text-[var(--color-data)]">
              Semantic Tokens (Role-Driven Primitives)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {semanticTokens.map((s) => (
                <div
                  key={s.token}
                  className="flex items-center gap-3.5 p-3 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-subtle)]"
                >
                  <div
                    className="w-10 h-10 rounded-[var(--radius-md)] border border-white/10 flex-shrink-0"
                    style={{ backgroundColor: `var(${s.token})` }}
                  />
                  <div className="min-w-0">
                    <div className="text-2xs font-mono font-semibold text-white truncate" title={s.token}>
                      {s.token}
                    </div>
                    <div className="text-2xs font-mono text-[var(--text-secondary)] truncate">
                      {s.ref}
                    </div>
                    <div className="text-2xs text-[var(--text-secondary)] font-light truncate">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. TYPOGRAPHY SHOWCASE */}
        <section id="typography" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 03
            </div>
            <h2 className="text-3xl font-light text-white">Responsive & Fluid Typography</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Three intentional typography voices: Display sans-serif, editorial serif italic, and technical monospace.
            </p>
          </div>

          <div className="space-y-8 bg-[var(--bg-raised)] p-6 md:p-8 rounded-[var(--radius-xl)] border border-[var(--border-default)]">
            
            {/* Hero Display */}
            <div className="pb-8 border-b border-[var(--border-subtle)] space-y-2">
              <div className="flex items-baseline justify-between text-2xs font-mono text-[var(--color-data)]">
                <span>--text-hero-display (clamp(3rem, 8.5vw, 7.5rem))</span>
                <span>Sans-serif display</span>
              </div>
              <div className="text-hero-display font-light leading-hero tracking-hero text-[var(--text-primary)]">
                CREATIVE DEVELOPER
              </div>
            </div>

            {/* Serif Italic Hero Accent */}
            <div className="pb-8 border-b border-[var(--border-subtle)] space-y-2">
              <div className="flex items-baseline justify-between text-2xs font-mono text-[var(--color-accent)]">
                <span>--text-hero-accent (clamp(3.2rem, 9vw, 8rem))</span>
                <span>Serif italic accent</span>
              </div>
              <div className="font-serif italic text-hero-accent leading-hero-accent text-[var(--color-accent)] drop-shadow-[var(--glow-gold-lg)]">
                SOFTWARE
              </div>
            </div>

            {/* Section Heading */}
            <div className="pb-8 border-b border-[var(--border-subtle)] space-y-2">
              <div className="flex items-baseline justify-between text-2xs font-mono text-[var(--color-data)]">
                <span>--text-section-heading (clamp(2rem, 4.5vw, 3.5rem))</span>
                <span>Section title scale</span>
              </div>
              <h2 className="text-section-heading font-light text-white tracking-section leading-section">
                FEATURED <span className="font-serif italic text-[var(--color-accent)]">WORKS</span>
              </h2>
            </div>

            {/* Section Lead */}
            <div className="pb-8 border-b border-[var(--border-subtle)] space-y-2">
              <div className="flex items-baseline justify-between text-2xs font-mono text-[var(--color-accent)]">
                <span>--text-section-lead (clamp(1.75rem, 3vw, 2.5rem))</span>
                <span>About narrative lead</span>
              </div>
              <h3 className="text-section-lead font-light text-[var(--text-primary)] leading-section-lead max-w-2xl">
                I'm Sujaie. <span className="font-serif italic text-[var(--color-accent)]">Crafting systems</span> with intention & intelligence.
              </h3>
            </div>

            {/* Body Typography */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-[var(--border-subtle)]">
              <div className="space-y-2">
                <div className="text-2xs font-mono text-[var(--text-secondary)]">--text-base (16px) • Leading relaxed</div>
                <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
                  I build thoughtful digital experiences, explore artificial intelligence, and enjoy turning ambitious concepts into resilient, functional products. Bridging rigorous systems engineering with art-directed frontends.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xs font-mono text-[var(--text-secondary)]">--text-sm (14px) • Leading normal</div>
                <p className="text-sm text-[var(--text-secondary)] font-light leading-normal">
                  Low-latency streaming platform for vision-language generation with local-first inference pipelines and interactive canvas manipulation. Microservices architecture with Kafka event ingestion.
                </p>
              </div>
            </div>

            {/* Monospace Metadata Scale */}
            <div className="space-y-4">
              <div className="text-2xs font-mono text-[var(--color-data)]">Monospace Scale Hierarchy</div>
              <div className="flex flex-wrap items-center gap-6">
                <span className="text-caption font-mono uppercase tracking-mono-lg text-white">
                  [caption: 13px] SUJAIE / DEV
                </span>
                <span className="text-xs font-mono uppercase tracking-mono-md text-[var(--color-accent)]">
                  [xs: 12px] SELECTED PRODUCTIONS
                </span>
                <span className="text-2xs font-mono uppercase tracking-mono-sm text-[var(--text-secondary)]">
                  [2xs: 11px] 60 FPS CANVAS • 1.2M RPS
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. SPACING & RHYTHM SHOWCASE */}
        <section id="spacing" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 04
            </div>
            <h2 className="text-3xl font-light text-white">Spacing & Rhythm Foundation</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Consistent 4px foundational scale paired with fluid viewport gutters and vertical rhythm.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Bars for Relative Values */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-data)]">
                Base Spacing Scale
              </h3>
              <div className="space-y-3">
                {spacingScale.map((s) => (
                  <div key={s.token} className="flex items-center gap-4 text-xs font-mono">
                    <span className="w-24 text-[var(--text-secondary)] flex-shrink-0">{s.token}</span>
                    <span className="w-16 text-[var(--color-accent)] flex-shrink-0">{s.px}</span>
                    <div className="flex-1 bg-white/5 rounded-full overflow-hidden h-3 flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--color-data)] to-[var(--color-accent)] rounded-full"
                        style={{ width: `min(100%, calc(${s.val} * 3.5))` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout Geometry Tokens */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-data)]">
                Layout Geometry Tokens
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-[var(--radius-lg)] bg-white/5 border border-[var(--border-subtle)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-semibold text-white">--content-max-width</div>
                    <div className="text-2xs text-[var(--text-secondary)]">Max horizontal layout bounding plane</div>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-accent)]">1280px</span>
                </div>

                <div className="p-4 rounded-[var(--radius-lg)] bg-white/5 border border-[var(--border-subtle)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-semibold text-white">--page-gutter</div>
                    <div className="text-2xs text-[var(--text-secondary)]">Fluid horizontal container margin</div>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-accent)]">clamp(1.5rem, 4vw, 3rem)</span>
                </div>

                <div className="p-4 rounded-[var(--radius-lg)] bg-white/5 border border-[var(--border-subtle)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-semibold text-white">--section-py</div>
                    <div className="text-2xs text-[var(--text-secondary)]">Standard vertical section padding</div>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-accent)]">clamp(5rem, 8vw, 8rem)</span>
                </div>

                <div className="p-4 rounded-[var(--radius-lg)] bg-white/5 border border-[var(--border-subtle)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-semibold text-white">--grid-gap-lg</div>
                    <div className="text-2xs text-[var(--text-secondary)]">Two-column architectural gap</div>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-accent)]">clamp(2rem, 3.5vw, 3.5rem)</span>
                </div>

                <div className="p-4 rounded-[var(--radius-lg)] bg-white/5 border border-[var(--border-subtle)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono font-semibold text-white">--nav-height</div>
                    <div className="text-2xs text-[var(--text-secondary)]">Desktop & mobile fixed navbar height</div>
                  </div>
                  <span className="text-sm font-mono text-[var(--color-accent)]">72px / 64px</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. RADIUS SHOWCASE */}
        <section id="radius" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 05
            </div>
            <h2 className="text-3xl font-light text-white">Border Radius Scale</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Deliberate corner rounding hierarchy reflecting component scale and tactile purpose.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            <div className="p-5 rounded-[var(--radius-sm)] bg-[var(--bg-raised)] border border-[var(--border-default)] text-center space-y-2">
              <div className="text-xs font-mono text-[var(--color-accent)]">--radius-sm</div>
              <div className="text-2xs text-[var(--text-secondary)] font-mono">4px (0.25rem)</div>
              <div className="text-2xs text-white/70">Tags, chips & sparklines</div>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-raised)] border border-[var(--border-default)] text-center space-y-2">
              <div className="text-xs font-mono text-[var(--color-accent)]">--radius-md</div>
              <div className="text-2xs text-[var(--text-secondary)] font-mono">8px (0.5rem)</div>
              <div className="text-2xs text-white/70">Inputs & metric tiles</div>
            </div>

            <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-default)] text-center space-y-2">
              <div className="text-xs font-mono text-[var(--color-accent)]">--radius-lg</div>
              <div className="text-2xs text-[var(--text-secondary)] font-mono">12px (0.75rem)</div>
              <div className="text-2xs text-white/70">Preview mockups & timeline</div>
            </div>

            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] text-center space-y-2">
              <div className="text-xs font-mono text-[var(--color-accent)]">--radius-xl</div>
              <div className="text-2xs text-[var(--text-secondary)] font-mono">16px (1rem)</div>
              <div className="text-2xs text-white/70">Showcase cards & modals</div>
            </div>

            <div className="p-5 rounded-[var(--radius-full)] bg-[var(--bg-raised)] border border-[var(--border-default)] text-center space-y-2">
              <div className="text-xs font-mono text-[var(--color-accent)]">--radius-full</div>
              <div className="text-2xs text-[var(--text-secondary)] font-mono">9999px (Pill)</div>
              <div className="text-2xs text-white/70">Buttons, badges & lens</div>
            </div>
          </div>
        </section>

        {/* 6. ELEVATION & GLOW SHOWCASE */}
        <section id="elevation" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 06
            </div>
            <h2 className="text-3xl font-light text-white">Elevation, Shadows & Luminous Glows</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Atmospheric depth created with ambient occlusion shadows and optical glow highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--shadow-subtle)] space-y-2">
              <div className="text-xs font-mono text-[var(--color-data)] uppercase">--shadow-subtle</div>
              <div className="text-sm text-white font-light">Subtle elevation layer for secondary floating cards.</div>
            </div>

            <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--shadow-card)] space-y-2">
              <div className="text-xs font-mono text-[var(--color-data)] uppercase">--shadow-card</div>
              <div className="text-sm text-white font-light">Deep ambient occlusion shadow for 3D tilt cards.</div>
            </div>

            <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--shadow-modal)] space-y-2">
              <div className="text-xs font-mono text-[var(--color-data)] uppercase">--shadow-modal</div>
              <div className="text-sm text-white font-light">High-elevation shadow for modal dispatch dialogues.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--glow-gold-sm)] text-center">
              <span className="text-xs font-mono text-[var(--color-accent)]">--glow-gold-sm</span>
            </div>
            <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--glow-gold-lg)] text-center">
              <span className="text-xs font-mono text-[var(--color-accent)]">--glow-gold-lg</span>
            </div>
            <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--glow-cyan-sm)] text-center">
              <span className="text-xs font-mono text-[var(--color-data)]">--glow-cyan-sm</span>
            </div>
            <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-raised)] border border-[var(--border-default)] shadow-[var(--glow-cyan-lg)] text-center">
              <span className="text-xs font-mono text-[var(--color-data)]">--glow-cyan-lg</span>
            </div>
          </div>
        </section>

        {/* 7. MOTION TOKENS SHOWCASE */}
        <section id="motion" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 07
            </div>
            <h2 className="text-3xl font-light text-white">Motion & Easing Physics</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Interactive test controls demonstrating transition durations and easing curves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast Duration */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--color-data)] uppercase">--dur-fast (160ms)</span>
                <button
                  onClick={() => triggerMotion('fast')}
                  className="px-3 py-1 rounded-full text-2xs font-mono bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Trigger
                </button>
              </div>
              <div className="h-16 bg-black/40 rounded-[var(--radius-md)] p-2 flex items-center">
                <div
                  className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--color-data)] transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]"
                  style={{ transform: motionActive.fast ? 'translateX(calc(100% + 120px))' : 'translateX(0)' }}
                />
              </div>
            </div>

            {/* Base Duration */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--color-accent)] uppercase">--dur-base (260ms)</span>
                <button
                  onClick={() => triggerMotion('base')}
                  className="px-3 py-1 rounded-full text-2xs font-mono bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Trigger
                </button>
              </div>
              <div className="h-16 bg-black/40 rounded-[var(--radius-md)] p-2 flex items-center">
                <div
                  className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--color-accent)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]"
                  style={{ transform: motionActive.base ? 'translateX(calc(100% + 120px))' : 'translateX(0)' }}
                />
              </div>
            </div>

            {/* Slow Duration */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--color-data)] uppercase">--dur-slow (440ms)</span>
                <button
                  onClick={() => triggerMotion('slow')}
                  className="px-3 py-1 rounded-full text-2xs font-mono bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Trigger
                </button>
              </div>
              <div className="h-16 bg-black/40 rounded-[var(--radius-md)] p-2 flex items-center">
                <div
                  className="w-12 h-12 rounded-[var(--radius-sm)] bg-emerald-400 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)]"
                  style={{ transform: motionActive.slow ? 'translateX(calc(100% + 120px))' : 'translateX(0)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. CURSOR & INTERACTION SHOWCASE */}
        <section id="cursor" className="space-y-10 scroll-mt-24">
          <div className="border-b border-[var(--border-default)] pb-4">
            <div className="text-xs font-mono tracking-mono-lg uppercase text-[var(--color-accent)] mb-1">
              FOUNDATION 08
            </div>
            <h2 className="text-3xl font-light text-white">Global Optical Glass Lens</h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Performant 120px backdrop-filter glass lens with cyan rim, gold hover expansion, and 0% CPU idle dormancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-4">
              <div className="text-xs font-mono uppercase text-[var(--color-data)]">
                State 1: Passive Typography Hover (Cyan Rim)
              </div>
              <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
                Move the cursor over this paragraph. The circular optical window glides smoothly with backdrop-filter blur, high readability, and a subtle cyan illuminated rim.
              </p>
            </div>

            <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-default)] space-y-4">
              <div className="text-xs font-mono uppercase text-[var(--color-accent)]">
                State 2: Interactive Target Hover (Gold Rim)
              </div>
              <div className="flex flex-wrap gap-3 items-center pt-2">
                <button className="px-4 py-2 rounded-full bg-[var(--color-accent)] text-black font-semibold text-xs font-mono uppercase cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors">
                  Interactive Button
                </button>
                <a
                  href="#cursor"
                  className="px-4 py-2 rounded-full border border-[var(--border-default)] text-xs font-mono uppercase text-white hover:border-[var(--color-accent)] transition-colors"
                >
                  Interactive Link ↗
                </a>
                <input
                  type="text"
                  placeholder="Interactive Input..."
                  className="px-3 py-1.5 rounded-[var(--radius-md)] bg-white/5 border border-[var(--border-default)] text-xs text-white"
                />
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-light pt-2">
                Hovering over interactive elements expands the lens by 1.15x and transitions the rim to architectural gold.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-32 pt-12 border-t border-[var(--border-subtle)] text-center text-2xs font-mono text-[var(--text-secondary)] uppercase">
        CORE LOOK PHASE COMPLETED • DESIGN SYSTEM SPECIFICATION V1.0 • {new Date().getFullYear()}
      </footer>

    </div>
  );
}
