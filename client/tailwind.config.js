/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1890ff',
          dark: '#096dd9',
        },
        success: {
          DEFAULT: '#52c41a',
          dark: '#389e0d',
        },
        warning: {
          DEFAULT: '#faad14',
          dark: '#d48806',
        },
        error: {
          DEFAULT: '#f5222d',
          dark: '#cf1322',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 禁用 Tailwind 的基础样式重置，因为我们使用 antd
  },
}
