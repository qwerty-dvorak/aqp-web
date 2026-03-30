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
        bg: {
          base: '#000000',
          card: '#1A1516',
          border: '#2a2a2a',
          panel: 'rgba(122, 101, 101, 0.2)',
        },
        purple: {
          vivid: '#7500FF',
          light: '#9B59F5',
        },
        orange: {
          vivid: '#FD4B23',
          bright: '#FF3800',
        },
        text: {
          primary: '#FFFFFF',
          muted: '#AAAAAA',
        },
        alert: '#E63000',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        'panel': '50px',
        'card': '20px',
        'inner': '35px',
      },
    },
  },
  plugins: [],
}
