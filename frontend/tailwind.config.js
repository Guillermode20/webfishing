module.exports = {
  content: [
    './public/**/*.{html,js,jsx,ts,tsx}',  // Scans these file types in the public directory
    './src/**/*.{js,jsx,ts,tsx}',          // Scans these file types in the src directory
    './index.html',                        // Or any other template file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}