import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import {mediapipe} from 'vite-plugin-mediapipe'

export default defineConfig(({mode}) => {
    const envFile = mode === 'development' ? '.env.development' : '.env.production';
    dotenv.config({path: envFile});
    return {
        plugins: [
            react(),
            mediapipe()
        ],
        css:{
          postcss:{}
        },
        build: {
            outDir: 'build',
            assetsDir: 'assets',
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: process.env.VITE_API_BASE_URL,
                    changeOrigin: true,
                },
                '/auth': {
                    target: process.env.VITE_AUTH_BASE_URL,
                    changeOrigin: true,
                },'/oauth': {
                    target: process.env.VITE_API_BASE_URL,
                    changeOrigin: true,
                },
                '/static': {
                    target: process.env.VITE_API_BASE_URL,
                    changeOrigin: true,
                },
            },
        },
    };
});