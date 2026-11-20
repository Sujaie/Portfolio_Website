import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * GlobalCursorMagnifier (True Optical Vector Magnification Lens)
 * 
 * Architecture:
 * - Single circular optical window (130px diameter / r=65px)
 * - 1.35x true optical magnification of typography, code, telemetry, and cards
 * - Zero accessibility/test collision: mirror is fully sanitized (tags converted to non-interactive
 *   divs/spans, all IDs and form names stripped, inert and aria-hidden)
 * - Luminous Electric Teal outer rim (idle) / Champagne Gold rim (interactive hover)
 * - Clipped circular viewport overlay (`clip-path: circle(...)`)
 * - 0% CPU/GPU consumption when cursor and scroll are stationary (strict dormancy)
 * - Disabled on touch devices ((hover: none) and (pointer: coarse))
 * - Respects prefers-reduced-motion: reduce
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
  const LENS_RADIUS = 65; // 130px circular optical window
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

    // Sanitize cloned DOM nodes to prevent ID collisions, accessibility warnings, or test selector conflicts
    const sanitizeNode = (root) => {
      // 1. Remove non-visual, media, and modal elements
      root
        .querySelectorAll('audio, video, script, noscript, style, [role="dialog"], [aria-modal="true"]')
        .forEach((el) => el.remove());

      // 2. Remove all IDs so there are zero duplicate IDs in the document
      root.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));

      // 3. Convert headings to passive divs (preserves Tailwind typography perfectly, avoids heading collisions)
      root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
        const div = document.createElement('div');
        div.className = heading.className;
        div.innerHTML = heading.innerHTML;
        heading.parentNode?.replaceChild(div, heading);
      });

      // 4. Convert interactive elements to passive divs/spans (preserves visual styles completely)
      root.querySelectorAll('button').forEach((btn) => {
        const div = document.createElement('div');
        div.className = btn.className;
        div.innerHTML = btn.innerHTML;
        btn.parentNode?.replaceChild(div, btn);
      });

      root.querySelectorAll('a').forEach((a) => {
        const span = document.createElement('span');
        span.className = a.className;
        span.innerHTML = a.innerHTML;
        a.parentNode?.replaceChild(span, a);
      });

      root.querySelectorAll('input, textarea, select').forEach((input) => {
        const div = document.createElement('div');
        div.className = input.className;
        div.textContent = input.value || input.placeholder || '';
        input.parentNode?.replaceChild(div, input);
      });

      root.querySelectorAll('form').forEach((form) => {
        const div = document.createElement('div');
        div.className = form.className;
        div.innerHTML = form.innerHTML;
        form.parentNode?.replaceChild(div, form);
      });

      // 5. Remove test/animation hook class names (which have no CSS rules attached)
      const hookClasses = [
        'hero-line-1',
        'hero-line-2',
        'hero-line-3',
        'hero-accent',
        'hero-meta-item',
        'hero-explore',
        'about-paragraph',
        'about-highlight-pill',
        'about-lead-text',
        'skill-card',
        'skill-meter-segment',
        'skills-exploring-row',
        'timeline-item',
        'showcase-active-content',
      ];
      hookClasses.forEach((cls) => {
        root.querySelectorAll(`.${cls}`).forEach((el) => {
          el.classList.remove(cls);
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });

      // 6. Strip all aria, role, name, and tabindex attributes
      root.querySelectorAll('*').forEach((el) => {
        for (const attr of Array.from(el.attributes)) {
          if (
            attr.name.startsWith('aria-') ||
            attr.name === 'role' ||
            attr.name === 'tabindex' ||
            attr.name === 'name' ||
            attr.name === 'data-active-section'
          ) {
            el.removeAttribute(attr.name);
          }
        }
      });

      // 7. Ensure elements hidden by entrance animations are visible in the optical mirror
      root.querySelectorAll('[style*="opacity"]').forEach((el) => {
        el.style.opacity = '1';
      });

      // 8. Disable backdrop-filter inside the mirror so GPU compositor never samples black
      root.querySelectorAll('[class*="backdrop-blur"], [style*="backdrop-filter"]').forEach((el) => {
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
      });
    };

    // 1. Clone the scrollable page content
    const syncContentMirror = () => {
      if (!contentMirrorRef.current) return;
      contentMirrorRef.current.innerHTML = '';
      const contentSource = document.querySelector('[data-magnifier-source]');
      if (!contentSource) return;

      const contentClone = contentSource.cloneNode(true);
      contentClone.removeAttribute('data-magnifier-source');
      contentClone.classList.add('cursor-mirror-element');
      sanitizeNode(contentClone);

      contentMirrorRef.current.appendChild(contentClone);
    };

    // 2. Clone the fixed header
    const syncHeaderMirror = () => {
      if (!headerMirrorRef.current) return;
      const headerSource = document.getElementById('main-navbar');
      if (!headerSource) return;

      headerMirrorRef.current.innerHTML = '';
      const headerClone = headerSource.cloneNode(true);
      headerClone.removeAttribute('id');
      headerClone.classList.add('cursor-mirror-element');
      sanitizeNode(headerClone);

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
        const isSignificant = mutations.some(
          (m) => m.type === 'childList' || (m.type === 'attributes' && m.attributeName !== 'value')
        );
        if (!isSignificant) return;
        clearTimeout(timer);
        timer = setTimeout(syncContentMirror, 250);
      });
      mutationObserver.observe(contentSource, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-selected'],
      });
    }

    // Observe navbar DOM mutations
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

      // 1. Move physical lens shell
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
        // Champagne Gold on interactive hover
        lensRimRef.current.style.borderColor = 'rgba(240, 189, 88, 0.85)';
        lensRimRef.current.style.boxShadow =
          '0 0 22px rgba(240, 189, 88, 0.42), inset 0 0 10px rgba(255, 255, 255, 0.18)';
      } else {
        // Electric Teal by default
        lensRimRef.current.style.borderColor = 'rgba(53, 214, 223, 0.65)';
        lensRimRef.current.style.boxShadow =
          '0 0 18px rgba(53, 214, 223, 0.30), inset 0 0 10px rgba(255, 255, 255, 0.12)';
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
      if (
        target &&
        target.closest('a, button, [role="button"], [role="tab"], input, textarea, select, .interactive-hover')
      ) {
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
          className="absolute top-0 left-0 w-full pointer-events-none select-none will-change-transform filter brightness-[1.08] contrast-[1.06]"
          style={{ transformOrigin: '0 0' }}
        />

        {/* Fixed Header Mirror (Displayed when cursor approaches the top bar) */}
        <div
          ref={headerMirrorRef}
          className="absolute top-0 left-0 w-full pointer-events-none select-none z-50 will-change-transform filter brightness-[1.08] contrast-[1.06]"
          style={{ transformOrigin: '0 0', display: 'none' }}
        />
      </div>

      {/* Layer 2: Single Glass Lens Shell with Pure Luminous Electric Teal / Champagne Gold Rim */}
      <div
        id="cursor-lens-shell"
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
          {/* Luminous Outer Rim (Electric Teal default / Champagne Gold hover) */}
          <div
            id="cursor-lens-rim"
            ref={lensRimRef}
            className="absolute inset-0 rounded-full border-[1.5px] border-[rgba(53,214,223,0.65)] shadow-[0_0_18px_rgba(53,214,223,0.30),inset_0_0_10px_rgba(255,255,255,0.12)] transition-colors duration-150"
          />

          {/* Delicate Glass Refraction Highlight (subtle radial sheen across glass center) */}
          <div
            className="absolute inset-[1px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.08) 0%, rgba(53,214,223,0.02) 45%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </>
  );
}
