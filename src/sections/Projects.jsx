import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { sound } from '../utils/sound.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

// =========================================================================
// 1. DATA-DRIVEN STRUCTURE: THE THREE FEATURED PROJECTS
// =========================================================================
export const FEATURED_PROJECTS = [
  {
    id: 'artinova',
    number: '01',
    badge: 'TEAM LEAD & AI DEVELOPER',
    title: 'ArtiNova',
    filename: 'artinova.app',
    status: '[SIH 2026 · INTERNAL FINALIST]',
    description: "An AI commerce platform that turns a product photo and a few spoken words into a polished, priced online listing, in the artisan's own language.",
    snapshotBanner: 'Built for Smart India Hackathon 2026. A working app that reached the internal finals.',
    tiles: [
      { label: 'ROLE', value: 'Team Lead' },
      { label: 'AI FEATURES', value: '5' },
      { label: 'RESULT', value: 'Internal Finalist' },
    ],
    visualType: 'artinova',
    featureBars: [
      'Image Enhancement',
      'Multilingual Voice Cataloguing',
      'Smart Cataloguing',
      'Price Recommendations',
      'Market Recommendations',
    ],
    arch: {
      heading: 'ARCHITECTURE',
      nodes: ['Flutter App', 'FastAPI Backend', 'AI Services', 'PostgreSQL'],
      caption: 'Photo and voice go in; a translated, priced listing comes out.',
    },
    terminal: {
      commands: [
        {
          name: 'role',
          output: 'Team lead. Led ideation, problem analysis, feature planning and coordination, and contributed to the AI features.',
        },
        {
          name: 'stack',
          output: 'Flutter · FastAPI · PostgreSQL · Ollama',
        },
        {
          name: 'features',
          output: 'Image enhancement · Multilingual voice cataloguing · Smart cataloguing · Price recommendations · Market recommendations',
        },
        {
          name: 'status',
          output: 'Working app. SIH 2026 internal finalist.',
        },
      ],
    },
    impactTitle: 'WHAT I DID',
    impactText: 'Led the team from problem statement to a working app, and contributed to the image enhancement, voice cataloguing and pricing features.',
    tags: ['Flutter', 'FastAPI', 'PostgreSQL', 'Ollama'],
    // TODO: add screenshots to media[]
    media: [],
    // TODO: add repo URL
    repoUrl: '',
    // TODO: add demo URL
    demoUrl: '',
    nextLabel: 'NEXT: 02 FASHION SIZING API ↓',
  },
  {
    id: 'fashion-sizing-api',
    number: '02',
    // TODO: confirm my exact role
    badge: 'TEAM PROJECT · MAKEATHON 2026',
    title: 'Fashion Sizing API',
    filename: 'fashion-sizing.api',
    status: '[MAKEATHON · SVCE 2026]',
    description: 'A two-model API that extracts body measurements from photos, maps them to brand-specific size charts, and uses a review classifier to improve fit recommendations.',
    snapshotBanner: 'Built as a team at MakeAthon, SVCE 2026.',
    tiles: [
      { label: 'MODELS', value: '2' },
      { label: 'DATASET', value: 'AWS BodyM' },
      { label: 'EVENT', value: 'MakeAthon 2026' },
    ],
    visualType: 'fashion-sizing',
    arch: {
      heading: 'ARCHITECTURE',
      lanes: [
        {
          label: 'MEASURE',
          nodes: ['Photo', 'Body Measurements', 'Brand Size Chart', 'Recommended Size'],
        },
        {
          label: 'REVIEWS',
          nodes: ['Fashion Reviews', 'DistilBERT Classifier', 'Fit Signal'],
        },
      ],
      caption: 'Two models, one recommendation.',
    },
    terminal: {
      commands: [
        {
          name: 'models',
          output: '1) Body measurement extraction from photos. 2) DistilBERT-based classifier for fit-related reviews.',
        },
        {
          name: 'data',
          output: 'AWS BodyM dataset for measurements. Combined fashion review datasets for the classifier.',
        },
        {
          name: 'stack',
          // TODO: confirm stack
          output: 'Python · PyTorch · HuggingFace · API',
        },
        {
          name: 'status',
          output: 'Built as a team at MakeAthon, SVCE 2026.',
        },
      ],
    },
    impactTitle: 'WHAT WE BUILT',
    impactText: 'An API that combines body measurement extraction with brand size-chart mapping and a review-based fit classifier to recommend a size.',
    tags: ['Python', 'PyTorch', 'HuggingFace', 'API'],
    // TODO: add screenshots to media[]
    media: [],
    // TODO: add repo URL
    repoUrl: '',
    // TODO: add demo URL
    demoUrl: '',
    nextLabel: 'NEXT: 03 DEVATLAS ↓',
  },
  {
    id: 'devatlas',
    number: '03',
    badge: 'SOLO BUILDER · IN PROGRESS',
    title: 'DevAtlas',
    filename: 'devatlas.tool',
    status: '[IN PROGRESS]',
    description: 'A React-based tool that helps developers find their way around unfamiliar code repositories faster.',
    snapshotBanner: 'Early stage. Demo and screenshots coming soon.',
    tiles: [
      { label: 'STATUS', value: 'In Progress' },
      { label: 'BUILT WITH', value: 'React' },
      { label: 'TYPE', value: 'Developer Tool' },
    ],
    visualType: 'devatlas',
    arch: {
      // TODO: update to match the real design
      heading: 'PLANNED ARCHITECTURE',
      nodes: ['Repository', 'Structure Map', 'Search & Navigate', 'React Interface'],
      caption: 'Planned flow. Details will be updated as the project grows.',
    },
    terminal: {
      commands: [
        {
          name: 'why',
          output: 'Opening an unfamiliar codebase is slow. DevAtlas aims to make a repository easier to explore and understand.',
        },
        {
          name: 'stack',
          output: 'React · JavaScript',
        },
        {
          name: 'status',
          output: 'In progress. Demo and screenshots coming soon.',
        },
      ],
    },
    impactTitle: "WHAT I'M BUILDING",
    impactText: 'Designing and building the project on my own, from the interface to the navigation logic.',
    tags: ['React', 'JavaScript'],
    // TODO: add screenshots to media[]
    media: [],
    // TODO: add repo URL
    repoUrl: '',
    // TODO: add demo URL
    demoUrl: '',
    nextLabel: 'NEXT: ALSO BUILT ↓',
  },
];

