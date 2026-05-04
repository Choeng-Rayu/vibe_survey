import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        surface: '#F2EDE5',
        'sage-50': '#F0F4F2',
        'sage-100': '#E0E8E4',
        'sage-200': '#C1D1CC',
        'sage-300': '#A3BAB3',
        'sage-400': '#8AA99E',
        'sage-500': '#7C9E8A',
        'sage-600': '#6A8C78',
        'text-primary': '#1C1C1A',
        'text-muted': '#6B6860',
        'accent': '#C4956A',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      spacing: {
        '120': '120px',
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
};

export default config;
