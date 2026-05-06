import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        cream: '#FAF7F2',
        surface: '#F2EDE5',

        sage: {
          50: '#F0F4F2',
          100: '#E0E8E4',
          200: '#C1D1CC',
          300: '#A3BAB3',
          400: '#8AA99E',
          500: '#7C9E8A',
          600: '#6A8C78',
        },

        text: {
          primary: '#1C1C1A',
          muted: '#6B6860',
        },

        accent: '#C4956A',
      },

      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
      },

      borderRadius: {
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