/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      sans: ['"Satoshi"', 'sans-serif'],
      flighter: ['"Flighter"', 'sans-serif'],
      poppins: ['"Poppins"', 'sans-serif'],
      satoshi: ['"Satoshi"', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#800080',
        secondary: '#d4bbfc',
        complementary: '#5C8D07',
        accent: '#9fa0c3',
        neutral: '#F1F2EF',
        'base-100': '#ffffff',
        info: '#90e0ef',
        success: '#5C8D07',
        warning: '#fcbf49',
        error: '#f87272',
        soft: '#FAF6F6',
        blush: '#F6E7F6',
      },
      backgroundImage: {
        'payment-background': "url('/Payment/paymentBG.svg')",
      },
    },
  },
  important: true,
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
