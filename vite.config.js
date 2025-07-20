import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['three'], // three.js को एक्सटर्नल डिपेंडेंसी के रूप में मार्क करें
    },
  },
  optimizeDeps: {
    include: ['three'], // three.js को ऑप्टिमाइज़ेशन में शामिल करें
  }
})