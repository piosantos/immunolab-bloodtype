import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['pwa-192x192.svg', 'pwa-512x512.svg'],
            manifest: {
                name: 'ImmunoLab Pro',
                short_name: 'ImmunoLab',
                description: 'Offline-First Hematology Simulation',
                theme_color: '#020617',
                background_color: '#020617',
                display: 'standalone',
                orientation: 'landscape',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
                    { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
                ]
            },
            workbox: {
                navigateFallback: '/index.html',
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true
            }
        })
    ]
});
