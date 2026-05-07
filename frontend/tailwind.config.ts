import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        paper: '#f8fafc',
        accent: '#f97316',
        accentSoft: '#fdba74',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(249, 115, 22, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
