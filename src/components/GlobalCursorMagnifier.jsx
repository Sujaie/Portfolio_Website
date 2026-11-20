import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * GlobalCursorMagnifier — Optical Precision Instrument Glass Orb
 * 
 * Sure-Fire Architecture (Look Bible Spec Alignment):
 * - Permanently eliminates DOM-cloning, text ghosting, misalignment, and text slicing.
 * - Single circular optical aperture (110px base diameter / r=55px).
 * - Optical-grade backdrop filter: enhances contrast, crispness, and saturation of underlying typography and UI.
 * - Precision instrument reticle: hairline tick marks at 12, 3, 6, and 9 o'clock fitting the "instrument-panel" aesthetic.
 * - Luminous dual-state rim:
 *   - Idle / Canvas: Electric Teal (#35D6DF) with subtle atmospheric glow.
 *   - Interactive Hover: Champagne Gold (#F0BD58) with expanded scale (1.28x) and focal glow.
 * - Tactile click impulse: momentary compression on pointerdown (scale 0.92x).
 * - 60+ FPS zero-React-rerender transform loop with strict 0% CPU dormancy when idle.
 * - Disabled on touch/mobile devices ((hover: none) and (pointer: coarse)).
 * - Strict prefers-reduced-motion compliance.
 */
export default function GlobalCursorMagnifier() {
  const lensRef = useRef(null);
  const rimRef = useRef(null);
  const reticleRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const prefersReduced = useReducedMotion();
  const [ready, setReady] = useState(() => prefersReduced);

  const LENS_RADIUS = 55; // 110px circular optical aperture

  // Hero Ignition synchronization: wakes after hero settles (~1.2s)
  useEffect(() => {
    if (prefersReduced) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => {
      setReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  useEffect(() => {
    if (!ready) return;

    // Detect touch-only mobile devices (no fine cursor)
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (touchQuery.matches) {
      setIsTouch(true);
      return;
    }

    const handleTouchChange = (e) => setIsTouch(e.matches);
    touchQuery.addEventListener?.('change', handleTouchChange);

    // Coordinate & state tracking (Zero React state updates during motion)
    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isRunning = false;
    let isInside = false;
    let isHovered = false;
    let isPressed = false;
    let idleCounter = 0;
    let rafId = null;

    const wakeLoop = () => {
      idleCounter = 0;
      if (!isRunning && !document.hidden && isInside) {
        isRunning = true;
        rafId = requestAnimationFrame(render);
      }
    };

    function render() {
      const ease = prefersReduced ? 1 : 0.32;
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0.05) {
        currentX += dx * ease;
        currentY += dy * ease;
        idleCounter = 0;
      } else {
        currentX = mouseX;
        currentY = mouseY;
        idleCounter++;
      }

      if (lensRef.current) {
        let scale = 1;
        if (isPressed) {
          scale = 0.92;
        } else if (isHovered) {
          scale = 1.28;
        }
        lensRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      // Enter 0% CPU dormancy after ~1s of cursor being stationary
      if (idleCounter > 60 && distSq <= 0.05) {
        isRunning = false;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(render);
      }
    }

    const setVisibility = (visible) => {
      if (lensRef.current) {
        lensRef.current.style.opacity = visible ? '1' : '0';
      }
    };

    const updateHoverState = (hovered) => {
      if (hovered === isHovered) return;
      isHovered = hovered;
      if (!rimRef.current) return;

      if (isHovered) {
        // Champagne Gold focal state
        rimRef.current.style.borderColor = 'rgba(240, 189, 88, 0.90)';
        rimRef.current.style.boxShadow =
          '0 0 24px rgba(240, 189, 88, 0.40), inset 0 0 12px rgba(255, 255, 255, 0.16)';
        if (reticleRef.current) {
          reticleRef.current.style.borderColor = 'rgba(240, 189, 88, 0.65)';
        }
      } else {
        // Electric Teal baseline state
        rimRef.current.style.borderColor = 'rgba(53, 214, 223, 0.65)';
        rimRef.current.style.boxShadow =
          '0 0 16px rgba(53, 214, 223, 0.28), inset 0 0 10px rgba(255, 255, 255, 0.12)';
        if (reticleRef.current) {
          reticleRef.current.style.borderColor = 'rgba(53, 214, 223, 0.35)';
        }
      }
      wakeLoop();
    };

    const handlePointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInside) {
        isInside = true;
        currentX = mouseX;
        currentY = mouseY;
        setVisibility(true);
      }

      // Check for interactive targets
      const target = e.target;
      if (
        target &&
        target.closest('a, button, [role="button"], [role="tab"], input, textarea, select, summary, .interactive-hover')
      ) {
        updateHoverState(true);
      } else {
        updateHoverState(false);
      }

      wakeLoop();
    };

    const handlePointerDown = () => {
      isPressed = true;
      wakeLoop();
    };

    const handlePointerUp = () => {
      isPressed = false;
      wakeLoop();
    };

    const handlePointerLeave = () => {
      isInside = false;
      setVisibility(false);
      updateHoverState(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        isRunning = false;
      } else if (isInside) {
        wakeLoop();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    setVisibility(false);

    return () => {
      touchQuery.removeEventListener?.('change', handleTouchChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ready, prefersReduced]);

  if (isTouch) {
    return null;
  }

  return (
    <div
      id="cursor-lens-shell"
      ref={lensRef}
      aria-hidden="true"
      inert="true"
      className="fixed top-0 left-0 pointer-events-none select-none z-[9999] opacity-0 will-change-transform transition-[opacity,transform] duration-[var(--dur-fast)] ease-[var(--ease-standard)]"
      style={{
        width: `${LENS_RADIUS * 2}px`,
        height: `${LENS_RADIUS * 2}px`,
        transform: 'translate3d(-1000px, -1000px, 0) translate(-50%, -50%)',
      }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {/* Optical Glass Lens (High-clarity contrast enhancement & specular refraction) */}
        <div
          id="cursor-optical-filter"
          className="absolute inset-0 rounded-full"
          style={{
            backdropFilter: 'contrast(1.22) brightness(1.12) saturate(1.20)',
            WebkitBackdropFilter: 'contrast(1.22) brightness(1.12) saturate(1.20)',
            background:
              'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.09) 0%, rgba(53, 214, 223, 0.03) 45%, transparent 70%)',
          }}
        />

        {/* Delicate Instrument Crosshair Reticle (North, South, East, West tick marks) */}
        <div
          ref={reticleRef}
          className="absolute inset-[3px] rounded-full pointer-events-none border border-dashed border-[rgba(53,214,223,0.30)] transition-colors duration-150"
        >
          {/* North Tick */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[6px] bg-[rgba(53,214,223,0.7)]" />
          {/* South Tick */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-[6px] bg-[rgba(53,214,223,0.7)]" />
          {/* West Tick */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[6px] h-[1px] bg-[rgba(53,214,223,0.7)]" />
          {/* East Tick */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[6px] h-[1px] bg-[rgba(53,214,223,0.7)]" />
          {/* Precision Center Dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[rgba(53,214,223,0.8)] shadow-[0_0_4px_rgba(53,214,223,0.8)]" />
        </div>

        {/* Luminous Outer Rim (Electric Teal idle / Champagne Gold interactive hover) */}
        <div
          id="cursor-lens-rim"
          ref={rimRef}
          className="absolute inset-0 rounded-full border-[1.5px] border-[rgba(53,214,223,0.65)] shadow-[0_0_16px_rgba(53,214,223,0.28),inset_0_0_10px_rgba(255,255,255,0.12)] transition-colors duration-150"
        />
      </div>
    </div>
  );
}
