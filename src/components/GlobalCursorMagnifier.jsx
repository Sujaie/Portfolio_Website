import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * GlobalCursorMagnifier
 * 
 * High-performance, zero-React-rerender optical cursor lens:
 * - Single circular optical window (150px / r=75px)
 * - 1.35x optical magnification with zero subpixel drift
 * - True vector typography mirroring (sharp text at all zoom levels)
 * - Restrained luminous cyan rim (idle) / warm gold rim (interactive hover)
 * - Fully inert mirrored DOM with zero keyboard, screen-reader, or click obstruction
 * - Full dormancy: consumes 0% CPU / GPU when cursor and scroll are stationary
 * - Lifecycle-aware: pauses when tab is hidden, disables on touch devices, respects reduced motion
 */
export default function GlobalCursorMagnifier() {
  const lensRef = useRef(null);
  const lensRimRef = useRef(null);
  const clipLayerRef = useRef(null);
  const contentMirrorRef = useRef(null);
  const headerMirrorRef = useRef(null);

  const [isTouch, setIsTouch] = useState(false);
  const prefersReduced = useReducedMotion();

  // Optical Constants
  const LENS_RADIUS = 75; // 150px circular optical window
  const MAGNIFY_FACTOR = 1.35; // 1.35x crisp optical enlargement

  useEffect(() => {
    // Detect touch-only mobile devices (no mouse/trackpad pointer)
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (touchQuery.matches) {
      setIsTouch(true);
      return;
    }

    const handleTouchChange = (e) => {
      setIsTouch(e.matches);
    };
    touchQuery.addEventListener?.('change', handleTouchChange);

    // Internal mutable cursor and loop coordinates (Zero React state updates)
    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let lastScrollX = 0;
    let lastScrollY = 0;
    let rafId = null;
    let isRunning = false;
    let isInside = false;
    let isHovered = false;
    let lastSyncedSection = null;

    // 1. Clone the scrollable page content with rigorous DOM hygiene
    const syncContentMirror = () => {
      if (!contentMirrorRef.current) return;
      contentMirrorRef.current.innerHTML = '';
      const contentSource = document.querySelector('[data-magnifier-source]');
      if (!contentSource) return;

      const contentClone = contentSource.cloneNode(true);
      contentClone.removeAttribute('data-magnifier-source');
      contentClone.classList.add('cursor-mirror-element');

      // Strip non-visual & non-essential tags
      contentClone.querySelectorAll('audio, video, script, noscript').forEach((el) => el.remove());

      // Disable backdrop-filter inside the mirror so GPU compositor never samples black
      contentClone.querySelectorAll('[class*="backdrop-blur"], [style*="backdrop-filter"]').forEach((el) => {
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
      });

      // Accessibility hygiene: ensure mirror cannot be focused, read, or collide with forms
      contentClone.querySelectorAll('[id]').forEach((el) => {
        el.id = `${el.id}-mirror`;
      });
      contentClone.querySelectorAll('input, textarea, select').forEach((el) => {
        el.removeAttribute('name');
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-hidden', 'true');
      });
      contentClone.querySelectorAll('a, button, [tabindex]').forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });

      // Optical mirror hygiene: ensure all elements in the mirror have 100% opacity
      // and strip animation hook classes so external scripts never mutate mirror elements
      contentClone.querySelectorAll('[style*="opacity"]').forEach((el) => {
        el.style.opacity = '1';
      });
      contentClone.querySelectorAll('.skill-card, .timeline-item, .showcase-active-content').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.remove('skill-card', 'timeline-item', 'showcase-active-content');
      });

      contentMirrorRef.current.appendChild(contentClone);
    };

    // 2. Clone the fixed header (ensuring active underline & solid opaque background)
    const syncHeaderMirror = () => {
      if (!headerMirrorRef.current) return;
      const headerSource = document.getElementById('main-navbar');
      if (!headerSource) return;

      const currentActive = headerSource.getAttribute('data-active-section') || '';
      lastSyncedSection = currentActive;

      headerMirrorRef.current.innerHTML = '';
      const headerClone = headerSource.cloneNode(true);
      headerClone.removeAttribute('id');
      headerClone.classList.add('cursor-mirror-element');
      headerClone.querySelectorAll('audio, video, script, noscript').forEach((el) => el.remove());
      headerClone.querySelectorAll('[id]').forEach((el) => {
        el.id = `${el.id}-mirror-nav`;
      });
      headerClone.querySelectorAll('a, button, [tabindex]').forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });

      // Fixed nav positioning inside mirror identical to real navbar
      headerClone.style.position = 'relative';
      headerClone.style.top = '0px';
      headerClone.style.left = '0px';
      headerClone.style.width = '100%';
      headerClone.style.height = 'var(--nav-height)';
      headerClone.style.backgroundColor = 'var(--bg-base)';
      headerMirrorRef.current.appendChild(headerClone);
    };

    const syncMirrorDOM = () => {
      syncContentMirror();
      syncHeaderMirror();
      wakeRenderLoop();
    };

    syncMirrorDOM();

    // Observe content DOM mutations (debounced 250ms)
    const contentSource = document.querySelector('[data-magnifier-source]');
    let mutationObserver = null;
    if (contentSource && window.MutationObserver) {
      let timer = null;
      mutationObserver = new MutationObserver((mutations) => {
        // Ignore mutations on inputs or non-visual attributes to save overhead
        const isSignificant = mutations.some(m => m.type === 'childList' || (m.type === 'attributes' && m.attributeName !== 'value'));
        if (!isSignificant) return;
        clearTimeout(timer);
        timer = setTimeout(syncContentMirror, 250);
      });
      mutationObserver.observe(contentSource, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-selected', 'data-active-section'],
      });
    }

    // Observe navbar DOM mutations (active section underline & SFX toggle)
    const headerSource = document.getElementById('main-navbar');
    let headerObserver = null;
    if (headerSource && window.MutationObserver) {
      headerObserver = new MutationObserver(() => {
        syncHeaderMirror();
      });
      headerObserver.observe(headerSource, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-active-section', 'class', 'style'],
      });
    }

    function wakeRenderLoop() {
      if (!isRunning && !document.hidden) {
        isRunning = true;
        rafId = requestAnimationFrame(render);
      }
    }

    // High performance 60+ FPS transform loop with idle dormancy
    function render() {
      const ease = prefersReduced ? 1 : 0.35;
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0.05) {
        currentX += dx * ease;
        currentY += dy * ease;
      } else {
        currentX = mouseX;
        currentY = mouseY;
      }

      const scrollX = window.scrollX || window.pageXOffset || 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const scrollDelta = Math.abs(scrollY - lastScrollY) + Math.abs(scrollX - lastScrollX);

      // 1. Move the single physical glass lens shell
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Position circular clip-path window exactly around (currentX, currentY)
      if (clipLayerRef.current) {
        const clip = `circle(${LENS_RADIUS}px at ${currentX}px ${currentY}px)`;
        clipLayerRef.current.style.clipPath = clip;
        clipLayerRef.current.style.webkitClipPath = clip;
      }

      // 3. Scrollable page content mirror: Exact zero-offset magnification everywhere on the page
      if (contentMirrorRef.current) {
        const transX = (1 - MAGNIFY_FACTOR) * currentX - MAGNIFY_FACTOR * scrollX;
        const transY = (1 - MAGNIFY_FACTOR) * currentY - MAGNIFY_FACTOR * scrollY;
        contentMirrorRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${MAGNIFY_FACTOR})`;
      }

      // 4. Fixed header mirror: Active when cursor touches top area, magnifies navbar with zero offset
      if (headerMirrorRef.current) {
        if (currentY <= 150) {
          headerMirrorRef.current.style.display = 'block';
          const navTransX = (1 - MAGNIFY_FACTOR) * currentX;
          const navTransY = (1 - MAGNIFY_FACTOR) * currentY;
          headerMirrorRef.current.style.transform = `translate3d(${navTransX}px, ${navTransY}px, 0) scale(${MAGNIFY_FACTOR})`;
        } else {
          headerMirrorRef.current.style.display = 'none';
        }
      }

      lastScrollX = scrollX;
      lastScrollY = scrollY;

      // Sleep loop if cursor is stationary AND scroll has settled
      if (distSq <= 0.05 && scrollDelta < 0.2) {
        isRunning = false;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(render);
      }
    }

    const setLensVisibility = (visible) => {
      const opacityVal = visible ? '1' : '0';
      if (lensRef.current) lensRef.current.style.opacity = opacityVal;
      if (clipLayerRef.current) clipLayerRef.current.style.opacity = opacityVal;
    };

    const updateHoverState = (hovered) => {
      if (hovered === isHovered) return;
      isHovered = hovered;
      if (!lensRimRef.current) return;

      if (isHovered) {
        lensRimRef.current.style.borderColor = 'rgba(233, 169, 39, 0.85)';
        lensRimRef.current.style.boxShadow =
          '0 0 22px rgba(233, 169, 39, 0.42), inset 0 0 10px rgba(255, 255, 255, 0.18)';
      } else {
        lensRimRef.current.style.borderColor = 'rgba(0, 191, 196, 0.65)';
        lensRimRef.current.style.boxShadow =
          '0 0 18px rgba(0, 191, 196, 0.30), inset 0 0 10px rgba(255, 255, 255, 0.12)';
      }
    };

    const handlePointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInside) {
        isInside = true;
        currentX = mouseX;
        currentY = mouseY;
        setLensVisibility(true);
      }

      // Zero-React-rerender hover detection
      const target = e.target;
      if (target && target.closest('a, button, [role="button"], [role="tab"], input, textarea, select, .interactive-hover')) {
        updateHoverState(true);
      } else {
        updateHoverState(false);
      }

      wakeRenderLoop();
    };

    const handlePointerLeave = () => {
      isInside = false;
      setLensVisibility(false);
      updateHoverState(false);
    };

    const handleScrollSync = () => {
      wakeRenderLoop();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        isRunning = false;
      } else if (isInside) {
        wakeRenderLoop();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScrollSync, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('resize', syncMirrorDOM);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial positioning wake-up
    setLensVisibility(false);

    return () => {
      touchQuery.removeEventListener?.('change', handleTouchChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScrollSync);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', syncMirrorDOM);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mutationObserver) mutationObserver.disconnect();
      if (headerObserver) headerObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  if (isTouch) {
    return null;
  }

  return (
    <>
      {/* Layer 1: True Scaled Optical Mirror (Clipped to Circular Lens Window) */}
      <div
        ref={clipLayerRef}
        inert="true"
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none z-[9990] opacity-0 transition-opacity duration-200"
        style={{
          clipPath: 'circle(0px at -1000px -1000px)',
          WebkitClipPath: 'circle(0px at -1000px -1000px)',
        }}
      >
        {/* Scrollable Main Content Mirror (Exact zero-offset transform origin 0 0) */}
        <div
          ref={contentMirrorRef}
          className="absolute top-0 left-0 w-full pointer-events-none select-none will-change-transform"
          style={{ transformOrigin: '0 0' }}
        />

        {/* Fixed Header Mirror (Displayed when cursor approaches the top bar) */}
        <div
          ref={headerMirrorRef}
          className="absolute top-0 left-0 w-full pointer-events-none select-none z-50 will-change-transform"
          style={{ transformOrigin: '0 0', display: 'none' }}
        />
      </div>

      {/* Layer 2: Single Glass Lens Shell with Pure Luminous Cyan/Gold Rim */}
      <div
        ref={lensRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none select-none z-[9999] opacity-0 will-change-transform transition-opacity duration-200"
        style={{
          width: `${LENS_RADIUS * 2}px`,
          height: `${LENS_RADIUS * 2}px`,
          transform: 'translate3d(-1000px, -1000px, 0) translate(-50%, -50%)',
        }}
      >
        <div className="relative w-full h-full rounded-full">
          {/* Luminous Outer Rim (Cyan default / Gold hover) */}
          <div
            ref={lensRimRef}
            className="absolute inset-0 rounded-full border-[1.5px] border-[rgba(0,191,196,0.65)] shadow-[0_0_18px_rgba(0,191,196,0.30),inset_0_0_10px_rgba(255,255,255,0.12)] transition-colors duration-150"
          />

          {/* Delicate Glass Refraction Highlight (subtle radial sheen across glass center) */}
          <div
            className="absolute inset-[1px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.08) 0%, rgba(0,191,196,0.02) 45%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </>
  );
}
