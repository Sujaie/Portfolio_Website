# IMPLEMENTATION PLAN: PORTFOLIO "CORE LOOK" BUILD (GATES 1-6)

**Project:** Portfolio "Core Look" Redesign (SUJAIE / DEV)  
**Branch:** `design-core-look`  
**Starting Tag:** `gate-0-start`  
**Baseline Date:** November 20, 2026  
**Status:** DRAFT FOR USER REVIEW (Gate 0)

---

## 1. Executive Architecture Summary

This plan outlines the systematic implementation of the "Core Look" phase across Gates 1 through 6, adhering strictly to the non-negotiable Prime Directives:
- **Evidence over claims:** Measured numbers, test runs, and screenshots for every gate.
- **Tokens-only styling:** Zero hardcoded colors, sizes, or timings outside tokens after Gate 1.
- **Zero layout-property animations:** Strictly `transform` and `opacity` for 60fps compositor-only motion.
- **Content preservation:** All text and filler content remain untouched.
- **Reversibility:** Clean git commits per task with designated gate tags.

---

## 2. Gate-by-Gate Task Mapping to Concrete Files

### GATE 1: Tokens, Color System, and Section Boundaries
**Goal:** Consolidate tokens into a single authoritative file, implement the 6 depth planes, remove chromatic about gradient clashes in favor of the base canvas, and establish clean boundary transitions.

| Task ID | Task Description | Concrete Files Touched | Expected Changes |
| :--- | :--- | :--- | :--- |
| **Task 1.1** | Token consolidation | `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/tokens/*` | Consolidate 4 split token files (`colors.css`, `typography.css`, `spacing.css`, `primitives.css`) into `src/styles/tokens.css` with Look Bible values. Update `@import` in `global.css`. |
| **Task 1.2** | 6 Depth Planes & Contrast | `src/styles/tokens.css`, `src/styles/global.css` | Define `--plane-0` through `--plane-5` surfaces. Ensure WCAG AAA (≥ 7:1) for body text and AA (≥ 4.5:1) for secondary text against ink beds. |
| **Task 1.3** | About Section Palette Alignment | `src/sections/About.jsx`, `src/styles/tokens.css` | Strip existing vibrant mesh gradients (magenta, cyan, orange blobs) from About; align with base canvas (`--ink-950` / `--plane-0`) until the Gate 2 atmospheric layer is introduced. |
| **Task 1.4** | Section Boundaries & Dividers | `src/sections/*.jsx`, `src/styles/global.css` | Standardize section boundary dividers with subtle 1px border (`rgba(255,255,255,0.05)`) and smooth gradient horizon masks. |
| **Task 1.5** | Typography Scale & Fluid Clamps | `src/styles/tokens.css`, `src/sections/*.jsx` | Apply exact Look Bible typography tokens: `--font-hero`, `--font-h1` through `--font-h4`, `--font-body`, `--font-mono`, `--font-serif-italic`. Set `--content-max` to agreed width. |

---

### GATE 2: Global Atmosphere, Depth, and Glass Cursor Lens
**Goal:** Establish the persistent atmospheric background, radial depth gradients, fractal noise overlay, and replace the complex DOM-mirror cursor with the performant backdrop-filter glass lens.

| Task ID | Task Description | Concrete Files Touched | Expected Changes |
| :--- | :--- | :--- | :--- |
| **Task 2.1** | Atmospheric Background System | `src/App.jsx`, `src/styles/global.css`, `src/styles/tokens.css` | Implement persistent low-opacity ambient color wells (`--ambient-navy`, `--ambient-blue`, `--ambient-cyan`) on fixed/GPU layers with SVG noise. |
| **Task 2.2** | Glass Cursor Lens Architecture | `src/components/GlobalCursorMagnifier.jsx` (or `src/components/CursorLens.jsx`) | Replace 400-line DOM mirroring with single 120px circular `backdrop-filter: blur(12px) brightness(1.08)` glass orb with luminous cyan rim (`--teal-400`) and gold accent on interactive hover. |
| **Task 2.3** | Cursor Lifecycle & Dormancy | `src/components/CursorLens.jsx` | Implement strict dormancy: 0% CPU/GPU when idle, dormant on touch devices (`pointer: coarse`), dormant on reduced-motion, pausing on tab blur. |
| **Task 2.4** | Interactive Sheen & Card Elevation | `src/sections/Projects.jsx`, `src/sections/About.jsx` | Standardize card elevation across planes 1-3 with subtle radial cursor-following sheens. |

---

### GATE 3: Navigation, Tracking, and Audio Synthesis
**Goal:** Perfect the fixed top navigation bar, ensure accurate active section detection with zero flicker, and refine tactile WebAudio SFX.

