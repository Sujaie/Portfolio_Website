# Complete Design System Audit

**Document Date:** November 20, 2026  
**Phase:** Foundations (Task 1 — Design System Audit)  
**Status:** Audit Completed — No Visual Changes Made  
**Scope:** Full codebase audit covering colors, typography, spacing, visual primitives, and token recommendations.

---

## 1. Executive Summary

This audit catalogs every color value, font declaration, spacing rule, border radius, shadow, transition, and layout primitive currently implemented across the portfolio codebase. The portfolio exhibits a cohesive aesthetic inspired by high-end editorial magazines combined with retro-futuristic dark mode developer consoles.

The source of truth reflects the active implementation across:
- `index.html`
- `src/styles/global.css`
- `src/components/Navbar.jsx`
- `src/components/GlobalCursorMagnifier.jsx`
- `src/sections/Hero.jsx`
- `src/sections/About.jsx`
- `src/sections/Projects.jsx`
- `src/sections/Skills.jsx`
- `src/sections/Experience.jsx`
- `src/sections/Contact.jsx`
- `src/data/portfolio.js`
- `src/utils/sound.js`

---

## 2. Color Inventory

### 2.1 Backgrounds & Surfaces

| Color Value | Semantic Role | Existing Locations | Token Recommendation |
| :--- | :--- | :--- | :--- |
| `#050609` | **Canvas / Primary Background** | `body`, `global.css`, `Navbar`, all section tags (`#home`, `#about`, `#work`, `#skills`, `#experience`, `#contact`), scrollbar track | `var(--color-bg-primary)` |
| `#080D14` | **Elevated Surface (Card / Panel)** | About showcase panel (`/90`), Skills cards (`/70`), Contact modal, Mobile menu (`/98`), Hero gradient node | `var(--color-surface-elevated)` |
| `#05080e` | **Deep Nested Console Surface** | Projects telemetry & architecture display container (`/95`) | `var(--color-surface-nested)` |
| `#0c1421` → `#060a10` | **Preview Gradient Surface** | About product mock UI container gradient | `var(--gradient-surface-preview)` |
| `#0a121f` → `#060a10` | **Tilt Card Surface Gradient** | Projects 3D tilt card background gradient | `var(--gradient-surface-card)` |
| `#071A2B` | **Deep Navy Atmospheric Node** | Hero ambient radial gradient, Projects background ambient spotlight | `var(--color-navy-ambient)` |
| `black/40` | **Subtle Control Fill** | Navbar mobile buttons, Projects view-mode switcher pill container | `var(--color-control-bg-muted)` |
| `black/50` | **Badge Dark Fill** | About tech stack tags | `var(--color-badge-bg-dark)` |
| `black/80` / `black/90` | **Modal Overlay / Terminal Bed** | Contact modal backdrop (`black/80`), Projects terminal container (`black/90`) | `var(--color-overlay-backdrop)` / `var(--color-terminal-bg)` |
| `#141f2d` / `#1e3247` | **Scrollbar Thumb & Hover** | `global.css` custom scrollbar thumb styling | `var(--color-scrollbar-thumb)` |

### 2.2 Text & Typography Colors

| Color Value | Semantic Role | Existing Locations | Token Recommendation |
| :--- | :--- | :--- | :--- |
| `#F4F3F0` | **Primary Text (Warm Bone White)** | `body`, Hero headlines, Section titles, Active nav link, Monogram, Card titles, Tech pills, Direct contact email | `var(--color-text-primary)` |
| `#A8ABB2` | **Secondary / Muted Slate Gray** | Inactive nav links, Kicker descriptions, Metadata labels, Body paragraphs, Terminal labels, Inactive tab buttons, Explore link, Footer | `var(--color-text-secondary)` |
| `#FFFFFF` (`white`) | **High-Contrast Focus / Hover** | Nav link hover, Modal form inputs, Button hover states, About showcase title, Terminal prompt commands | `var(--color-text-emphasis)` |
| `white/10` to `white/70` | **Layered Opacity Typography** | Skills count (`white/60`), Inactive dots, Secondary status indicators | Consolidate to standard opacity scale |

