import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolio.js';
import { sound } from '../utils/sound.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

export default function Contact() {
  const { contact } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sentSuccess, setSentSuccess] = useState(false);

  const emailMagneticRef = useRef(null);
  const modalRef = useRef(null);
  const triggerButtonRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Accessibility: Focus trap & focus restoration for modal dialogue
  useEffect(() => {
    if (!isModalOpen) return;

    const previousFocus = document.activeElement;
    const modalElement = modalRef.current;

    // Focus first interactive element in modal
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalElement?.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    // Focus first input field or first interactive element in modal
    const inputElement = modalElement?.querySelector('input, textarea, select');
    if (inputElement) {
      inputElement.focus();
    } else if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    };
  }, [isModalOpen]);

  // Magnetic attraction physics on email target
  const handleEmailMouseMove = (e) => {
    if (prefersReduced || !emailMagneticRef.current) return;
    const rect = emailMagneticRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;

    // Cap magnetic pull to max 12px
    const clampedX = Math.max(-12, Math.min(12, deltaX));
    const clampedY = Math.max(-12, Math.min(12, deltaY));

    gsap.to(emailMagneticRef.current, {
      x: clampedX,
      y: clampedY,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleEmailMouseLeave = () => {
    if (!emailMagneticRef.current) return;
    gsap.to(emailMagneticRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(contact.email);
    }
    sound.playChime();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playChime();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-[var(--section-py)] px-[var(--page-gutter)] bg-transparent border-t border-[var(--border-subtle)] overflow-hidden"
    >
      <div className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto">
        
        {/* Label */}
        <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-accent)] uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-gold-sm)]" />
          <span>INITIATE DIALOGUE & CONVERGENCE</span>
        </div>

        {/* Oversized Converging Headline */}
        <div className="space-y-1 mb-16 select-text">
          <h2 className="text-contact-display font-light leading-hero tracking-hero text-[var(--text-primary)]">
            {contact.headline}
          </h2>
          <div className="flex items-baseline gap-4 sm:gap-6 flex-wrap">
            <span className="font-serif italic font-normal text-contact-accent leading-hero-accent text-[var(--color-accent)] drop-shadow-[var(--glow-gold-lg)]">
              {contact.headlineItalic}
            </span>
            <span className="text-contact-display font-light leading-hero tracking-hero text-[var(--text-primary)]">
              {contact.headlineEnd}
            </span>
          </div>
        </div>

        {/* Contact Links & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end border-t border-[var(--border-default)] pt-12">
          
          {/* Email Direct Channel with Magnetic Pull */}
          <div className="md:col-span-7 space-y-4">
            <span className="text-2xs tracking-mono-lg text-[var(--text-secondary)] font-mono font-semibold uppercase block">
              DIRECT CHANNEL
            </span>
            
            <div className="flex flex-wrap items-center gap-4">
              <a
                ref={emailMagneticRef}
                href={`mailto:${contact.email}`}
                onMouseMove={handleEmailMouseMove}
                onMouseLeave={handleEmailMouseLeave}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)] break-all flex items-center gap-2 group will-change-transform"
                aria-label={`Send direct email to ${contact.email}`}
              >
                <span>{contact.email}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-[var(--dur-fast)] text-[var(--color-accent)]">↗</span>
              </a>

              {/* Quick Copy Button */}
              <button
                onClick={copyEmail}
                onMouseEnter={() => sound.playHover()}
                aria-label="Copy email address to clipboard"
                className={`px-3 py-1.5 rounded-full border text-2xs font-mono tracking-mono-sm uppercase transition-all duration-[var(--dur-base)] cursor-pointer ${
                  copied
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-black font-semibold shadow-[var(--glow-gold-sm)]'
                    : 'border-[var(--border-strong)] bg-white/5 hover:border-[var(--color-accent)] text-[var(--text-secondary)] hover:text-white'
                }`}
                title="Copy email to clipboard"
              >
                {copied ? '✓ COPIED' : 'COPY'}
              </button>

              {/* Send Quick Note Modal Trigger */}
              <button
                ref={triggerButtonRef}
                onClick={() => {
                  sound.playClick();
                  setIsModalOpen(true);
                }}
                onMouseEnter={() => sound.playHover()}
                aria-label="Open dispatch message form"
                className="px-3 py-1.5 rounded-full border border-[var(--color-data)]/40 bg-[var(--color-data)]/10 hover:bg-[var(--color-data)]/20 text-2xs font-mono tracking-mono-sm uppercase text-[var(--color-data)] transition-colors duration-[var(--dur-base)] cursor-pointer"
              >
                WRITE A NOTE ✍
              </button>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="md:col-span-5 flex flex-wrap gap-6 sm:gap-10 md:justify-end text-sm font-mono tracking-mono-md uppercase font-semibold">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in new tab)"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)]"
            >
              GITHUB ↗
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)]"
            >
              LINKEDIN ↗
            </a>
            <a
              href={contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter profile (opens in new tab)"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)]"
            >
              TWITTER ↗
            </a>
          </div>

        </div>
      </div>

      {/* Interactive Modal Dialogue with Focus Trapping & Accessibility */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--bg-raised)] border border-[var(--border-strong)] shadow-[var(--shadow-modal)] space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)]">
              <h3 id="contact-modal-title" className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                TRANSMIT DISPATCH
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                className="text-xs text-[var(--text-secondary)] hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-2xl text-[var(--color-status-success)] font-mono">✓ Dispatch Logged</div>
                <p className="text-xs text-[var(--text-secondary)]">Transmission received. I will respond promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-2xs font-mono text-[var(--text-secondary)] uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-white/5 border border-[var(--border-default)] text-white text-sm focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-2xs font-mono text-[var(--text-secondary)] uppercase mb-1">
                    Email Coordinates
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-white/5 border border-[var(--border-default)] text-white text-sm focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    placeholder="ada@computing.org"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-2xs font-mono text-[var(--text-secondary)] uppercase mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-white/5 border border-[var(--border-default)] text-white text-sm focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    placeholder="Inquiry or collaboration concept..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-[var(--radius-md)] text-xs font-mono uppercase text-[var(--text-secondary)] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-black text-xs font-mono font-semibold uppercase hover:bg-[var(--color-accent-hover)] transition-colors duration-[var(--dur-base)] cursor-pointer"
                  >
                    Transmit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Row */}
      <footer className="relative z-10 max-w-[var(--content-max-width)] w-full mx-auto pt-12 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs font-mono tracking-mono-md text-[var(--text-secondary)] uppercase">
        <div>
          © {new Date().getFullYear()} SUJAIE • ALL RIGHTS RESERVED
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.playHover()}
          className="hover:text-[var(--color-accent)] transition-colors duration-[var(--dur-base)] flex items-center gap-2 cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <span aria-hidden="true">↑</span>
        </button>
      </footer>
    </section>
  );
}
