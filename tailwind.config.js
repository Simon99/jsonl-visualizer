/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'timeline': {
          'user': '#0056b3',
          'assistant': '#28a745',
          'tool-request': '#6f42c1',
          'tool-result': '#fd7e14',
          'error': '#dc3545',
          'metadata': '#495057',
        },
        'timeline-dark': {
          'user': '#4dabf7',
          'assistant': '#51cf66',
          'tool-request': '#ffd43b',
          'tool-result': '#ff922b',
          'error': '#ff6b6b',
          'metadata': '#adb5bd',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}