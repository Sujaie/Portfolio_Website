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
      className="relative w-full min-h-[90svh] py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#050609] border-t border-white/5 overflow-hidden flex flex-col justify-between"
    >
      {/* Background Soft Blue/Cyan Spotlight (GPU isolated) */}
      <div
        className="absolute bottom-0 right-1/4 w-[600px] md:w-[900px] h-[500px] md:h-[800px] rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00BFC4 0%, #1769B5 45%, transparent 75%)',
          transform: 'translateZ(0)',
        }}
      />
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] w-full mx-auto my-auto py-12">
        
        {/* Label */}
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] font-mono font-semibold text-[#E9A927] uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E9A927] shadow-[0_0_8px_#E9A927]" />
          <span>INITIATE DIALOGUE</span>
        </div>

        {/* Oversized Headline */}
        <div className="space-y-1 mb-16 select-text">
          <h2 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-light leading-[0.9] tracking-[-0.03em] text-[#F4F3F0]">
            {contact.headline}
          </h2>
          <div className="flex items-baseline gap-4 sm:gap-6 flex-wrap">
            <span className="font-serif italic font-normal text-[13vw] sm:text-[11vw] md:text-[8.8vw] leading-[0.9] text-[#E9A927] drop-shadow-[0_0_35px_rgba(233,169,39,0.3)]">
              {contact.headlineItalic}
            </span>
            <span className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-light leading-[0.9] tracking-[-0.03em] text-[#F4F3F0]">
              {contact.headlineEnd}
            </span>
          </div>
        </div>

        {/* Contact Links & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end border-t border-white/10 pt-12">
          
          {/* Email Direct & Quick-Copy Interaction */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-[10px] tracking-[0.25em] text-[#A8ABB2] font-mono font-semibold uppercase block">
              DIRECT CHANNEL
            </span>
            
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-[#F4F3F0] hover:text-[#E9A927] transition-colors break-all flex items-center gap-2 group"
              >
                <span>{contact.email}</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </a>

              {/* Quick Copy Button */}
              <button
                onClick={copyEmail}
                onMouseEnter={() => sound.playHover()}
                className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-[#E9A927] text-[10px] font-mono tracking-widest uppercase text-[#A8ABB2] hover:text-white transition-colors cursor-pointer"
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
                className="px-3 py-1.5 rounded-full border border-[#00BFC4]/40 bg-[#00BFC4]/10 hover:bg-[#00BFC4]/20 text-[10px] font-mono tracking-widest uppercase text-[#00BFC4] transition-colors cursor-pointer"
              >
                WRITE A NOTE ✍
              </button>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="md:col-span-6 flex flex-wrap gap-6 sm:gap-10 md:justify-end text-xs font-mono tracking-[0.2em] uppercase font-semibold">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[#A8ABB2] hover:text-white transition-colors"
            >
              GITHUB ↗
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[#A8ABB2] hover:text-white transition-colors"
            >
              LINKEDIN ↗
            </a>
            <a
              href={contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[#A8ABB2] hover:text-white transition-colors"
            >
              TWITTER ↗
            </a>
          </div>

        </div>
      </div>

      {/* Interactive Modal Dialogue */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#080D14] border border-white/15 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E9A927]">TRANSMIT DISPATCH</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[#A8ABB2] hover:text-white"
              >
                ✕
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-2xl text-emerald-400">✓ Dispatch Logged</div>
                <p className="text-xs text-[#A8ABB2]">Thank you! I will respond promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#A8ABB2] uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#E9A927] focus:outline-none"
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A8ABB2] uppercase mb-1">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#E9A927] focus:outline-none"
                    placeholder="ada@computing.org"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A8ABB2] uppercase mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#E9A927] focus:outline-none"
                    placeholder="Inquiry or collaboration concept..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-mono uppercase text-[#A8ABB2] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#E9A927] text-black text-xs font-mono font-semibold uppercase hover:bg-[#ffd566] transition-colors cursor-pointer"
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
      <footer className="relative z-10 max-w-[1600px] w-full mx-auto pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-[0.2em] text-[#A8ABB2] uppercase">
        <div>
          © {new Date().getFullYear()} SUJAIE • ALL RIGHTS RESERVED
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={() => sound.playHover()}
          className="hover:text-[#E9A927] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <span>↑</span>
        </button>
      </footer>
    </section>
  );
}
