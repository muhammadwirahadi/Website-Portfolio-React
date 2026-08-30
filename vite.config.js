import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Situs ini di-deploy sebagai GitHub Pages "project page" (bukan
  // username.github.io root), jadi hidup di bawah subpath /nama-repo/.
  // Tanpa base ini, semua link ke asset (JS, CSS, gambar) bakal salah
  // alamat pas di-build untuk production.
  base: '/portfolio-muhammadwirahadi/',
  plugins: [react(), tailwindcss()],
})
