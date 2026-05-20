import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'obsidian-surface': '#131c31',
        'obsidian-surface-dim': '#131c31',
        'obsidian-surface-bright': '#222f4c',
        'obsidian-container': '#1e2942',
        'obsidian-accent': '#3b82f6',
        'obsidian-border': '#334155',
        'obsidian-text-dim': '#94a3b8',
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'custom': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