### 2.3 Accent & Luminous Highlight Colors

| Color Value | Semantic Role | Existing Locations | Token Recommendation |
| :--- | :--- | :--- | :--- |
| `#E9A927` | **Warm Architectural Gold** | Italic serif display accents, Section status dots, Active underline indicator, Active category pills, Lens hover border, Submit button | `var(--color-accent-gold)` |
| `#ffd566` | **Gold Hover State** | Contact transmit button hover (`hover:bg-[#ffd566]`) | `var(--color-accent-gold-hover)` |
| `#F5BE37` | **Luminous Yellow Glow** | `global.css` glow token, About ambient radial mesh gradient | `var(--color-glow-yellow)` |
| `#00BFC4` | **Cyan / Electric Teal** | Hero kicker dot, Work & Experience badges, Skills category headers, Lens default border, Telemetry throughput & architecture chips, Note button | `var(--color-accent-cyan)` |
| `#1769B5` | **Deep Blue Glow** | Hero ambient atmosphere, Projects ambient spotlight, About sparkline gradient endpoint, Contact ambient spotlight | `var(--color-glow-blue)` |
| `#C90070` | **Vibrant Magenta Glow** | `global.css` glow token, About upper-left & bottom-right ambient mesh gradients | `var(--color-glow-magenta)` |
| `#FF6543` | **Warm Orange Glow** | `global.css` glow token, About bottom-right ambient mesh gradient | `var(--color-glow-orange)` |
| `#7c3aed` | **Deep Purple Glow** | About ambient gradient blending with magenta | `var(--color-glow-purple)` |
| `#0f766e` | **Deep Teal Glow** | About ambient gradient blending with cyan | `var(--color-glow-teal)` |

### 2.4 Status & Terminal System Colors

| Color Value | Semantic Role | Existing Locations | Token Recommendation |
| :--- | :--- | :--- | :--- |
| `emerald-400` / `#34d399` | **Success / Online Status** | Navbar SFX indicator dot, About connected status dot & text, Projects latency & PostgreSQL chip, Contact dispatch success | `var(--color-status-success)` |
| `red-500/70` | **Window Control (Close)** | About mock browser header, Projects window title bar | `var(--color-window-close)` |
| `yellow-500/70` | **Window Control (Minimize)** | About mock browser header, Projects window title bar | `var(--color-window-min)` |
| `green-500/70` | **Window Control (Expand)** | About mock browser header, Projects window title bar | `var(--color-window-max)` |

### 2.5 Borders & Dividers

| Color Value | Usage | Frequency / Location | Token Recommendation |
| :--- | :--- | :--- | :--- |
| `border-white/5` | Sub-card borders, inner grid borders, divider lines | Section top dividers, timeline inner lines, skill cards, telemetry cells | `var(--border-subtle)` |
| `border-white/10` | Primary element boundaries, container cards, nav border-b | Navbar, Showcase card, 3D tilt card, Hero metadata border, Modal inputs | `var(--border-default)` |
| `border-white/15` | Interactive hover borders, elevated card borders | Skills card hover, Contact modal border, Copy button border | `var(--border-elevated)` |
| `border-white/20` | Explore scroll indicator pill | Hero explore indicator | `var(--border-highlight)` |
| `border-[#E9A927]/60` | Accent gold interactive border | Audio toggle button hover, Explore scroll pill hover, Lens hover ring | `var(--border-gold-accent)` |
| `border-[#00BFC4]/40` | Cyan highlight interactive border | Projects 3D card hover, Architecture chip, Write a note button | `var(--border-cyan-accent)` |

---

## 3. Typography Inventory

### 3.1 Font Families

```css
/* Configured in @theme inside src/styles/global.css */
--font-sans: "Inter", "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-serif: "Bodoni Moda", "Cormorant Garamond", "Playfair Display", Georgia, serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

### 3.2 Typographic Hierarchy & Scale

#### A. Giant Display Headlines (Editorial Asymmetrical Impact)
- **Primary Hero Display:**
  - Font: `font-sans`
  - Weight: `font-light` (300)
  - Size: `text-[14vw] sm:text-[12vw] md:text-[9.5vw] lg:text-[8.8vw]`
  - Line Height: `leading-[0.88]`
  - Letter Spacing: `tracking-[-0.035em]`
  - Color: `#F4F3F0`
