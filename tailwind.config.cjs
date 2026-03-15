/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        espresso:     '#1c0f0a',
        'dark-roast': '#2e1a12',
        'medium-roast':'#5c3317',
        sienna:       '#8b4513',
        caramel:      '#c07840',
        amber:        '#d4922a',
        latte:        '#d4a878',
        oat:          '#e8d5ba',
        cream:        '#f5ede0',
        fog:          '#f9f6f1',
        ink:          '#1a1410',
        charcoal:     '#3d2b1f',
        muted:        '#8a6d5c',
        sage:         '#6b7c72',
        slate:        '#5a6470',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        code:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
