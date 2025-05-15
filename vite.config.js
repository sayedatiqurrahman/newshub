import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            '@': '/src',
            '@components': '/src/components',
            '@hooks': '/src/hooks',
            '@lib': '/src/lib',
            '@pages': '/src/pages',
            '@styles': '/src/styles',
            '@utils': '/src/utils',
        }
    }
})
