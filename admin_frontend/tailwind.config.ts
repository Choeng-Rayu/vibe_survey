import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2', // Soft cream
        surface: '#F2EDE5', // Warm gray
        primary: '#7C9E8A', // Sage green
        'primary-hover': '#6A8C78', // Sage hover
        text: '#1C1C1A', // Near-black
        muted: '#6B6860', // Muted tone
        accent: '#C4956A', // Warm gold
      },
      borderRadius: {
        card: '16px', // 16px radius for cards
        pill: '999px', // Pill buttons
      },
    },
  },
  plugins: [],
};

export default config;