// =========================================================================
// 2. ALSO BUILT PROJECTS DATA
// =========================================================================
export const ALSO_BUILT_PROJECTS = [
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'My portfolio, built from scratch with custom animation and a terminal-inspired design.',
    tags: ['React 19', 'Vite', 'Tailwind CSS', 'GSAP'],
    // TODO: add repo URL
    repoUrl: '',
    // TODO: add demo URL
    demoUrl: '',
  },
  {
    id: 'chess-game',
    title: 'Chess Game (2024)',
    description: "A chess game built in Python's Turtle library during school, with an interactive board, piece movement and basic game logic using object-oriented programming.",
    tags: ['Python', 'Turtle', 'OOP'],
    // TODO: add repo URL
    repoUrl: '',
    // TODO: add demo URL
    demoUrl: '',
  },
];

// =========================================================================
// MINI VISUAL 1: ArtiNova 5 Feature Bars Filling in One After Another
// =========================================================================
function ArtiNovaVisual({ prefersReduced }) {
  const [activeStep, setActiveStep] = useState(0);
  const bars = [
    'Image Enhancement',
    'Multilingual Voice Cataloguing',
    'Smart Cataloguing',
    'Price Recommendations',
    'Market Recommendations',
  ];

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % bars.length);
    }, 850);
    return () => clearInterval(interval);
  }, [prefersReduced, bars.length]);

  return (
    <div className="space-y-2 py-2">
      {bars.map((bar, i) => {
        const isCurrent = prefersReduced || i === activeStep;
        return (
          <div
            key={bar}
            className={`p-2.5 rounded-[var(--radius-md)] border text-xs font-mono transition-all duration-300 flex items-center justify-between gap-3 ${
              isCurrent
                ? 'border-[var(--color-data)] bg-[var(--color-data)]/10 text-white shadow-[var(--glow-cyan-sm)]'
                : 'border-[var(--border-subtle)] bg-white/[0.02] text-[var(--text-secondary)] opacity-70'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isCurrent ? 'bg-[var(--color-data)] shadow-[0_0_6px_var(--color-data)]' : 'bg-white/20'
                }`}
              />
              <span className="truncate">{bar}</span>
            </div>
            <span className="text-3xs text-[var(--color-accent)] font-mono shrink-0">
              FEATURE {i + 1}/5
            </span>
          </div>
        );
      })}
    </div>
  );
}

