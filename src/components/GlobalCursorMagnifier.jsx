import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * GlobalCursorMagnifier (Glass Cursor Lens)
 * 
 * Core Look Implementation:
 * - Single circular optical window (120px diameter / r=60px)
 * - Pure CSS backdrop-filter glass magnification (zero DOM mirroring, zero accessible tree duplication)
 * - Restrained luminous cyan rim (idle) / warm gold rim (interactive hover)
 * - 60fps GPU compositor motion with smooth inertia
 * - Strict dormancy: consumes 0% CPU / GPU when cursor is stationary
 * - Touch device detection: disabled on touch devices ((hover: none) and (pointer: coarse))
 * - Respects prefers-reduced-motion: reduce (instant tracking or disabled)
 */
export default function GlobalCursorMagnifier() {
  const lensRef = useRef(null);
  const rimRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const prefersReduced = useReducedMotion();
  const [ready, setReady] = useState(() => prefersReduced);

  const LENS_RADIUS = 60; // 120px circular optical window

  // Hero Ignition synchronization: cursor orb wakes only after hero settles
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

    // Touch device detection
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (touchQuery.matches) {
      setIsTouch(true);
      return;
    }

    const handleTouchChange = (e) => setIsTouch(e.matches);
    touchQuery.addEventListener?.('change', handleTouchChange);

    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isRunning = false;
    let isInside = false;
    let isHovered = false;
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
        const scale = isHovered ? 1.15 : 1;
        lensRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      // Enter 0% CPU dormancy after ~1.5s of cursor being stationary
      if (idleCounter > 90 && distSq <= 0.05) {
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
        rimRef.current.style.borderColor = 'rgba(232, 168, 35, 0.85)';
        rimRef.current.style.boxShadow =
          '0 0 20px rgba(232, 168, 35, 0.35), inset 0 0 12px rgba(255, 255, 255, 0.16)';
      } else {
        rimRef.current.style.borderColor = 'rgba(31, 194, 201, 0.55)';
        rimRef.current.style.boxShadow =
          '0 0 16px rgba(31, 194, 201, 0.25), inset 0 0 10px rgba(255, 255, 255, 0.10)';
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
      if (target && target.closest('a, button, [role="button"], [role="tab"], input, textarea, select, .interactive-hover')) {
        updateHoverState(true);
      } else {
        updateHoverState(false);
      }

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
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    setVisibility(false);

    return () => {
      touchQuery.removeEventListener?.('change', handleTouchChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
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
        {/* Optical Glass Layer (Backdrop-filter blur & contrast) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backdropFilter: 'blur(2px) contrast(1.08) brightness(1.06)',
            WebkitBackdropFilter: 'blur(2px) contrast(1.08) brightness(1.06)',
            background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.06) 0%, rgba(31, 194, 201, 0.02) 40%, transparent 70%)',
          }}
        />

        {/* Luminous Outer Rim (Cyan default / Gold hover) */}
        <div
          ref={rimRef}
          className="absolute inset-0 rounded-full border border-[rgba(31,194,201,0.55)] shadow-[0_0_16px_rgba(31,194,201,0.25),inset_0_0_10px_rgba(255,255,255,0.10)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]"
        />
      </div>
    </div>
  );
}
