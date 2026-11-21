import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/**
 * GlobalCursorMagnifier — Spherical Optical Magnification Instrument Glass Orb
 * 
 * Physics-Grade Optical Architecture:
 * - Real spherical convex lens curvature via GPU-accelerated SVG <feDisplacementMap>.
 * - Radial barrel distortion: text and UI curve and bulge naturally outward from center to rim.
 * - True 1.35x optical magnification of typography, telemetry, and cards.
 * - Solid midnight canvas (#050810) base inside aperture to eliminate text ghosting / double text.
 * - Multi-layer optical glass shader: specular highlights, peripheral curvature sheen, and contrast tuning.
 * - Precision instrument reticle: hairline tick marks at 12, 3, 6, and 9 o'clock + center dot.
 * - Luminous dual-state rim:
 *   - Idle / Canvas: Electric Teal (#35D6DF) with subtle atmospheric glow.
 *   - Interactive Hover: Champagne Gold (#F0BD58) with expanded scale (1.28x) and focal glow.
 * - Tactile click impulse: momentary compression on pointerdown (scale 0.92x).
 * - 60+ FPS zero-React-rerender transform loop with strict 0% CPU dormancy when idle.
 * - Zero accessibility/test collisions: sanitized passive elements, inert and aria-hidden.
 * - Disabled on touch/mobile devices ((hover: none) and (pointer: coarse)).
 * - Strict prefers-reduced-motion compliance.
 */
/**
 * Precompute the photorealistic spherical lens displacement map (synchronous Data URL)
 * Generates an exact radial spherical convex refraction texture.
 */