| Task ID | Task Description | Concrete Files Touched | Expected Changes |
| :--- | :--- | :--- | :--- |
| **Task 3.1** | Nav Layout & Dimensions | `src/components/Navbar.jsx`, `src/styles/tokens.css` | Enforce rigid 72px desktop / 64px mobile height via `--nav-height`. Fix `aria-current="page"` assignment on active link. |
| **Task 3.2** | Reading Focal-Plane Tracking | `src/components/Navbar.jsx` | Refine focal-plane scroll observer (140px below fixed header) with scroll-lock during link clicks (850ms lock) to eliminate bounce. |
| **Task 3.3** | Sliding Underline Motion | `src/components/Navbar.jsx` | Implement smooth GPU-accelerated sliding underline with gold glow (`--glow-gold-sm`) using GSAP/CSS transforms. |
| **Task 3.4** | Tactile WebAudio SFX Engine | `src/utils/sound.js`, `src/components/Navbar.jsx` | Verify WebAudio synthesizer frequencies (click, hover hum, chime), ensure user consent / state persistence, zero external asset requests. |
| **Task 3.5** | Mobile Drawer & Keyboard Trapping | `src/components/Navbar.jsx` | Verify focus trapping, Escape dismissal, and ARIA modal compliance for mobile navigation drawer. |

---

### GATE 4: Hero "Ignition" & About "Transmission" Signatures
**Goal:** Implement the distinct signature moments for Home and About sections per the Look Bible specifications.

| Task ID | Task Description | Concrete Files Touched | Expected Changes |
| :--- | :--- | :--- | :--- |
| **Task 4.1** | Hero "Ignition" Masked Entry | `src/sections/Hero.jsx` | Editorial display lines ("CREATIVE", "SOFTWARE", "DEVELOPER") rise smoothly from overflow masks. Gold serif italic resolves last. Cursor awakens only after hero settles. |
| **Task 4.2** | Hero Scroll Cue & Metadata | `src/sections/Hero.jsx` | Subtle animated scroll pill indicator and structured monospaced telemetry chips. |
| **Task 4.3** | About "Transmission" Wipe | `src/sections/About.jsx` | Scan-line or gradient wipe revealing the lead editorial statement. Paragraph text smoothly brightens as reading progression reaches it. |
| **Task 4.4** | About Showcase Carousel Alignment | `src/sections/About.jsx` | Retain showcase carousel content but align container elevation, tab controls, and preview mockup with depth plane tokens. |

---

### GATE 5: Work "Playback", Skills "Constellation", & Experience "Trajectory"
**Goal:** Implement the interaction signatures for Projects, Skills, and Experience sections.

| Task ID | Task Description | Concrete Files Touched | Expected Changes |
| :--- | :--- | :--- | :--- |
| **Task 5.1** | Work "Playback" Pinned Stage | `src/sections/Projects.jsx` | Terminal/mock-browser preview card with interactive CLI (`ping`, `stack`, `clear`), live metric counting, and restrained 3D card tilt. |
| **Task 5.2** | Skills "Constellation" Interaction | `src/sections/Skills.jsx` | Interactive node focus: hovering a skill card illuminates related items and dims remaining cards; segmented telemetry meters fill on scroll enter. |
| **Task 5.3** | Experience "Trajectory" Vertical Beam | `src/sections/Experience.jsx` | Vertical luminous path draws downward with scroll progress; timeline nodes ignite gold as the scroll beam intersects them. |

---

### GATE 6: Contact "Handshake", Polish, Performance, & Final Audit
**Goal:** Implement the Contact section signature, conduct exhaustive cross-browser verification, accessibility audit, and generate the final Core Look report.

| Task ID | Task Description | Concrete Files Touched | Expected Changes |
| :--- | :--- | :--- | :--- |
| **Task 6.1** | Contact "Handshake" Signature | `src/sections/Contact.jsx` | Subtle magnetic attraction of email target towards pointer; dual atmospheric spotlights converge; "✓ COPIED" confirmation toast with chime. |
| **Task 6.2** | Accessible Modal Dispatch | `src/sections/Contact.jsx` | Form modal with full keyboard trap, aria-modal, focus restoration, and clear status messages. |
| **Task 6.3** | Style Guide Route Alignment | `src/components/StyleGuide.jsx` | Update `/styleguide` route to showcase all new tokens, depth planes, typography scale, and components. |
| **Task 6.4** | Performance & Lighthouse Audit | Repo-wide | Measure 60fps scroll, zero layout thrashing, 0% CPU idle dormancy, and Lighthouse 95+ score. |
| **Task 6.5** | Final Visual & Accessibility Suite | `tests/visual.spec.js`, `tests/a11y.spec.js` | Run Playwright test suite across all 6 sections × 3 viewports + reduced-motion + axe accessibility scan. |

---

## 3. Risk Assessment & Mitigation Matrix

