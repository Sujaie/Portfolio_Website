import React, { useState } from 'react';
import { portfolioData } from '../data/portfolio.js';
import { sound } from '../utils/sound.js';

export default function Contact() {
  const { contact } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sentSuccess, setSentSuccess] = useState(false);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
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
      className="relative w-full min-h-[90svh] py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[var(--bg-base)] border-t border-[var(--border-subtle)] overflow-hidden flex flex-col justify-between"
    >
      {/* Background Soft Blue/Cyan Spotlight (GPU isolated) */}
      <div
        className="absolute bottom-0 right-1/4 w-[600px] md:w-[900px] h-[500px] md:h-[800px] rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--contact-spotlight-cyan) 0%, var(--contact-spotlight-blue) 45%, transparent 75%)',
          transform: 'translateZ(0)',
        }}
      />
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] w-full mx-auto my-auto py-12">
        
        {/* Label */}
        <div className="flex items-center gap-3 text-xs tracking-mono-lg font-mono font-semibold text-[var(--color-accent)] uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
          <span>INITIATE DIALOGUE</span>
        </div>

        {/* Oversized Headline */}
        <div className="space-y-1 mb-16 select-text">
          <h2 className="text-contact-display font-light leading-hero tracking-hero text-[var(--text-primary)]">
            {contact.headline}
          </h2>
          <div className="flex items-baseline gap-4 sm:gap-6 flex-wrap">
            <span className="font-serif italic font-normal text-contact-accent leading-hero-accent text-[var(--color-accent)] drop-shadow-[0_0_35px_var(--glow-gold)]">
              {contact.headlineItalic}
            </span>
            <span className="text-contact-display font-light leading-hero tracking-hero text-[var(--text-primary)]">
              {contact.headlineEnd}
            </span>
          </div>
        </div>

        {/* Contact Links & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end border-t border-[var(--border-default)] pt-12">
          
          {/* Email Direct & Quick-Copy Interaction */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-2xs tracking-mono-lg text-[var(--text-secondary)] font-mono font-semibold uppercase block">
              DIRECT CHANNEL
            </span>
            
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-primary)] hover:text-[var(--color-accent)] transition-colors break-all flex items-center gap-2 group"
              >
                <span>{contact.email}</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </a>

              {/* Quick Copy Button */}
              <button
                onClick={copyEmail}
                onMouseEnter={() => sound.playHover()}
                className="px-3 py-1.5 rounded-full border border-[var(--border-strong)] bg-white/5 hover:border-[var(--color-accent)] text-2xs font-mono tracking-mono-sm uppercase text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? '✓ COPIED' : 'COPY'}
              </button>

              {/* Send Quick Note Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsModalOpen(true);
                }}
                onMouseEnter={() => sound.playHover()}
                className="px-3 py-1.5 rounded-full border border-[var(--color-data)]/40 bg-[var(--color-data)]/10 hover:bg-[var(--color-data)]/20 text-2xs font-mono tracking-mono-sm uppercase text-[var(--color-data)] transition-colors cursor-pointer"
              >
                WRITE A NOTE ✍
              </button>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="md:col-span-6 flex flex-wrap gap-6 sm:gap-10 md:justify-end text-sm font-mono tracking-mono-md uppercase font-semibold">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              GITHUB ↗
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              LINKEDIN ↗
            </a>
            <a
              href={contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              TWITTER ↗
            </a>
          </div>

        </div>
      </div>

      {/* Interactive Modal Dialogue */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[var(--bg-raised)] border border-[var(--border-strong)] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-default)]">
              <span className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent)]">TRANSMIT DISPATCH</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-white"
              >
                ✕
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-2xl text-[var(--color-status-success)]">✓ Dispatch Logged</div>
                <p className="text-xs text-[var(--text-secondary)]">Thank you! I will respond promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-2xs font-mono text-[var(--text-secondary)] uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border-default)] text-white text-sm focus:border-[var(--color-accent)] focus:outline-none"
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-mono text-[var(--text-secondary)] uppercase mb-1">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border-default)] text-white text-sm focus:border-[var(--color-accent)] focus:outline-none"
                    placeholder="ada@computing.org"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-mono text-[var(--text-secondary)] uppercase mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border-default)] text-white text-sm focus:border-[var(--color-accent)] focus:outline-none"
                    placeholder="Inquiry or collaboration concept..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-mono uppercase text-[var(--text-secondary)] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[var(--color-accent)] text-black text-xs font-mono font-semibold uppercase hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
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
      <footer className="relative z-10 max-w-[1600px] w-full mx-auto pt-12 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs font-mono tracking-mono-md text-[var(--text-secondary)] uppercase">
        <div>
          © {new Date().getFullYear()} SUJAIE • ALL RIGHTS RESERVED
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.playHover()}
          className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <span>↑</span>
        </button>
      </footer>
    </section>
  );
}