// =========================================================================
// MINI VISUAL 2: Fashion Sizing API Two Travelling Lanes
// =========================================================================
function FashionSizingVisual({ prefersReduced }) {
  const [step1, setStep1] = useState(0);
  const [step2, setStep2] = useState(0);

  const lane1 = ['Photo', 'Measurements', 'Size Chart'];
  const lane2 = ['Reviews', 'Classifier', 'Fit Signal'];

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setStep1((prev) => (prev + 1) % lane1.length);
      setStep2((prev) => (prev + 1) % lane2.length);
    }, 900);
    return () => clearInterval(interval);
  }, [prefersReduced, lane1.length, lane2.length]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 font-mono text-xs">
      {/* Lane 1: MEASURE */}
      <div className="p-3.5 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-2xs uppercase">
          <span className="text-[var(--color-data)] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] animate-pulse" />
            MEASURE
          </span>
          <span className="text-3xs text-[var(--text-muted)]">AWS BodyM</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {lane1.map((node, i) => (
            <React.Fragment key={node}>
              <div
                className={`px-2 py-1 rounded text-2xs truncate text-center flex-1 border transition-all ${
                  prefersReduced || i === step1
                    ? 'border-[var(--color-data)] bg-[var(--color-data)]/15 text-white shadow-[var(--glow-cyan-sm)]'
                    : 'border-white/10 bg-white/5 text-[var(--text-muted)]'
                }`}
              >
                {node}
              </div>
              {i < lane1.length - 1 && (
                <span className="text-[var(--color-accent)]/60 text-2xs shrink-0">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Lane 2: REVIEWS */}
      <div className="p-3.5 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-2xs uppercase">
          <span className="text-[var(--color-accent)] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            REVIEWS
          </span>
          <span className="text-3xs text-[var(--text-muted)]">DistilBERT</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {lane2.map((node, i) => (
            <React.Fragment key={node}>
              <div
                className={`px-2 py-1 rounded text-2xs truncate text-center flex-1 border transition-all ${
                  prefersReduced || i === step2
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white shadow-[var(--glow-gold-sm)]'
                    : 'border-white/10 bg-white/5 text-[var(--text-muted)]'
                }`}
              >
                {node}
              </div>
              {i < lane2.length - 1 && (
                <span className="text-[var(--color-accent)]/60 text-2xs shrink-0">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MINI VISUAL 3: DevAtlas Abstract Repo File-Tree with Illustration Label
// =========================================================================
function DevAtlasVisual({ prefersReduced }) {
  const [highlightIdx, setHighlightIdx] = useState(0);
  const treeNodes = [
    { name: 'src/', depth: 0 },
    { name: 'components/', depth: 1 },
    { name: 'navigation/', depth: 2 },
    { name: 'RepoMap.jsx', depth: 3, isFile: true },
  ];

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setHighlightIdx((prev) => (prev + 1) % treeNodes.length);
    }, 900);
    return () => clearInterval(interval);
  }, [prefersReduced, treeNodes.length]);

  return (
    <div className="relative p-4 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)] font-mono text-xs">
      <span className="absolute top-2.5 right-3 text-3xs font-mono uppercase tracking-mono-sm text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-1.5 py-0.5 rounded border border-[var(--color-accent)]/20">
        ILLUSTRATION
      </span>

      <div className="space-y-2 py-1">
        {treeNodes.map((node, i) => {
          const isLit = prefersReduced ? true : i <= highlightIdx;
          return (
            <div
              key={node.name}
              style={{ paddingLeft: `${node.depth * 18}px` }}
              className={`flex items-center gap-2 transition-all duration-300 ${
                isLit
                  ? 'text-[var(--color-data)] font-medium'
                  : 'text-[var(--text-muted)] opacity-40'
              }`}
            >
              <span className="text-2xs text-[var(--color-accent)]/70">
                {node.isFile ? '📄' : '📁'}
              </span>
              <span className={`text-xs ${isLit ? 'underline decoration-[var(--color-data)]/50' : ''}`}>
                {node.name}
              </span>
              {i === highlightIdx && !prefersReduced && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)] animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// PROJECT CARD WITH 3-TAB TERMINAL (SNAPSHOT · ARCH · TERMINAL)
// =========================================================================
function ProjectCard({ proj, isEven, nextProj }) {
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const rectRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('snapshot'); // 'snapshot' | 'arch' | 'terminal'

  // Interactive fake terminal state with typewriter effect
  const [activeCommand, setActiveCommand] = useState(null);
  const [typedOutput, setTypedOutput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (prefersReduced) return;
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    if (sheenRef.current) {
      sheenRef.current.style.background = `radial-gradient(circle 350px at ${shineX.toFixed(1)}% ${shineY.toFixed(1)}%, rgba(53, 214, 223, 0.14), transparent 70%)`;
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

  // Keyboard navigation for tabs
  const handleTabKeyDown = (e) => {
    const tabs = ['snapshot', 'arch', 'terminal'];
    const currentIdx = tabs.indexOf(activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = tabs[(currentIdx + 1) % tabs.length];
      setActiveTab(nextTab);
      sound.playClick();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = tabs[(currentIdx - 1 + tabs.length) % tabs.length];
      setActiveTab(prevTab);
      sound.playClick();
    }
  };

  // Command run typewriter
  const handleRunCommand = (cmdObj) => {
    sound.playClick();
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    // If currently typing this same command, skip to completion immediately
    if (activeCommand === cmdObj.name && isTyping) {
      setTypedOutput(cmdObj.output);
      setIsTyping(false);
      return;
    }

    setActiveCommand(cmdObj.name);

    if (prefersReduced) {
      setTypedOutput(cmdObj.output);
      setIsTyping(false);
      return;
    }

    setTypedOutput('');
    setIsTyping(true);
    let charIdx = 0;
    const fullText = cmdObj.output;

    typingTimerRef.current = setInterval(() => {
      charIdx++;
      setTypedOutput(fullText.slice(0, charIdx));
      if (charIdx >= fullText.length) {
        clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 20);
  };

  const handleClearTerminal = () => {
    sound.playClick();
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setActiveCommand(null);
    setTypedOutput('');
    setIsTyping(false);
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
        isEven ? '' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Visual Interactive Preview with Terminal Window */}
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
          className="relative rounded-[var(--radius-xl)] bg-gradient-to-b from-[var(--surface-card-start)] to-[var(--surface-card-end)] border border-[var(--border-default)] p-[var(--card-padding)] overflow-hidden hover:border-[var(--color-data)]/50 hover:shadow-[var(--glow-cyan-sm)] transition-[transform,border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-standard)] group will-change-transform shadow-[var(--shadow-card)]"
        >
          {/* Dynamic Cursor Light Sheen (Behind Content: pointer-events-none, z-0) */}
          <div
            ref={sheenRef}
            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--dur-slow)]"
            style={{
              background: 'radial-gradient(circle 350px at 50% 50%, rgba(53, 214, 223, 0.12), transparent 70%)',
            }}
          />

          {/* Window Title Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)] mb-5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[var(--glow-cyan-sm)]" />
              <span className="text-2xs tracking-wider text-[var(--text-secondary)] font-mono ml-2 font-medium">
                {proj.filename}
              </span>
              <span className="text-2xs font-mono text-[var(--color-data)] ml-3 hidden sm:inline">
                {proj.status}
              </span>
            </div>

            {/* Interactive View Modes: SNAPSHOT · ARCH · TERMINAL */}
            <div
              role="tablist"
              aria-label={`${proj.title} display modes`}
              onKeyDown={handleTabKeyDown}
              className="flex items-center gap-1 bg-black/40 p-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
            >
              {[
                { id: 'snapshot', label: 'SNAPSHOT' },
                { id: 'arch', label: 'ARCH' },
                { id: 'terminal', label: 'TERMINAL' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`proj-panel-${proj.number}-${tab.id}`}
                  id={`proj-tab-${proj.number}-${tab.id}`}
                  aria-label={`Switch to ${tab.label} mode`}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`text-2xs font-mono tracking-mono-sm uppercase px-2.5 py-1 rounded cursor-pointer transition-colors duration-[var(--dur-base)] ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-accent)] text-black font-semibold shadow-[var(--glow-gold-sm)]'
                      : 'text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: SNAPSHOT */}
          {activeTab === 'snapshot' && (
            <div
              id={`proj-panel-${proj.number}-snapshot`}
              role="tabpanel"
              aria-labelledby={`proj-tab-${proj.number}-snapshot`}
              className="relative z-10 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/95 border border-[var(--border-subtle)] p-5 space-y-4 transition-opacity duration-300"
            >
              {/* One-Line Summary Banner */}
              <div className="flex items-center gap-3 p-3.5 rounded-[var(--radius-md)] bg-white/[0.03] border border-[var(--border-subtle)] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[var(--color-data)] animate-pulse shadow-[var(--glow-cyan-sm)] shrink-0" />
                <span className="text-[var(--text-secondary)] leading-relaxed">
                  {proj.snapshotBanner}
                </span>
              </div>

              {/* 3 Stat Tiles */}
              <div className="grid grid-cols-3 gap-3">
                {proj.tiles.map((tile) => (
                  <div
                    key={tile.label}
                    className="p-3 rounded-[var(--radius-md)] bg-white/[0.02] border border-[var(--border-subtle)]"
                  >
                    <div className="text-3xs font-mono text-[var(--text-muted)] uppercase tracking-mono-sm">
                      {tile.label}
                    </div>
                    <div className="text-sm font-semibold mt-1 font-mono text-[var(--color-accent)] truncate">
                      {tile.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Media gallery or mini visual */}
              {proj.media && proj.media.length > 0 ? (
                // Screenshot carousel when media provided
                <div className="p-4 rounded-[var(--radius-md)] bg-black/40 border border-[var(--border-subtle)]">
                  {/* Gallery items */}
                </div>
              ) : (
                <>
                  {proj.visualType === 'artinova' && <ArtiNovaVisual prefersReduced={prefersReduced} />}
                  {proj.visualType === 'fashion-sizing' && <FashionSizingVisual prefersReduced={prefersReduced} />}
                  {proj.visualType === 'devatlas' && <DevAtlasVisual prefersReduced={prefersReduced} />}
                </>
              )}
            </div>
          )}

          {/* TAB 2: ARCH */}
          {activeTab === 'arch' && (
            <div
              id={`proj-panel-${proj.number}-arch`}
              role="tabpanel"
              aria-labelledby={`proj-tab-${proj.number}-arch`}
              className="relative z-10 rounded-[var(--radius-lg)] bg-[var(--surface-2)]/95 border border-[var(--border-subtle)] p-5 space-y-4 font-mono text-xs transition-opacity duration-300"
            >
              <div className="text-[var(--color-data)] text-2xs uppercase tracking-wider font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-data)]" />
                <span>{proj.arch.heading}</span>
              </div>

              {/* Boxes & Arrows flow */}
              {proj.arch.lanes ? (
                <div className="space-y-2.5 p-3.5 bg-black/40 rounded-[var(--radius-md)] border border-[var(--border-subtle)] text-xs">
                  {proj.arch.lanes.map((lane) => (
                    <div key={lane.label} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-3xs font-mono text-[var(--color-accent)] w-16 uppercase font-semibold shrink-0">
                        {lane.label}:
                      </span>
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 flex-1">
                        {lane.nodes.map((node, i) => (
                          <React.Fragment key={node}>
                            <div className="px-2 py-1 bg-[var(--color-data)]/15 border border-[var(--color-data)]/30 rounded text-2xs text-[var(--text-primary)] flex-1 text-center min-w-[70px]">
                              {node}
                            </div>
                            {i < lane.nodes.length - 1 && (
                              <span className="text-[var(--color-accent)] text-2xs shrink-0">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 p-3.5 bg-black/40 rounded-[var(--radius-md)] border border-[var(--border-subtle)] text-center text-xs">
                  {proj.arch.nodes.map((node, i) => (
                    <React.Fragment key={node}>
                      <div className="px-3 py-1.5 bg-[var(--color-data)]/15 border border-[var(--color-data)]/30 rounded-[var(--radius-md)] text-[var(--text-primary)] flex-1 min-w-[90px] truncate text-2xs">
                        {node}
                      </div>
                      {i < proj.arch.nodes.length - 1 && (
                        <span className="text-[var(--color-accent)] font-bold text-sm shrink-0">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                {proj.arch.caption}
              </p>
            </div>
          )}

          {/* TAB 3: TERMINAL */}
          {activeTab === 'terminal' && (
            <div
              id={`proj-panel-${proj.number}-terminal`}
              role="tabpanel"
              aria-labelledby={`proj-tab-${proj.number}-terminal`}
              className="relative z-10 rounded-[var(--radius-lg)] bg-black/90 border border-[var(--border-default)] p-4 font-mono text-xs space-y-3 transition-opacity duration-300"
            >
              {/* Output log */}
              <div className="min-h-24 max-h-36 overflow-y-auto space-y-1.5 text-xs">
                {activeCommand ? (
                  <>
                    <div className="text-[var(--color-accent)] flex items-center gap-2">
                      <span className="text-[var(--color-data)] font-semibold">$</span>
                      <span>{activeCommand}</span>
                    </div>
                    <div className="text-[var(--text-secondary)] pl-3.5 leading-relaxed break-words font-sans text-xs">
                      <span>{typedOutput}</span>
                      {isTyping && (
                        <span className="inline-block w-1.5 h-3.5 bg-[var(--color-data)] ml-1 animate-pulse" />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-[var(--text-muted)] italic select-none">
                    &gt; type a command below
                  </div>
                )}
              </div>

              {/* RUN command row */}
              <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[var(--border-default)]">
                <span className="text-2xs text-[var(--color-accent)] font-semibold uppercase">RUN:</span>
                {proj.terminal.commands.map((cmd) => (
                  <button
                    key={cmd.name}
                    onClick={() => handleRunCommand(cmd)}
                    onMouseEnter={() => sound.playHover()}
                    aria-label={`Run ${cmd.name} command`}
                    className={`text-2xs px-2.5 py-1 rounded-[var(--radius-sm)] border font-mono uppercase transition-colors cursor-pointer ${
                      activeCommand === cmd.name
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-black font-semibold shadow-[var(--glow-gold-sm)]'
                        : 'border-white/10 bg-white/5 hover:border-[var(--color-accent)]/50 text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    {cmd.name}
                  </button>
                ))}
                <button
                  onClick={handleClearTerminal}
                  onMouseEnter={() => sound.playHover()}
                  aria-label="Clear terminal"
                  className="text-2xs px-2.5 py-1 rounded-[var(--radius-sm)] border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-mono uppercase transition-colors cursor-pointer ml-auto"
                >
                  clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Details Column */}
      <div className={`lg:col-span-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'} flex flex-col justify-center`}>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-num-display font-mono font-light text-[var(--color-accent)]/80">
            {proj.number}
          </span>
          <span className="text-2xs tracking-mono-md uppercase font-mono font-semibold text-[var(--color-data)] px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-data)]/10 border border-[var(--color-data)]/20">
            {proj.badge}
          </span>
        </div>

        <h3 className="text-3xl font-light text-[var(--text-primary)] mb-4">
          {proj.title}
        </h3>

        <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed mb-6">
          {proj.description}
        </p>

        {/* Impact Box */}
        <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-white/[0.03] border border-[var(--border-subtle)]">
          <div className="text-2xs font-mono tracking-mono-sm uppercase text-[var(--color-accent)] font-semibold mb-1">
            {proj.impactTitle}
          </div>
          <div className="text-sm text-[var(--text-primary)] font-light leading-normal">
            {proj.impactText}
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {proj.tags.map((item) => (
            <span
              key={item}
              className="text-2xs tracking-mono-sm font-mono px-3 py-1 rounded-full bg-white/5 border border-[var(--border-default)] text-[var(--text-primary)]"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Links & Next Project Cue */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-4 text-xs tracking-mono-md font-mono uppercase font-semibold">
            {/* SOURCE CODE */}
            {proj.repoUrl ? (
              // TODO: add repo URL
              <a
                href={proj.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code for ${proj.title} on GitHub (opens in new tab)`}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
              >
                <span>SOURCE CODE</span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              // TODO: add repo URL
              <span
                aria-disabled="true"
                className="text-[var(--text-muted)] opacity-60 cursor-not-allowed select-none text-2xs"
              >
                SOURCE CODE · COMING SOON
              </span>
            )}

            {/* LIVE DEMO */}
            {proj.demoUrl ? (
              // TODO: add demo URL
              <a
                href={proj.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live demo for ${proj.title} (opens in new tab)`}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="text-[var(--color-data)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
              >
                <span>LIVE DEMO</span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              // TODO: add demo URL
              <span
                aria-disabled="true"
                className="text-[var(--text-muted)] opacity-60 cursor-not-allowed select-none text-2xs"
              >
                LIVE DEMO · COMING SOON
              </span>
            )}
          </div>

          {nextProj && (
            <a
              href={`#proj-${nextProj.number}`}
              onClick={(e) => {
                e.preventDefault();
                const nextEl = document.getElementById(`proj-${nextProj.number}`);
                if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-2xs font-mono text-[var(--text-secondary)] hover:text-[var(--color-data)] transition-colors uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>{proj.nextLabel}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN WORK / PROJECTS SECTION
// =========================================================================
export default function Projects() {
  const sectionRef = useRef(null);
  const isRevealedRef = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      gsap.set('.proj-card-item, .also-built-section, .closing-card', {
        opacity: 1,
        y: 0,
        clearProps: 'all',
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRevealedRef.current && sectionRef.current) {
            isRevealedRef.current = true;

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            tl.fromTo(
              '.proj-card-item',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }
            );

            tl.fromTo(
              '.also-built-section, .closing-card',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
              '-=0.2'
            );

            observer.disconnect();
          }
        });
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] bg-transparent border-t border-[var(--border-subtle)]"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto">
        
        {/* Section Header */}
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

        {/* The 3 Featured Project Cards */}
        <div className="space-y-24 md:space-y-36">
          {FEATURED_PROJECTS.map((proj, idx) => (
            <div key={proj.number} id={`proj-${proj.number}`} className="proj-card-item">
              <ProjectCard
                proj={proj}
                isEven={idx % 2 === 0}
                nextProj={FEATURED_PROJECTS[(idx + 1) % FEATURED_PROJECTS.length]}
              />
            </div>
          ))}
        </div>

        {/* =========================================================================
            ALSO BUILT ROW
            ========================================================================= */}
        <div className="also-built-section mt-24 pt-16 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-accent)] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
            <span>ALSO BUILT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ALSO_BUILT_PROJECTS.map((item) => (
              <div
                key={item.id}
                className="p-6 md:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-2)]/90 border border-[var(--border-subtle)] hover:border-[var(--color-data)]/50 hover:shadow-[var(--glow-cyan-sm)] transition-all duration-[var(--dur-base)] shadow-[var(--shadow-card)] flex flex-col justify-between gap-5 group"
              >
                <div>
                  <h3 className="text-xl font-light text-[var(--text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-2xs font-mono tracking-mono-sm px-2.5 py-0.5 rounded-full bg-white/5 border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="pt-3 border-t border-white/[0.04] flex items-center gap-4 text-2xs font-mono uppercase">
                    {item.repoUrl ? (
                      // TODO: add repo URL
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
                      >
                        <span>SOURCE CODE</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      // TODO: add repo URL
                      <span className="text-[var(--text-muted)] opacity-60 cursor-not-allowed">
                        SOURCE CODE · COMING SOON
                      </span>
                    )}

                    {item.demoUrl ? (
                      // TODO: add demo URL
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-data)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
                      >
                        <span>LIVE DEMO</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      // TODO: add demo URL
                      <span className="text-[var(--text-muted)] opacity-60 cursor-not-allowed">
                        LIVE DEMO · COMING SOON
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CLOSING CARD
            ========================================================================= */}
        <div className="closing-card mt-12 p-8 md:p-10 rounded-[var(--radius-xl)] bg-[var(--surface-2)]/90 border border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]/60 transition-all duration-[var(--dur-base)] shadow-[var(--shadow-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-light text-[var(--text-primary)] mb-2 font-sans">
              Next build in progress.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-light">
              Got a problem worth solving? Let's talk.
            </p>
          </div>
          <a
            href="#contact"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-accent)] text-black font-mono text-xs tracking-mono-sm uppercase font-semibold hover:bg-[var(--color-accent-hover)] transition-all shadow-[var(--glow-gold-sm)] shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>GET IN TOUCH</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
