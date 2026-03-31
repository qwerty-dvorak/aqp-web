/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--color-bg-base)',
        'bg-card': 'var(--color-bg-card)',
        'bg-border': 'var(--color-bg-border)',
        'bg-panel': 'var(--color-bg-panel)',
        'purple-vivid': 'var(--color-purple-vivid)',
        'purple-light': 'var(--color-purple-light)',
        'orange-vivid': 'var(--color-orange-vivid)',
        'orange-bright': 'var(--color-orange-bright)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        'alert': 'var(--color-alert)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        'panel': 'var(--radius-panel)',
        'card': 'var(--radius-card)',
        'inner': 'var(--radius-inner)',
      }
    },
  },
  plugins: [],
}