- **Hero Italic Serif Accent:**
  - Font: `font-serif`
  - Style: `italic`
  - Weight: `font-normal` (400)
  - Size: `text-[15vw] sm:text-[13vw] md:text-[10.5vw] lg:text-[9.8vw]`
  - Line Height: `leading-[0.9]`
  - Accent Color: `#E9A927` with drop shadow `drop-shadow-[0_0_45px_rgba(233,169,39,0.35)]`
- **Contact Display Headline:**
  - Font: `font-sans` (`text-[12vw] sm:text-[10vw] md:text-[8vw] font-light leading-[0.9] tracking-[-0.03em]`)
  - Accent Italic: `font-serif italic text-[13vw] sm:text-[11vw] md:text-[8.8vw] leading-[0.9] text-[#E9A927]`

#### B. Section Headings
- **Standard Section Titles (Work, Skills, Experience):**
  - Font: `font-sans`
  - Weight: `font-light` (300)
  - Size: `text-4xl sm:text-6xl`
  - Letter Spacing: `tracking-tight`
  - Mixed with: `font-serif italic text-[#E9A927]`
- **About Lead Statement:**
  - Size: `text-3xl sm:text-4xl md:text-5xl`
  - Line Height: `leading-[1.18]`
  - Tracking: `tracking-tight`

#### C. Card & Component Titles
- **Project Card Title:** `text-2xl sm:text-4xl font-light text-[#F4F3F0]`
- **About Showcase Title:** `text-2xl font-light text-white`
- **Timeline Experience Role:** `text-xl sm:text-2xl font-light text-[#F4F3F0]`
- **Skills Category Title:** `text-xs font-mono tracking-[0.2em] text-[#00BFC4] uppercase`

#### D. Body Copy & Editorial Paragraphs
- **Primary Body:** `text-sm md:text-base text-[#A8ABB2] font-light leading-relaxed`
- **Secondary / Helper Copy:** `text-xs sm:text-sm text-[#A8ABB2] font-light leading-relaxed`

#### E. Monospace Technical Labels & Navigation
- **Navigation Links:** `text-[11px] font-mono tracking-[0.2em] font-medium`
- **Brand Monogram:** `text-xs font-mono tracking-[0.25em] uppercase font-semibold`
- **Section Kickers & Badges:** `text-[11px] font-mono tracking-[0.25em] font-semibold uppercase`
- **Tech Stack & Category Chips:** `text-[10px] font-mono tracking-wider uppercase`
- **Audio Control Pill:** `text-[10px] font-mono tracking-widest uppercase`
- **Terminal CLI Output:** `text-xs font-mono leading-normal`

---

## 4. Spacing Inventory

### 4.1 Global Section & Container Geometry

| Primitive | Actual Value | Usage Across Codebase | Consistency Rating |
| :--- | :--- | :--- | :--- |
| **Max Content Bound** | `max-w-[1600px] w-full mx-auto` | Applied identically across Navbar, Hero, About, Projects, Skills, Experience, Contact, Footer | **100% Unified** |
| **Horizontal Page Gutters** | `px-6 md:px-12 lg:px-16` | Applied identically across all section wrappers and fixed navbar | **100% Unified** |
| **Vertical Section Padding** | `py-28 md:py-36` | About, Projects, Skills, Experience, Contact | **100% Unified** |
| **Hero Vertical Padding** | `pt-28 md:pt-36 pb-10` | Hero section (adjusted for full viewport height) | **Intentional** |

### 4.2 Component & Layout Grid Gaps

