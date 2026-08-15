# CLAUDE.md — Website Portfolio React

Panduan konteks untuk Claude saat membantu mengerjakan project ini. Baca file ini sebelum melakukan perubahan apapun.

## Tech Stack

- **React 19.2.8** (via Vite 8.2.0)
- **Tailwind CSS v4.3.3** (via plugin `@tailwindcss/vite`) — ✅ terinstall & `src/index.css` sudah pakai `@import "tailwindcss";`
- **GSAP 3.15.0 + ScrollTrigger** — ✅ terinstall, untuk animasi scroll (scrollytelling)
- **Lenis 1.3.26** — ✅ terinstall, untuk smooth scrolling
- **ESLint** — linting standar

> Catatan lokasi: project root ada langsung di `C:\Users\muham\OneDrive\Desktop\Website Portofolio React` (folder nested `website-portfolio` yang sempat ada sebelumnya sudah tidak dipakai lagi).

## Struktur Folder

```
website-portfolio/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Experience.jsx   (opsional)
│   │   ├── Hobbies.jsx
│   │   └── Contact.jsx
│   ├── lib/
│   │   └── lenis.js          (setup smooth scroll)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── vite.config.js
└── package.json
```

## Urutan Section (Scrollytelling)

1. **Hero** — nama, role/title, tagline, CTA button
2. **About** — cerita singkat tentang diri
3. **Skills** — tech stack dengan icon, reveal animation
4. **Projects** — 3-6 project terbaik dengan gambar, deskripsi, link demo/GitHub
5. **Experience** *(opsional)* — timeline pengalaman kerja/organisasi
6. **Hobbies** — sisi personal, ditaruh dekat Contact biar closing terasa hangat
7. **Contact** — email, sosial media, form kontak

Tiap section dianimasikan pakai GSAP ScrollTrigger (fade in / slide / reveal saat discroll), dikombinasikan dengan Lenis untuk smooth scroll experience.

## Design System

### Color Palette
Terinspirasi dari poster event "Laufey — A Matter of Time Tour" (vintage romantic/elegant).

```js
colors: {
  maroon: '#4A1620',   // background utama
  cream: '#F0E4C8',    // teks aksen / script text
  gold: '#D4AF37',     // aksen, ornamen, highlight
}
```

> Catatan: palette masih bisa berkembang — user mungkin menambahkan warna lain seiring project berjalan. Selalu tanya dulu sebelum mengubah palette existing.

### Typography

- **Script/cursive** (khusus logo/nama "Wira" di Navbar) → `Playball`
- **Sans-serif bold/grotesk** (semua heading, body, dan teks lainnya) → `Archivo` — dipilih karena paling mendekati karakteristik referensi desain user (bold, tight tracking, geometric grotesk, ada varian italic tebal)
- Import via Google Fonts di `src/index.css`, didaftarkan sebagai token `--font-script` dan `--font-display` di `@theme`

### Vibe / Art Direction
Vintage romantic, elegant, dramatic (dark maroon background + gold/cream accent). Bukan gaya minimalis modern flat — lebih ke arah klasik & personal.

## Konvensi Coding

- Komponen React pakai functional component + hooks
- Satu file per komponen di `src/components/`
- Styling murni pakai Tailwind utility classes (hindari custom CSS kecuali untuk hal yang tidak bisa dilakukan Tailwind, misal keyframe custom atau font-face)
- Animasi GSAP di-setup di dalam `useEffect` tiap komponen (pakai `gsap.context()` untuk cleanup yang benar), atau di-abstract ke custom hook kalau berulang
- Gunakan Bahasa Indonesia untuk komentar kode dan penjelasan, Bahasa Inggris untuk penamaan variabel/fungsi (standar konvensi JS)

### Standar Kualitas Kode & Desain (PENTING)

User secara eksplisit ingin kode dan tampilan terasa seperti buatan **developer profesional**, bukan template/output AI generik. Prinsip ini WAJIB dipegang di setiap komponen yang dibuat:

- **Hindari "AI-look" default**: jangan pakai kombinasi warna/layout klise (background krem + aksen terracotta, atau dark mode dengan satu aksen neon generik, dsb). Selalu pakai palette maroon/cream/gold yang sudah ditentukan, dieksekusi dengan detail yang matang (bukan asal tempel warna).
- **Restraint pada animasi**: animasi harus purposeful, bukan "ramai" sekadar biar keliatan modern. Satu momen animasi yang di-orkestrasi dengan baik lebih baik daripada banyak efek kecil yang berserakan.
- **Detail transisi & state**: hover state, transisi antar state (misal navbar solid vs transparent), easing curve dipilih dengan sengaja (hindari default `ease-in-out` linear kalau ada opsi easing yang lebih natural/custom dari GSAP).
- **Konsistensi**: spacing, ukuran font, radius, dan warna harus konsisten di semua komponen — sebaiknya didefinisikan sebagai design token di `@theme` (index.css) atau konstanta, bukan angka acak per komponen.
- **Kualitas kode**: penamaan variabel/fungsi jelas dan deskriptif, tidak ada dead code atau komentar generik yang tidak perlu, struktur komponen rapi dan mudah dibaca layaknya kode production, gunakan cleanup function yang benar untuk GSAP context/ScrollTrigger supaya tidak memory leak.
- Sebelum menganggap sebuah komponen selesai, self-critique: apakah ini terasa seperti section generik yang bisa muncul di portfolio manapun, atau benar-benar terasa personal & spesifik untuk brief vintage romantic/elegant ini?

## To-Do / Status Saat Ini

- [x] Install & konfigurasi Tailwind CSS dengan benar
- [x] Install GSAP
- [x] Install Lenis
- [ ] Setup color palette & font di Tailwind config / index.css (variable warna sudah ada di index.css, font Google Fonts belum di-import)
- [ ] Siapkan konten tiap section (nama, tagline, about, skills, projects, hobbies, contact info)
- [ ] Build komponen section satu per satu sesuai urutan di atas

## Konten (isi setelah didiskusikan dengan user)

- Nama:
- Role/Title:
- Tagline:
- About (deskripsi singkat):
- Skills/Tech stack:
- Projects: (nama, deskripsi, link, tech stack per project)
- Hobbies:
- Contact (email, sosial media):
