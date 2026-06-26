import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Automatically generate public directory and copy the main logo for the PWA install icons
  try {
    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    const logoSrc = path.resolve(__dirname, 'src/assets/images/game_over_logo_1782296492232.jpg');
    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, path.join(publicDir, 'icon.jpg'));
      fs.copyFileSync(logoSrc, path.join(publicDir, 'icon-192.png'));
      fs.copyFileSync(logoSrc, path.join(publicDir, 'icon-512.png'));
      console.log('✓ PWA Icons successfully generated in public/ directory');
    }
  } catch (error) {
    console.error('Failed to copy PWA logo icons:', error);
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
