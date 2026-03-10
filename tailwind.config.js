/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 안의 모든 리액트 파일에 적용하겠다는 뜻!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}