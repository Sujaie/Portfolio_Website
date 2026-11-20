/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-bg': '#0a0a0f',
        'accent-gold': '#ffd700',
        'gradient-blue': '#1e3a8a',
        'gradient-cyan': '#06b6d4',
        'gradient-teal': '#0f766e',
        'gradient-violet': '#7c3aed',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 20% 30%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
