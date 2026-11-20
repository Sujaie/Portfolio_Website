import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function GlobalCursorMagnifier() {
  const lensRef = useRef(null);
  const lensShellRef = useRef(null);
  const clipLayerRef = useRef(null);
  const contentMirrorRef = useRef(null);
  const headerMirrorRef = useRef(null);

  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  // Optical Constants
  const LENS_RADIUS = 75; // 150px circular optical window
  const MAGNIFY_FACTOR = 1.38; // 1.38x crisp optical enlargement

  useEffect(() => {
    // Detect touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let lastScrollX = -1;
    let lastScrollY = -1;
    let rafId = null;
    let isRunning = false;
    let isInside = false;
    let lastSyncedSection = null;

    // 1. Clone the scrollable page content (optimized for GPU)
    const syncContentMirror = () => {
      if (!contentMirrorRef.current) return;
      contentMirrorRef.current.innerHTML = '';
      const contentSource = document.querySelector('[data-magnifier-source]');
      if (contentSource) {
        const contentClone = contentSource.cloneNode(true);
        contentClone.removeAttribute('data-magnifier-source');
        contentClone.classList.add('cursor-mirror-element');
        contentClone.style.backgroundColor = 'var(--bg-base)';

        // Strip non-visual elements
        contentClone.querySelectorAll('audio, video, script').forEach((el) => el.remove());

        // Retain original atmospheric blurs and mesh lighting (no destructive class mutations)
        // Disable backdrop-filter inside the mirror so Chromium / Opera GX GPU compositor never samples black
        contentClone.querySelectorAll('[class*="backdrop-blur"], [style*="backdrop-filter"]').forEach((el) => {
          el.style.backdropFilter = 'none';
          el.style.webkitBackdropFilter = 'none';
        });

        contentClone.querySelectorAll('[id]').forEach((el) => {
          el.id = `${el.id}-mirror`;
        });
        contentMirrorRef.current.appendChild(contentClone);
      }
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
      headerClone.querySelectorAll('audio, video, script').forEach((el) => el.remove());
      headerClone.querySelectorAll('[id]').forEach((el) => {
        el.id = `${el.id}-mirror-nav`;
      });
      // 100% solid background so nothing behind it shows through
      headerClone.style.position = 'relative';
      headerClone.style.top = '0px';
      headerClone.style.left = '0px';
      headerClone.style.width = '100%';
      headerClone.style.backgroundColor = 'var(--bg-base)';
      headerMirrorRef.current.appendChild(headerClone);
    };

    const syncMirrorDOM = () => {
      syncContentMirror();
      syncHeaderMirror();
      wakeRenderLoop();
    };

    syncMirrorDOM();

    // Listen for content DOM changes with 200ms debounce
    const contentSource = document.querySelector('[data-magnifier-source]');
    let mutationObserver = null;
    if (contentSource && window.MutationObserver) {
      let timer = null;
      mutationObserver = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(syncContentMirror, 200);
      });
      mutationObserver.observe(contentSource, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Observe real header DOM mutations (active section underline changes, SFX toggle)
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
      if (!isRunning) {
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

      if (distSq > 0.04) {
        currentX += dx * ease;
        currentY += dy * ease;
      } else {
        currentX = mouseX;
        currentY = mouseY;
      }

      const scrollX = window.scrollX || window.pageXOffset || 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // 1. Move the single physical glass lens shell
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Position the circular clip-path window exactly around (currentX, currentY)
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
        if (currentY <= 165) {
          // Verify header state is in sync with the real navbar
          const realNav = document.getElementById('main-navbar');
          if (realNav) {
            const currentActive = realNav.getAttribute('data-active-section');
            if (currentActive && currentActive !== lastSyncedSection) {
              syncHeaderMirror();
            }
          }

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

      // If cursor has reached destination and scroll is stationary, sleep the loop to save 100% CPU/GPU
      if (distSq <= 0.04) {
        isRunning = false;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(render);
      }
    }

    const handlePointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInside) {
        isInside = true;
        currentX = mouseX;
        currentY = mouseY;
        setIsVisible(true);

        if (lensShellRef.current && !prefersReduced) {
          animate(lensShellRef.current, {
            scale: [0.85, 1],
            opacity: [0, 1],
            duration: 200,
            ease: 'outCubic',
          });
        }
      }

      // Detect hover over interactive targets (including fixed navbar links)
      const target = e.target;
      if (target && target.closest('a, button, [role="button"], input, textarea, .interactive-hover')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      wakeRenderLoop();
    };

    const handlePointerLeave = () => {
      isInside = false;
      setIsVisible(false);
      if (lensShellRef.current && !prefersReduced) {
        animate(lensShellRef.current, {
          scale: [1, 0.85],
          opacity: [1, 0],
          duration: 180,
          ease: 'inQuad',
        });
      }
    };

    const handleScrollSync = () => {
      const realNav = document.getElementById('main-navbar');
      if (realNav) {
        const currentActive = realNav.getAttribute('data-active-section');
        if (currentActive && currentActive !== lastSyncedSection) {
          syncHeaderMirror();
        }
      }
      wakeRenderLoop();
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScrollSync, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('resize', syncMirrorDOM);
    wakeRenderLoop();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScrollSync);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', syncMirrorDOM);
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
      {/* Layer 1: True Scaled Optical Mirror (Clipped to Circle Window) */}
      <div
        ref={clipLayerRef}
        className="fixed inset-0 pointer-events-none select-none z-[9990] transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          clipPath: 'circle(0px at 0px 0px)',
          WebkitClipPath: 'circle(0px at 0px 0px)',
        }}
        aria-hidden="true"
      >
        {/* Scrollable Main Content Mirror (Exact zero-offset transform origin 0 0) */}
        <div
          ref={contentMirrorRef}
          className="absolute top-0 left-0 w-full pointer-events-none select-none will-change-transform"
          style={{ transformOrigin: '0 0' }}
        />

        {/* Fixed Header Mirror (Sits on top with z-50, displayed only when hovering top bar) */}
        <div
          ref={headerMirrorRef}
          className="absolute top-0 left-0 w-full pointer-events-none select-none z-50 will-change-transform"
          style={{ transformOrigin: '0 0', display: 'none' }}
        />
      </div>

      {/* Layer 2: Single Glass Lens Shell with Pure Luminous Cyan/Gold Rim */}
      <div
        ref={lensRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: `${LENS_RADIUS * 2}px`,
          height: `${LENS_RADIUS * 2}px`,
        }}
        aria-hidden="true"
      >
        <div
          ref={lensShellRef}
          className="relative w-full h-full rounded-full"
        >
          {/* Luminous Outer Rim (Cyan by default / Gold on hover) */}
          <div
            className={`absolute inset-0 rounded-full border-[1.5px] transition-colors duration-200 ${
              isHovered
                ? 'border-[var(--color-accent)]/85 shadow-[0_0_24px_rgba(233,169,39,0.45),inset_0_0_12px_rgba(255,255,255,0.2)]'
                : 'border-[var(--color-highlight)]/60 shadow-[0_0_20px_rgba(0,191,196,0.32),inset_0_0_12px_rgba(255,255,255,0.12)]'
            }`}
          />

          {/* Delicate Glass Refraction Highlight (subtle radial sheen, no harsh white lines) */}
          <div
            className="absolute inset-[2px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.12) 0%, rgba(0,191,196,0.03) 45%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </>
  );
}
