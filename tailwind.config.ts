import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B5ED7', // Blue
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#0B5ED7',
          600: '#0056B3',
          700: '#004494',
          800: '#003474',
          900: '#002454',
        },
        secondary: {
          DEFAULT: '#00A896', // Teal
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00A896',
          600: '#00867B',
          700: '#00665F',
          800: '#004642',
          900: '#002625',
        },
        accent: {
          DEFAULT: '#FFB703', // Gold
          50: '#FFF9E6',
          100: '#FFF3C4',
          200: '#FFECA0',
          300: '#FFE47C',
          400: '#FFDD57',
          500: '#FFB703',
          600: '#FF9A00',
          700: '#FF7D00',
          800: '#FF6000',
          900: '#FF4300',
        },
        dark: {
          DEFAULT: '#102A43',
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#102A43',
        },
      },
    },
  },
  plugins: [],
};

export default config;
