import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Or your frontend port
    proxy: {
      '/api': { // Make sure this path prefix matches your API calls
        target: 'http://localhost:5001', // MAKE SURE this is the correct port your backend IS running on
        changeOrigin: true,
        // secure: false, // Usually not needed for http localhost
      }
    }
  }
})