| Layout Region | Gap Classes | Usage |
| :--- | :--- | :--- |
| **Section Header to Content** | `mb-20` | Projects, Skills, Experience (unified 80px space) |
| **About 2-Column Grid** | `gap-12 lg:gap-16` | Left editorial intro vs. right showcase panel |
| **Projects 2-Column Grid** | `gap-10 lg:gap-16` | 3D tilt card preview vs. project editorial details |
| **Projects Vertical Stack** | `space-y-24 md:space-y-36` | Separation between sequential feature cards |
| **Skills 3-Column Grid** | `gap-8` | Grid gap between technical domain cards |
| **Experience Timeline Row** | `gap-6 md:gap-12` | Grid gap between period, role, and description |
| **Contact Bottom Grid** | `gap-10` | Grid gap between direct email channel and social links |

### 4.3 Inner Component Padding

- **Large Showcase Panel (About):** `p-6 sm:p-8 md:p-10`
- **Project 3D Tilt Card (Work):** `p-6 md:p-8`
- **Skill Domain Card (Skills):** `p-6 md:p-8`
- **Timeline Row (Experience):** `py-10 md:py-14 px-4 -mx-4`
- **Interactive Modal (Contact):** `p-6 sm:p-8`
- **Telemetry Inner Box:** `p-4` or `p-6`

---

## 5. Visual Primitives Inventory

### 5.1 Border Radii
- `rounded-full` ($9999\text{px}$): Status indicator dots, active underline rounded caps, buttons (`EXPLORE`, audio toggle, copy button), category pills, optical magnifier lens shell.
- `rounded-2xl` ($16\text{px}$): Primary content containers (About showcase panel, Projects 3D card, Skills cards, Contact modal).
- `rounded-xl` ($12\text{px}$): Secondary sub-containers (Product preview window, Telemetry module, Timeline hover bed, Mobile menu dropdown).
- `rounded-lg` ($8\text{px}$): Interactive inputs, telemetry metric cells, architecture chips.
- `rounded` ($4\text{px}$): Tech stack tags, command chips, mobile toggle buttons.
- `rounded-t-sm` ($2\text{px}$): Bottom telemetry sparklines.

### 5.2 Shadows & Optical Glows
- **Luminous Gold Glows:**
  - `shadow-[0_0_8px_#E9A927]` (Active nav indicator dot, active section underline)
  - `shadow-[0_0_14px_rgba(233,169,39,0.45)]` (Active category pill)
  - `drop-shadow-[0_0_45px_rgba(233,169,39,0.35)]` (Hero italic serif accent)
  - `drop-shadow-[0_0_35px_rgba(233,169,39,0.3)]` (Contact italic serif accent)
  - `shadow-[0_0_24px_rgba(233,169,39,0.45),inset_0_0_12px_rgba(255,255,255,0.2)]` (Magnifier lens ring on interactive hover)
- **Electric Cyan Glows:**
  - `shadow-[0_0_8px_#00BFC4]` (Section kicker indicator dots)
  - `shadow-[0_0_10px_#00BFC4]` (Hero intro pulsing dot)
  - `shadow-[0_0_20px_rgba(0,191,196,0.32),inset_0_0_12px_rgba(255,255,255,0.12)]` (Magnifier lens ring in idle state)
  - `hover:shadow-[0_25px_60px_rgba(0,191,196,0.15)]` (3D tilt project card hover elevation)
- **Deep Elevation Shadows:**
  - `shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)]` (About showcase panel elevation)
  - `shadow-2xl` (Contact modal, Mobile navigation menu)

### 5.3 Z-Index Stacking Hierarchy

```
z-[9999]  ── GlobalCursorMagnifier (Physical glass lens shell)
z-[9990]  ── GlobalCursorMagnifier (Clipped optical mirror layer)
z-[1000]  ── Navbar (#main-navbar)
z-50      ── Magnifier Header Mirror snapshot / Contact Modal Dialog
z-20      ── Hero content container
z-10      ── Section content wrapper / Atmospheric background noise layer
z-0       ── Canvas background (#050609)
```

### 5.4 Motion & Transitions

- **CSS Transitions:**
  - Colors / Borders: `transition-colors duration-200`
  - Opacity: `transition-opacity duration-200`
  - Transform: `transition-transform duration-150 ease-out` (3D tilt recovery)
  - Complex elements: `transition-all duration-300`