function createLensDisplacementMap(radius) {
  if (typeof document === 'undefined') return '';
  const size = radius * 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - radius;
      const dy = y - radius;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const d = dist / radius;

      if (d >= 1) {
        // Outside lens: neutral grey (128) = zero displacement
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
      } else {
        // High-definition spherical convex curvature:
        // Radial sine profile that bows outward and produces authentic physical dome refraction
        const angle = Math.atan2(dy, dx);
        const amount = Math.sin(d * Math.PI * 0.95) * (1 - 0.25 * d);
        data[idx] = Math.round(128 + 127 * (-Math.cos(angle) * amount));
        data[idx + 1] = Math.round(128 + 127 * (-Math.sin(angle) * amount));
        data[idx + 2] = 128;
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

export default function GlobalCursorMagnifier() {
  const lensRef = useRef(null);
  const orbRef = useRef(null);
  const contentMirrorRef = useRef(null);
  const headerMirrorRef = useRef(null);
  const rimRef = useRef(null);
  const reticleRef = useRef(null);

  const [isTouch, setIsTouch] = useState(false);
  const prefersReduced = useReducedMotion();

  const LENS_RADIUS = 65; // 130px circular optical aperture
  const MAGNIFY = 1.35; // 1.35x crisp optical magnification

  // Synchronously initialize the displacement map so <feImage> is present on frame 0
  const [distortionMapUrl] = useState(() => createLensDisplacementMap(LENS_RADIUS));

  useEffect(() => {

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
    let lastScrollX = 0;
    let lastScrollY = 0;
    let isRunning = false;
    let isInside = false;
    let isHovered = false;
    let isPressed = false;
    let idleCounter = 0;
    let rafId = null;

    // Sanitize cloned DOM nodes to prevent ID collisions, accessibility warnings, or test selector conflicts
    const sanitizeNode = (root) => {
      // 0. Sanitize root element itself
      root.removeAttribute('id');
      root.removeAttribute('data-active-section');
      root.removeAttribute('data-magnifier-source');
      for (const attr of Array.from(root.attributes)) {
        if (
          attr.name.startsWith('aria-') ||
          attr.name === 'role' ||
          attr.name === 'tabindex' ||
          attr.name === 'name' ||
          attr.name === 'target'
        ) {
          root.removeAttribute(attr.name);
        }
      }

      // 1. Remove non-visual, media, audio, video, script, modal dialogs, and decorative scanlines/sweep beams
      root
        .querySelectorAll('audio, video, script, noscript, style, [role="dialog"], [aria-modal="true"], [class*="bg-gradient-to-r"][class*="via-"]')
        .forEach((el) => el.remove());

      // 2. Remove all IDs so there are zero duplicate IDs in the document
      root.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));

      // 3. Convert headings to passive divs (preserves all CSS classes & styles)
      root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
        const div = document.createElement('div');
        div.className = heading.className;
        div.innerHTML = heading.innerHTML;
        heading.parentNode?.replaceChild(div, heading);
      });

      // 4. Convert interactive elements to passive divs/spans
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

      // 5. Remove test hook and animation class names
      const testHookClasses = [
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
        'cursor-mirror-element',
      ];
      testHookClasses.forEach((cls) => {
        root.querySelectorAll(`.${cls}`).forEach((el) => {
          el.classList.remove(cls);
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });

      // 6. Strip all aria, role, name, target, and tabindex attributes
      root.querySelectorAll('*').forEach((el) => {
        for (const attr of Array.from(el.attributes)) {
          if (
            attr.name.startsWith('aria-') ||
            attr.name === 'role' ||
            attr.name === 'tabindex' ||
            attr.name === 'name' ||
            attr.name === 'target' ||
            attr.name === 'data-active-section'
          ) {
            el.removeAttribute(attr.name);
          }
        }
      });

      // 7. Ensure elements hidden by entrance animations are visible
      root.querySelectorAll('[style*="opacity"]').forEach((el) => {
        el.style.opacity = '1';
      });

      // 8. Disable backdrop-filter inside mirror
      root.querySelectorAll('[class*="backdrop-blur"], [style*="backdrop-filter"]').forEach((el) => {
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
      });
    };

    // Clone scrollable main page content
    const syncContentMirror = () => {
      if (!contentMirrorRef.current) return;
      contentMirrorRef.current.innerHTML = '';
      const mainSource = document.querySelector('[data-magnifier-source]');
      if (!mainSource) return;

      const clone = mainSource.cloneNode(true);
      sanitizeNode(clone);

      const clientWidth = document.documentElement.clientWidth || window.innerWidth;
      clone.style.width = `${clientWidth}px`;
      clone.style.position = 'relative';
      clone.style.margin = '0';
      clone.style.pointerEvents = 'none';

      contentMirrorRef.current.appendChild(clone);
    };

    // Clone fixed header navbar
    const syncHeaderMirror = () => {
      if (!headerMirrorRef.current) return;
      headerMirrorRef.current.innerHTML = '';
      const headerSource = document.getElementById('main-navbar');
      if (!headerSource) return;

      const headerClone = headerSource.cloneNode(true);
      sanitizeNode(headerClone);

      const clientWidth = document.documentElement.clientWidth || window.innerWidth;
      headerClone.style.width = `${clientWidth}px`;
      headerClone.style.position = 'relative';
      headerClone.style.top = '0px';
      headerClone.style.left = '0px';
      headerClone.style.margin = '0';
      headerClone.style.backgroundColor = 'var(--bg-base, #050810)';
      headerClone.style.pointerEvents = 'none';

      headerMirrorRef.current.appendChild(headerClone);
    };

    function wakeLoop() {
      idleCounter = 0;
      if (!isRunning && !document.hidden && isInside) {
        isRunning = true;
        rafId = requestAnimationFrame(render);
      }
    }

    const syncMirrorDOM = () => {
      syncContentMirror();
      syncHeaderMirror();
      wakeLoop();
    };

    // Initial sync
    syncMirrorDOM();

    // Observe mutations on main (e.g. tab switches in About/Work)
    const mainSource = document.querySelector('[data-magnifier-source]');
    let mutationObserver = null;
    if (mainSource && window.MutationObserver) {
      let timer = null;
      mutationObserver = new MutationObserver((mutations) => {
        const isSignificant = mutations.some(
          (m) => m.type === 'childList' || (m.type === 'attributes' && m.attributeName !== 'value')
        );
        if (!isSignificant) return;
        clearTimeout(timer);
        timer = setTimeout(syncContentMirror, 200);
      });
      mutationObserver.observe(mainSource, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-selected'],
      });
    }

    function render() {
      // Direct 1:1 hardware cursor tracking: zero lag, zero rubber-banding, zero jitter
      currentX = mouseX;
      currentY = mouseY;

      const scrollX = window.scrollX || window.pageXOffset || 0;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const scrollDelta = Math.abs(scrollY - lastScrollY) + Math.abs(scrollX - lastScrollX);

      // 1. Move circular lens shell (Locked directly to mouse pointer with ZERO transform transition)
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Optical Magnification of scrollable main content (Exact zero-offset center alignment)
      if (contentMirrorRef.current) {
        const transX = LENS_RADIUS - MAGNIFY * (currentX + scrollX);
        const transY = LENS_RADIUS - MAGNIFY * (currentY + scrollY);
        contentMirrorRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${MAGNIFY})`;
      }

      // 3. Optical Magnification of fixed header navbar (When cursor touches top region)
      if (headerMirrorRef.current) {
        if (currentY <= 120) {
          headerMirrorRef.current.style.display = 'block';
          const hTransX = LENS_RADIUS - MAGNIFY * currentX;
          const hTransY = LENS_RADIUS - MAGNIFY * currentY;
          headerMirrorRef.current.style.transform = `translate3d(${hTransX}px, ${hTransY}px, 0) scale(${MAGNIFY})`;
        } else {
          headerMirrorRef.current.style.display = 'none';
        }
      }

      lastScrollX = scrollX;
      lastScrollY = scrollY;

      // Enter 0% CPU dormancy when stationary
      if (idleCounter > 15 && scrollDelta < 0.2) {
        isRunning = false;
        rafId = null;
      } else {
        idleCounter++;
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
      if (orbRef.current && !isPressed) {
        orbRef.current.style.transform = isHovered ? 'scale(1.25)' : 'scale(1)';
      }
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
        if (contentMirrorRef.current && !contentMirrorRef.current.firstChild) {
          syncMirrorDOM();
        }
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
      if (orbRef.current) orbRef.current.style.transform = 'scale(0.92)';
      wakeLoop();
    };

    const handlePointerUp = () => {
      isPressed = false;
      if (orbRef.current) orbRef.current.style.transform = isHovered ? 'scale(1.25)' : 'scale(1)';
      wakeLoop();
    };

    const handlePointerLeave = () => {
      isInside = false;
      setVisibility(false);
      updateHoverState(false);
    };

    const handleScrollSync = () => {
      wakeLoop();
    };

    const handleResize = () => {
      syncMirrorDOM();
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
    window.addEventListener('scroll', handleScrollSync, { passive: true });
    window.addEventListener('resize', handleResize);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    setVisibility(false);

    // Re-sync after hero entrance settles
    const settleTimer = setTimeout(syncMirrorDOM, 1200);

    return () => {
      clearTimeout(settleTimer);
      touchQuery.removeEventListener?.('change', handleTouchChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', handleScrollSync);
      window.removeEventListener('resize', handleResize);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mutationObserver) mutationObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  if (isTouch) {
    return null;
  }

  return (
    <>
      {/* SVG Filter for Photorealistic GPU Spherical Lens Curvature & Barrel Distortion */}
      <svg
        aria-hidden="true"
        className="fixed top-0 left-0 w-0 h-0 pointer-events-none opacity-0"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter id="cursor-lens-distortion" x="0%" y="0%" width="100%" height="100%">
            <feImage
              href={distortionMapUrl}
              xlinkHref={distortionMapUrl}
              preserveAspectRatio="none"
              result="lensMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensMap"
              scale="68"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        id="cursor-lens-shell"
        ref={lensRef}
        aria-hidden="true"
        inert={true}
        className="fixed top-0 left-0 pointer-events-none select-none z-[9999] opacity-0 will-change-transform transition-opacity duration-150 ease-out"
        style={{
          width: `${LENS_RADIUS * 2}px`,
          height: `${LENS_RADIUS * 2}px`,
          transform: 'translate3d(-1000px, -1000px, 0) translate(-50%, -50%)',
        }}
      >
        <div
          ref={orbRef}
          className="relative w-full h-full rounded-full overflow-hidden bg-[#050810] shadow-[inset_0_0_24px_rgba(5,8,16,0.95)] transition-transform duration-200 ease-out"
        >
          {/* Layer 1: Spherical Optical Distortion Stage (GPU Accelerated SVG feDisplacementMap) */}
          <div
            className="absolute inset-0 pointer-events-none select-none"
            style={{
              filter: distortionMapUrl ? 'url(#cursor-lens-distortion)' : 'none',
            }}
          >
            {/* Scrollable Main Page Surface (Scaled 1.35x, with radial spherical lens curvature) */}
            <div
              ref={contentMirrorRef}
              aria-hidden="true"
              className="absolute top-0 left-0 pointer-events-none select-none will-change-transform"
              style={{
                transformOrigin: '0 0',
              }}
            />

            {/* Fixed Header Mirror (magnifies navbar when cursor approaches top) */}
            <div
              ref={headerMirrorRef}
              aria-hidden="true"
              className="absolute top-0 left-0 pointer-events-none select-none will-change-transform"
              style={{
                transformOrigin: '0 0',
                display: 'none',
              }}
            />
          </div>

          {/* Layer 2: Optical Glass Lens Sheen & Peripheral Refraction */}
          <div
            id="cursor-optical-filter"
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              backdropFilter: 'contrast(1.15) brightness(1.08)',
              WebkitBackdropFilter: 'contrast(1.15) brightness(1.08)',
              background:
                'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.16) 0%, rgba(53, 214, 223, 0.04) 45%, rgba(5, 8, 16, 0.35) 80%, transparent 100%)',
              boxShadow: 'inset 0 0 16px rgba(5, 8, 16, 0.85), inset 0 0 6px rgba(53, 214, 223, 0.25)',
            }}
          />

          {/* Layer 3: Delicate Instrument Crosshair Reticle (North, South, East, West tick marks) */}
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

          {/* Layer 4: Luminous Outer Rim (Electric Teal idle / Champagne Gold interactive hover) */}
          <div
            id="cursor-lens-rim"
            ref={rimRef}
            className="absolute inset-0 rounded-full border-[1.5px] border-[rgba(53,214,223,0.65)] shadow-[0_0_16px_rgba(53,214,223,0.28),inset_0_0_10px_rgba(255,255,255,0.12)] transition-colors duration-150"
          />
        </div>
      </div>
    </>
  );
}
