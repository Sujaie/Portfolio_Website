import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const SECTIONS = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

/**
 * AtmosphericBackground (Palette V2: Ambient Technical Noir)
 * 
 * 6-Layer Compositor Environment:
 * Layer 1: Base Canvas (#050810 deep midnight foundation)
 * Layer 2 & 3: Contextual Ambient Radial Lighting with continuous scroll transitions
 * Layer 4: Vignette (cinematic edge falloff)
 * Layer 5: Fine Grain (subtle static SVG fractal noise)
 * Layer 6: Technical Grid (whisper-quiet 64px coordinate mesh)
 * 
 * Performance:
 * - 0% CPU consumption when idle
 * - Zero React re-renders while scrolling (direct DOM ref mutation)
 * - 100% GPU-accelerated opacity transforms
 * - Full prefers-reduced-motion support (static gradient profiles, no breathing)
 */
export default function AtmosphericBackground() {
  const prefersReduced = useReducedMotion();
  const layerRefs = useRef({});

  useEffect(() => {
    let rafId = null;
    let sectionCenters = [];

    const measureSections = () => {
      sectionCenters = SECTIONS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        return top + height / 2;
      });
    };

    const updateAtmosphere = () => {
      if (sectionCenters.length < SECTIONS.length || sectionCenters.some((c) => c === 0)) {
        measureSections();
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight || 800;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const focalY = scrollY + windowHeight * 0.45; // Optical focal plane slightly above viewport center

      const weights = {
        home: 0,
        about: 0,
        work: 0,
        skills: 0,
        experience: 0,
        contact: 0,
      };

      // Edge guard: Top of page is strictly home
      if (scrollY <= 80 || focalY <= sectionCenters[0]) {
        weights.home = 1;
      }
      // Edge guard: Bottom of page is strictly contact
      else if (scrollY + windowHeight >= scrollHeight - 80 || focalY >= sectionCenters[sectionCenters.length - 1]) {
        weights.contact = 1;
      } else {
        // Find adjacent section bracket
        for (let i = 0; i < sectionCenters.length - 1; i++) {
          const cCurrent = sectionCenters[i];
          const cNext = sectionCenters[i + 1];

          if (focalY >= cCurrent && focalY <= cNext) {
            const span = cNext - cCurrent;
            const progress = span > 0 ? (focalY - cCurrent) / span : 0;
            // Smoothstep hermite interpolation for organic, non-linear crossfading
            const smooth = progress * progress * (3 - 2 * progress);

            if (prefersReduced) {
              // Binary threshold for reduced motion (static section identity)
              const dominant = smooth >= 0.5 ? SECTIONS[i + 1] : SECTIONS[i];
              weights[dominant] = 1;
            } else {
              weights[SECTIONS[i]] = 1 - smooth;
              weights[SECTIONS[i + 1]] = smooth;
            }
            break;
          }
        }
      }

      // Direct DOM mutation — zero React re-renders for 60+ FPS compositor efficiency
      for (const id of SECTIONS) {
        const el = layerRefs.current[id];
        if (el) {
          el.style.opacity = (weights[id] || 0).toFixed(3);
        }
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateAtmosphere();
          rafId = null;
        });
      }
    };

    const onResize = () => {
      measureSections();
      updateAtmosphere();
    };

    // Initial measurement & application
    measureSections();
    updateAtmosphere();

    // Re-measure after initial renders settle
    const initialTimer = setTimeout(() => {
      measureSections();
      updateAtmosphere();
    }, 500);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [prefersReduced]);

  return (
    <div
      id="atmospheric-background"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      {/* LAYER 1: BASE CANVAS (#050810 Deep Midnight Foundation) */}
      <div
        id="atmosphere-canvas"
        className="absolute inset-0 bg-[var(--bg-base)]"
        style={{
          background: 'linear-gradient(180deg, var(--ink-canvas) 0%, var(--ink-deep-canvas) 100%)',
        }}
      />

      {/* =========================================================================
          LAYERS 2 & 3: CONTEXTUAL AMBIENT LIGHTING PROFILES (Cross-faded smoothly)
          ========================================================================= */}

      {/* SECTION 1: HERO (#home) — Visual Intensity B+
          Dominant electric teal lower-left, cyan/blue near typography, subtle soft indigo undertone */}
      <div
        id="atmosphere-home"
        data-atmosphere="home"
        ref={(el) => (layerRefs.current.home = el)}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none will-change-[opacity]"
        style={{ opacity: 1 }}
      >
        {/* Primary Electric Teal Field (Lower-Left / Lower-Center) */}
        <div
          className="absolute bottom-[2%] left-[-5%] sm:left-[5%] md:left-[12%] w-[550px] sm:w-[750px] md:w-[950px] h-[500px] sm:h-[650px] md:h-[850px] rounded-full blur-[140px] md:blur-[180px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(53, 214, 223, 0.22) 0%, rgba(31, 194, 201, 0.12) 45%, transparent 70%)',
          }}
        />

        {/* Secondary Cyan/Blue Field (Upper-Right near Typography) */}
        <div
          className={`absolute top-[10%] sm:top-[15%] right-[-10%] sm:right-[5%] md:right-[15%] w-[450px] sm:w-[600px] md:w-[750px] h-[450px] sm:h-[600px] md:h-[750px] rounded-full blur-[130px] md:blur-[160px] pointer-events-none ${
            prefersReduced ? '' : 'animate-pulse-subtle'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(31, 194, 201, 0.16) 0%, rgba(13, 30, 54, 0.25) 55%, transparent 70%)',
          }}
        />

        {/* Subtle Soft Indigo Undertone (Center-Bottom) */}
        <div
          className="absolute top-[45%] left-[30%] sm:left-[40%] w-[400px] sm:w-[550px] md:w-[700px] h-[400px] sm:h-[550px] md:h-[700px] rounded-full blur-[150px] md:blur-[190px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(117, 136, 255, 0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* SECTION 2: ABOUT (#about) — Visual Intensity B
          Champagne gold dominant ambient accent, residual teal, deep navy foundation */}
      <div
        id="atmosphere-about"
        data-atmosphere="about"
        ref={(el) => (layerRefs.current.about = el)}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        {/* Primary Champagne Gold Ambient Accent (Left Column Emphasis) */}
        <div
          className="absolute top-[25%] left-[-5%] sm:left-[10%] md:left-[18%] w-[500px] sm:w-[700px] md:w-[850px] h-[500px] sm:h-[700px] md:h-[850px] rounded-full blur-[140px] md:blur-[180px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(240, 189, 88, 0.18) 0%, rgba(194, 142, 33, 0.08) 45%, transparent 70%)',
          }}
        />

        {/* Secondary Residual Teal from Hero (Right Column Balance) */}
        <div
          className="absolute top-[45%] right-[-5%] sm:right-[10%] w-[450px] sm:w-[600px] md:w-[700px] h-[450px] sm:h-[600px] md:h-[700px] rounded-full blur-[130px] md:blur-[160px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(31, 194, 201, 0.10) 0%, transparent 65%)',
          }}
        />

        {/* Deep Navy Undertone */}
        <div
          className="absolute top-[35%] left-[35%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full blur-[160px] md:blur-[200px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(13, 30, 54, 0.22) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* SECTION 3: WORK (#work) — Visual Intensity B
          Cool technical teal/cyan positioned around project content, dark surfaces dominant */}
      <div
        id="atmosphere-work"
        data-atmosphere="work"
        ref={(el) => (layerRefs.current.work = el)}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        {/* Primary Cool Electric Teal Field (Project Showcase Focus) */}
        <div
          className="absolute top-[25%] right-[-5%] sm:right-[12%] md:right-[20%] w-[550px] sm:w-[750px] md:w-[900px] h-[550px] sm:h-[750px] md:h-[900px] rounded-full blur-[150px] md:blur-[190px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(53, 214, 223, 0.16) 0%, rgba(31, 194, 201, 0.08) 45%, transparent 70%)',
          }}
        />

        {/* Secondary Deep Cyan/Blue Technical Field (Left Side Balance) */}
        <div
          className="absolute top-[50%] left-[-5%] sm:left-[10%] w-[500px] sm:w-[650px] md:w-[800px] h-[500px] sm:h-[650px] md:h-[800px] rounded-full blur-[140px] md:blur-[170px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(8, 40, 48, 0.25) 0%, rgba(13, 30, 54, 0.18) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* SECTION 4: SKILLS (#skills) — Visual Intensity A/B (Calm & Structured)
          Deep navy foundation with extremely subtle soft indigo lighting */}
      <div
        id="atmosphere-skills"
        data-atmosphere="skills"
        ref={(el) => (layerRefs.current.skills = el)}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        {/* Primary Deep Navy Ambient Bed */}
        <div
          className="absolute top-[30%] left-[10%] sm:left-[25%] w-[600px] sm:w-[800px] md:w-[950px] h-[600px] sm:h-[800px] md:h-[950px] rounded-full blur-[160px] md:blur-[200px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(13, 30, 54, 0.26) 0%, rgba(11, 20, 32, 0.15) 55%, transparent 70%)',
          }}
        />

        {/* Secondary Soft Indigo Undertone (Extremely subtle, not purple) */}
        <div
          className="absolute top-[40%] left-[30%] sm:left-[45%] w-[450px] sm:w-[600px] md:w-[700px] h-[450px] sm:h-[600px] md:h-[700px] rounded-full blur-[150px] md:blur-[190px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(117, 136, 255, 0.07) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* SECTION 5: EXPERIENCE (#experience) — Visual Intensity B
          Champagne/amber warm directional lighting, deep navy, subtle residual teal */}
      <div
        id="atmosphere-experience"
        data-atmosphere="experience"
        ref={(el) => (layerRefs.current.experience = el)}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        {/* Primary Warm Champagne Lighting (Timeline Spine Illumination) */}
        <div
          className="absolute top-[28%] left-[-5%] sm:left-[15%] md:left-[25%] w-[500px] sm:w-[700px] md:w-[850px] h-[500px] sm:h-[700px] md:h-[850px] rounded-full blur-[140px] md:blur-[180px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(240, 189, 88, 0.16) 0%, rgba(194, 142, 33, 0.06) 45%, transparent 70%)',
          }}
        />

        {/* Secondary Subtle Residual Teal (Right Column Balance) */}
        <div
          className="absolute top-[55%] right-[-5%] sm:right-[15%] w-[450px] sm:w-[600px] md:w-[700px] h-[450px] sm:h-[600px] md:h-[700px] rounded-full blur-[130px] md:blur-[160px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(31, 194, 201, 0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* SECTION 6: CONTACT (#contact) — Visual Intensity B+
          Converging Teal and Champagne Gold spotlights, clear dark central reading corridor */}
      <div
        id="atmosphere-contact"
        data-atmosphere="contact"
        ref={(el) => (layerRefs.current.contact = el)}
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        {/* Field A: Converging Electric Teal (Lower-Left) */}
        <div
          className="absolute bottom-[5%] left-[-5%] sm:left-[10%] md:left-[18%] w-[550px] sm:w-[750px] md:w-[900px] h-[500px] sm:h-[680px] md:h-[800px] rounded-full blur-[140px] md:blur-[180px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(53, 214, 223, 0.22) 0%, rgba(31, 194, 201, 0.10) 45%, transparent 70%)',
          }}
        />

        {/* Field B: Converging Champagne Gold (Lower-Right) */}
        <div
          className="absolute bottom-[3%] right-[-5%] sm:right-[10%] md:right-[18%] w-[550px] sm:w-[750px] md:w-[900px] h-[500px] sm:h-[700px] md:h-[820px] rounded-full blur-[140px] md:blur-[180px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(240, 189, 88, 0.18) 0%, rgba(194, 142, 33, 0.07) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* LAYER 4: VIGNETTE (Viewport Edge Falloff preserving focal depth) */}
      <div
        id="atmosphere-vignette"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(3, 5, 9, 0.58) 100%)',
        }}
      />

      {/* LAYER 5: FINE GRAIN (Subtle Static SVG Fractal Noise) */}
      <div
        id="atmosphere-grain"
        className="absolute inset-0 bg-noise opacity-[0.032] pointer-events-none"
      />

      {/* LAYER 6: TECHNICAL GRID (Whisper-Quiet Coordinate Mesh) */}
      <div
        id="atmosphere-grid"
        className="absolute inset-0 bg-grid-tech opacity-[0.035] pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, rgba(0, 0, 0, 0.35) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, rgba(0, 0, 0, 0.35) 100%)',
        }}
      />
    </div>
  );
}