- **Anime.js Programmatic Animations:**
  - Showcase slide change: `duration: 180` (`inQuad`) out, `duration: 260` (`outCubic`) in.
  - Skills stagger reveal: `delay: (el, i) => i * 80`, `duration: 700`, `ease: 'outQuad'`.
  - Experience stagger reveal: `delay: (el, i) => i * 120`, `duration: 750`, `ease: 'outQuad'`.
  - Magnifier entrance/exit: `duration: 200` (`outCubic`) in, `duration: 180` (`inQuad`) out.

---

## 6. Duplicate & Near-Duplicate Values Identified

1. **Section Kickers & Dot Sizes:**
   - Hero intro dot: `w-2 h-2` (`bg-[#00BFC4]`)
   - About badge dot: `w-1.5 h-1.5` (`bg-[#E9A927]`)
   - Work kicker dot: `w-1.5 h-1.5` (`bg-[#00BFC4]`)
   - Skills kicker dot: `w-1.5 h-1.5` (`bg-[#E9A927]`)
   - Experience kicker dot: `w-1.5 h-1.5` (`bg-[#00BFC4]`)
   - Contact kicker dot: `w-1.5 h-1.5` (`bg-[#E9A927]`)
   - *Recommendation:* Standardize kicker dot to `w-1.5 h-1.5` across all sections for visual harmony.

2. **Tech Stack Tags / Pills:**
   - About showcase tags: `px-2.5 py-1 rounded bg-black/50 text-[#F4F3F0] border border-white/10 text-[10px]`
   - Work project tags: `px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F4F3F0] text-[10px]`
   - About highlights: `px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F4F3F0] text-[11px]`
   - *Recommendation:* Unify into a single `pill` token pattern (`px-3 py-1 rounded-full text-[10px] font-mono border border-white/10 bg-white/5`).

3. **Background Card Hexes:**
   - About uses `bg-[#080D14]/90`
   - Skills uses `bg-[#080D14]/70`
   - Contact modal uses `bg-[#080D14]`
   - Projects telemetry uses `bg-[#05080e]/95`
   - *Recommendation:* Retain `#080D14` as the canonical elevated card surface token, utilizing standard alpha modifiers (`/90`, `/70`, etc.).

---

## 7. Recommendations for Reusable Design Tokens

In the subsequent Foundations phase, formalize the audited values into clean Tailwind CSS v4 design tokens in `global.css`:

```css
@theme {
  /* Colors - Core Canvas & Surfaces */
  --color-canvas: #050609;
  --color-surface-elevated: #080D14;
  --color-surface-nested: #05080e;
  --color-surface-navy: #071A2B;

  /* Colors - Typography */
  --color-text-primary: #F4F3F0;
  --color-text-secondary: #A8ABB2;
  --color-text-emphasis: #FFFFFF;

  /* Colors - Accents */
  --color-accent-gold: #E9A927;
  --color-accent-gold-hover: #ffd566;
  --color-accent-cyan: #00BFC4;
  --color-accent-blue: #1769B5;

  /* Colors - Atmosphere Glows */
  --color-glow-magenta: #C90070;
  --color-glow-orange: #FF6543;
  --color-glow-yellow: #F5BE37;

  /* Colors - Semantic */
  --color-status-success: #34d399;

  /* Typography */
  --font-sans: "Inter", "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serif: "Bodoni Moda", "Cormorant Garamond", "Playfair Display", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Geometry & Layout Bounds */
  --container-max-width: 1600px;
}
```

---

## 8. Audit Verification & Acceptance

- [x] **Full Codebase Audited:** Every CSS rule, component JSX, inline style, SVG, and utility audited.
- [x] **Real Values Documented:** No imagined or approximated values; exact hexes, font classes, and paddings recorded.
- [x] **Duplicates Cataloged:** Small discrepancies in pill radii, card opacities, and kicker dots highlighted for tokenization.
- [x] **Zero Visual Changes:** No source code was modified during this audit phase. The running portfolio remains 100% untouched.
