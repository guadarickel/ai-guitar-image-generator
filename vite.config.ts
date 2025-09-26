import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace this with the name of your GitHub repository
  base: '/ai-guitar-image-generator/',
  define: {
    // This makes the API key available in the app code as process.env.API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
  }
});
