/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'vvva-orange': '#FF5500',
        'vvva-orange-dark': '#CC4400',
        'vvva-orange-light': '#FF8855',
        'vvva-black': '#1A1A1A',
        'vvva-warm-white': '#F5F3EF',
        'vvva-sand': '#E8E4DC',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        chip: '4px',
        btn: '8px',
        card: '12px',
        pill: '20px',
      },
    },
  },
  plugins: [],
};