| Risk ID | Risk Description | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **R1** | **Animation Library Duality:** Anime.js is currently used in 3 sections (`About.jsx`, `Skills.jsx`, `Experience.jsx`). Introducing GSAP without resolving this creates bundle bloat and dual timeline conflicts. | **HIGH** | Batch decision at Gate 0: Choose either GSAP or Anime.js for all motion work. Do not run both. |
| **R2** | **Content Width Shrinkage:** The Look Bible specifies `--content-max: 1280px`, whereas the existing code uses `1600px`. Switching will visibly compress the page layout. | **MEDIUM** | Solicit user decision in Gate 0 batched questions before applying in Gate 1. |
| **R3** | **Cursor Lens Performance:** The previous DOM-mirroring cursor caused performance overhead and touch conflicts. | **HIGH** | The spec replaces DOM mirroring with a native `backdrop-filter` glass orb. Verify 0% CPU consumption during idle state and disable on touch pointers. |
| **R4** | **About Section Content Overlap:** The About showcase carousel duplicates concepts from the Work section projects. | **LOW** | Preserve content as filler per Prime Directive 3, but harmonize visual containment and tabs to avoid visual clutter. |
| **R5** | **Reduced Motion Regression:** Complex scroll-triggered animations may violate WCAG 2.2 if not properly bypassed. | **MEDIUM** | Every GSAP/Anime animation must query `useReducedMotion()` or `prefers-reduced-motion` and collapse to instant state. |

---

## 4. Batched Questions for User (Decision Required Before Gate 1)

> [!IMPORTANT]
> To comply with the Prime Directives and avoid piecemeal questioning during later gates, the following 6 questions are batched for your explicit confirmation:

1. **Animation Library Selection (Anime.js vs. GSAP):**  
   The codebase currently uses **Anime.js v4.5.0** (installed in `package.json` and used in `About.jsx`, `Skills.jsx`, `Experience.jsx`). The Look Bible specifies GSAP for timeline choreography. The directive states: *"do NOT run two libraries for the same job: ask me at Gate 0 which to keep."*  
   - **Option A (Recommended):** Standardize completely on **GSAP** (`gsap` + `@gsap/react`), migrating existing Anime.js calls to GSAP during Gates 4 & 5.  
   - **Option B:** Keep **Anime.js v4.5.0** as the single animation library and implement all signature choreography with Anime.js timelines.

2. **Token File Architecture (Single vs. Modular):**  
   The Look Bible suggests a single `src/styles/tokens.css` file. The existing codebase has tokens split into `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`, and `tokens/primitives.css`.  
   - **Option A (Recommended):** Consolidate all tokens into a single `src/styles/tokens.css` as requested by the Core Look spec.  
   - **Option B:** Keep the modular directory `src/styles/tokens/*.css` and import them into `tokens.css`.

3. **Color Primitive Values (Spec vs. Existing Sampled):**  
   Sampling from the running application revealed slight differences from the spec primitives (e.g., existing canvas `--bg-base` is `#050609`, while spec lists `--ink-950: #04070b`; existing teal is `#00BFC4`, spec is `#1fc2c9`; existing gold is `#E9A927`, spec is `#e8a823`). The spec instructs: *"if a sampled value differs from below by more than a small amount, use the sampled value and log it."*  
   - **Option A (Recommended):** Adopt the **Look Bible values** (`#04070b`, `#1fc2c9`, `#e8a823`) as part of the official Core Look visual refresh.  
   - **Option B:** Preserve the **sampled existing values** (`#050609`, `#00BFC4`, `#E9A927`) and map them to the new token names.

4. **Maximum Content Width (`--content-max`):**  
   Existing width is `1600px` (`--content-max-width`). The Look Bible specifies `--content-max: 1280px`.  
   - **Option A (Recommended):** Set to `1280px` as specified in the Look Bible for tighter editorial readability and controlled scan lines.  
   - **Option B:** Keep `1600px` for wide-screen spanning.

5. **About Section Showcase Carousel:**  
   The About section features an interactive showcase carousel (`portfolioData.showcase` with 4 projects) alongside the Work section's 3 featured projects.  
   - **Option A (Recommended):** Keep the showcase carousel intact (preserving all text/data per Prime Directive 3) and visually harmonize it with depth plane 2.  
   - **Option B:** Simplify the showcase panel to focus on the editorial story and move project highlights exclusively to the Work section.

6. **Web Font Loading Strategy:**  
   Fonts are currently loaded via Google Fonts CDN in `index.html` (`Inter`, `Manrope`, `Bodoni Moda`, `JetBrains Mono`). The Look Bible suggests: *"self-hosted/subset if feasible, font-display: swap, preload the display font only."*  
   - **Option A (Recommended):** Keep Google Fonts CDN with `preconnect` and `display=swap` for zero build complexity.  
   - **Option B:** Self-host font WOFF2 subsets in `public/fonts/` for offline/zero-dependency rendering.
