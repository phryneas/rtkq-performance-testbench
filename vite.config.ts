import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-dom/client': path.resolve('./node_modules/react-dom/profiling'),
      'scheduler/tracing': path.resolve(
        './node_modules/scheduler/tracing-profiling'
      ),
    },
  },
})
