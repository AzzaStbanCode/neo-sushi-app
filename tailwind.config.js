// tailwind.config.js - COPIAR Y REEMPLAZAR
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // ESTA SECCIÓN ES LA MÁS IMPORTANTE PARA TU PROYECTO
  safelist: [
    { pattern: /bg-(cyan|fuchsia|green|yellow|red|slate)-500\/(10|20|30)/ },
    { pattern: /border-(cyan|fuchsia|green|yellow|red|slate)-500\/(20|30|50)/ },
    { pattern: /text-(cyan|fuchsia|green|yellow|red|slate)-(300|400|500)/ },
    "text-green-400", // Asegurar colores específicos
    "bg-green-900/30",
    "border-green-500",
    "text-cyan-400",
    "bg-cyan-900/30",
    "border-cyan-500",
    "text-fuchsia-400",
    "bg-fuchsia-900/30",
    "border-fuchsia-500",
  ],
  plugins: [],
};
