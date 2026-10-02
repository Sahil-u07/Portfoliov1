import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative, so the build works on GitHub Pages project URLs too.
export default defineConfig({ plugins: [react()], base: './' });
