/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Cấu hình này sẽ quét các tệp trong thư mục src
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#374151",
        danger: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
        info: "#2563EB",
      },
    },
  },
  plugins: [],
};
