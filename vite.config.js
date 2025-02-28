// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind Vite plugin

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(), // Add the Tailwind Vite plugin
//   ],
//   css: {
//     postcss: './postcss.config.js', // Point to your PostCSS config
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  define: {
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
  },
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});