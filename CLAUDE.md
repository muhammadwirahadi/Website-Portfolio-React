# CLAUDE.md — Website Portfolio React

Panduan konteks untuk AI saat membantu mengerjakan project ini. **Baca file ini sebelum melakukan perubahan apapun.**

---

## Tech Stack

- **React 19.2.8** (via Vite 8.2.0)
- **Tailwind CSS v4.3.3** (via plugin `@tailwindcss/vite`) — `src/index.css` pakai `@import "tailwindcss";` + `@theme` untuk design token
- **GSAP 3.15.0 + ScrollTrigger** — tulang punggung semua animasi scroll: pin, scrub, timeline berlapis, dan transisi antar section
- **Lenis 1.3.26** — sudah di-init dan terhubung ke GSAP ticker di `App.jsx`. Dipakai untuk smooth scroll dengan momentum inertia berat (`duration: 1.6`). Lenis dihubungkan ke ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` dan `gsap.ticker.add(tickerCallback)`. Instance disimpan di `window.globalLenis` untuk akses dari komponen child.
- **Framer Motion** — dipakai di `Experiences.jsx` untuk beberapa animasi entry
- **ESLint** — linting standar

> Lokasi project root: `C:\Users\muham\OneDrive\Desktop\Website Portofolio React`

---

## Struktur Folder (kondisi aktual)

```
src/
├── assets/
│   ├── profile.png                  - foto profil Wira
│   ├── contact-illustration.png     - ilustrasi halaman Contact
│   ├── lsf-grid.png / badilag-grid.png  - thumbnail project grid
│   ├── lsf/                         - screenshot screens LSF (5 gambar)
│   └── badilag/                     - screenshot screens Badilag (5 gambar)
├── components/
│   ├── hero/
│   │   ├── Constellation.jsx        - rasi bintang Aries (SVG) + animasi intro garis berantai + twinkle + hover label
│   │   ├── Sparkles.jsx             - canvas particle stardust (background dekorasi), bisa di-pause via prop active
│   │   └── ScrollCue.jsx            - indikator scroll di bawah Hero
│   ├── about/
│   │   ├── About.jsx                - konten About Me (foto profil, CrystalGlow, RotatingText, LiquidHover)
│   │   ├── Education.jsx            - seksi pendidikan, animasi hibrida scrubbed & play-once
│   │   ├── Skills.jsx               - seksi skills dengan InteractiveGrid
│   │   ├── NextJourney.jsx          - section prompt mau ke Experiences? (trigger transisi antariksa ke Experiences)
│   │   ├── CrystalGlow.jsx          - efek text glow untuk nama
│   │   ├── LiquidHover.jsx          - WebGL shader fluid simulation untuk foto avatar
│   │   ├── RotatingText.jsx         - animasi teks berganti berputar (Role/Title)
│   │   ├── InteractiveGrid.jsx      - komponen grid interaktif untuk Skills
│   │   └── ShootingStars.jsx        - background bintang jatuh di halaman krem
│   ├── experiences/
│   │   ├── SpaceTransitionScroll.jsx  - transisi antariksa Hero About -> Experiences (pin+scrub GSAP)
│   │   ├── Experiences.jsx            - konten halaman Experiences: KineticTextGrid intro, daftar magang, MagneticCarousel project
│   │   ├── KineticTextGrid.jsx        - animasi teks acak yang membentuk kata (intro section Experiences)
│   │   ├── HoverImageReveal.jsx       - efek reveal gambar saat hover pada daftar magang
│   │   ├── SkewInText.jsx             - animasi teks masuk miring
│   │   ├── MagneticCarousel.jsx       - carousel project dengan detail lengkap (LSF & Badilag) + magnetic cursor
│   │   └── NextJourneyExperiences.jsx - section prompt mau ke Summary? (trigger transisi ke Summary)
│   ├── summary/
│   │   ├── SummarySpaceTransition.jsx - transisi antariksa Experiences -> Summary (pin+scrub GSAP, bintang Hamal)
│   │   ├── Summary.jsx                - konten halaman Summary: stats, tech stack icons, CTA ke Contact
│   │   └── NextJourneySummary.jsx     - section prompt mau ke Contact? (trigger transisi ke Contact)
│   ├── contact/
│   │   ├── ContactSpaceTransition.jsx - transisi antariksa Summary -> Contact (pin+scrub GSAP, bintang Mesarthim)
│   │   └── Contact.jsx                - konten halaman Contact: ilustrasi, info sosial, tombol Retrace Journey
│   └── ui/
│       ├── Navbar.jsx               - bar navigasi, warna berganti cream<->maroon, hamburger menu + drawer panel
│       └── CustomCursor.jsx         - custom kursor dinamis (cream <-> maroon sesuai tema)
├── App.jsx                          - orkestrator utama seluruh alur halaman
├── main.jsx
└── index.css
```

---

## Alur Penuh Website (PENTING — baca sebelum mengubah apapun)

Ini adalah single-page scrollytelling dengan rantai transisi kosmik. Urutan dari atas ke bawah:

### 1. Hero — Intro Rasi Bintang Aries
- On mount: `Constellation.jsx` menggambar rasi Aries secara berantai. Setelah selesai, memanggil `onIntroComplete()`.
- `introComplete` jadi `true` di `App.jsx` -> Navbar & ScrollCue fade in.

### 2. Hero -> About — Zoom ke Bintang 41 Arietis
- ScrollTrigger `pin: true`, `end: +=250%`, `scrub: 1` mengunci Hero di layar.
- Timeline GSAP men-scale seluruh layer visual (`heroVisualsRef`) hingga `scale: 330` dengan `transform-origin` persis di posisi bintang **41 Arietis** (diukur via `getBoundingClientRect` — JANGAN tebak pakai persen viewBox).
- Layer juga di-pan (`heroPanRef`) agar titik itu berakhir di tengah layar.
- Di progress ~76%: overlay cream fade in -> konten About fade in di atasnya.
- Di progress ~80%: scroll dikunci sementara (`isLockedDown`) sampai animasi masuk About selesai.

### 3. About / Education / Skills
- Konten About, Education, Skills scroll normal di atas overlay cream.
- Setelah Skills ada section `NextJourney.jsx` sebagai prompt/trigger menuju Experiences.

### 4. About -> Experiences — Transisi Antariksa via `SpaceTransitionScroll.jsx`
- Pin section kosmik, zoom-out dari 41 Arietis -> travel ke Hamal -> zoom-in ke Hamal -> fade ke Experiences.
- Scroll dikunci saat Experiences masuk sampai seluruh animasi entry selesai:
  - KineticTextGrid (teks acak membentuk kata) selesai
  - GSAP timeline entry (judul settle, garis draw, daftar magang fade-in) selesai
  - Baru setelah `onComplete` timeline, `globalLenis.start()` dipanggil untuk membuka scroll kembali.

### 5. Experiences — Konten
- Daftar magang dengan HoverImageReveal, SkewInText
- MagneticCarousel untuk detail project LSF & Badilag
- Section NextJourneyExperiences sebagai prompt ke Summary

### 6. Experiences -> Summary — Transisi Antariksa via `SummarySpaceTransition.jsx`
- Pin section kosmik, zoom-out dari Hamal -> travel ke Sheratan -> zoom-in ke Sheratan -> fade ke Summary.

### 7. Summary — Konten
- Stats (6 months, 2 internships, 2 projects)
- Tech stack icons (PHP, Laravel, Vue, Tailwind, MySQL, Git, GitHub)
- Section NextJourneySummary sebagai prompt ke Contact

### 8. Summary -> Contact — Transisi Antariksa via `ContactSpaceTransition.jsx`
- Pin section kosmik, zoom-out dari Sheratan -> travel ke Mesarthim -> zoom-in ke Mesarthim -> fade ke Contact.
- `onBack` dari Contact akan scroll kembali ke `#next-journey-summary`.

### 9. Contact — Konten (Halaman Terakhir)
- Ilustrasi kiri, kolom kanan berisi: judul Contact, garis, info sosial media
- Ikon sosial (tidak ada teks/kotak): LinkedIn, GitHub (icon SVG bulat), Email (icon SVG bulat, hover memunculkan teks `muhammadwirahadi2@gmail.com` di bawahnya dengan opacity transition)
- Tombol "Retrace Journey": memanggil `onBackToHome` -> `handleResetToAbout` di `App.jsx`:
  - Fade-in overlay cream (700ms)
  - Teleport scroll ke 0 via `window.scrollTo(0,0)` dan `lenis.scrollTo(0, { immediate: true })`
  - `ScrollTrigger.update()` untuk sync inline styles
  - Fade-out overlay cream (300ms)
  - CATATAN WIP: Tombol ini membawa user kembali ke area About/Hero awal, belum ke rasi bintang Aries full karena state GSAP inline styles belum ter-reset sepenuhnya.

---

## Catatan Teknis Penting (Jangan Diabaikan)

- **Jangan tebak posisi elemen SVG pakai persentase viewBox.** SVG constellation pakai `preserveAspectRatio="slice"`, jadi selalu ukur pakai `getBoundingClientRect()` di runtime.
- **Ukur dari elemen yang simetris terhadap titik pusatnya** — bukan dari grup pembungkus yang juga memuat label teks (walau opacity 0, tetap mempengaruhi bounding box).
- **`filter` CSS yang nempel (walau netral) bisa rasterize elemen jadi bitmap** sebelum di-scale ancestor -> blur. Selalu `clearProps: 'filter'` setelah animasi hover.
- **`scrollbar-gutter: stable`** di `html` (`index.css`) WAJIB ada agar lebar viewport tidak bergeser saat scrollbar muncul akibat pin spacer.
- **Jangan `overflow-hidden` di `<main>` atau ancestor section yang di-pin** — itu mematikan scroll browser sepenuhnya.
- **Lenis + ScrollTrigger harus terkoneksi**: `lenis.on('scroll', ScrollTrigger.update)` dan `gsap.ticker.add(tickerCallback)`. Tanpa ini, scrub akan lag.
- **`window.globalLenis`**: Komponen child (misal `Experiences.jsx`) mengakses Lenis via `window.globalLenis` untuk `stop()`/`start()` saat scroll lock section masuk.
- **Bug klasik GSAP context**: Jangan referensikan `const context = gsap.context(fn, scope)` dari dalam `fn` — itu Temporal Dead Zone error. Pakai variabel `let` terpisah.
- **Setiap SpaceTransition** mengambil ukuran bintang asal dan target dari DOM via `getBoundingClientRect` saat `useEffect` dijalankan setelah `active` jadi `true`. Jangan hardcode koordinat.
- **Scroll lock di Experiences**: `globalLenis.stop()` dipanggil saat section Experiences masuk, `globalLenis.start()` baru dipanggil di `onComplete` GSAP timeline entry terakhir (bukan di callback `handleKineticComplete`).

---

## Design System

### Color Palette
Terinspirasi dari poster event "Laufey — A Matter of Time Tour" (vintage romantic/elegant).

- `maroon: #4A1620` — background utama (Hero, Experiences, Summary, transisi kosmik)
- `cream: #F0E4C8` — background About/Skills/Summary/Contact content, teks di atas maroon
- `gold: #D4AF37` — aksen, ornamen, glow bintang

### Typography
- Script/cursive (logo "Wira" di Navbar): `Playball`
- Sans-serif bold/grotesk (semua heading & body): `Archivo`
- Import via Google Fonts di `src/index.css`, didaftarkan sebagai `--font-script` dan `--font-display` di `@theme`

### Vibe / Art Direction
Vintage romantic, elegant, dramatic. Dark maroon background + gold/cream accent. Bukan flat minimalis modern.

---

## Konvensi Coding

- Functional component + hooks
- Satu file per komponen di `src/components/`
- Styling: Tailwind utility classes
- Animasi GSAP di `useEffect` + `gsap.context()` untuk cleanup benar
- Komentar kode: Bahasa Indonesia. Penamaan variabel/fungsi: Bahasa Inggris
- Timeline GSAP panjang diberi komentar per baris: KENAPA step itu ada
- Cleanup function SELALU benar — tidak ada memory leak

---

## To-Do / Status Saat Ini

- [x] Install & konfigurasi Tailwind CSS
- [x] Install GSAP + ScrollTrigger
- [x] Install & init Lenis — terhubung ke ScrollTrigger, instance di `window.globalLenis`
- [x] Setup color palette & font
- [x] Navbar (fade in/out, hamburger menu, drawer panel staggered)
- [x] Constellation rasi Aries — reveal berantai, twinkle, hover label bintang
- [x] Sparkles — background particle dekoratif (canvas), pauseable
- [x] ScrollCue — indikator scroll
- [x] Hero scroll-zoom sequence: intro -> pin -> zoom ke 41 Arietis -> fade ke About
- [x] Scroll lock di About: halaman tidak bisa di-scroll sampai animasi masuk About selesai
- [x] Konten About (foto profil, CrystalGlow, RotatingText, LiquidHover WebGL)
- [x] Konten Education (animasi scrubbed: label, line draw, letter-drop, slide-in)
- [x] Konten Skills (InteractiveGrid)
- [x] NextJourney — prompt transisi ke Experiences
- [x] SpaceTransitionScroll — transisi antariksa Hero->Experiences
- [x] Scroll lock di Experiences: KineticTextGrid + semua animasi entry selesai dulu sebelum scroll dibuka
- [x] Konten Experiences (KineticTextGrid, HoverImageReveal, SkewInText, MagneticCarousel LSF+Badilag)
- [x] NextJourneyExperiences — prompt transisi ke Summary
- [x] SummarySpaceTransition — transisi antariksa Experiences->Summary
- [x] Konten Summary (stats, tech stack icons, CTA ke Contact)
- [x] NextJourneySummary — prompt transisi ke Contact
- [x] ContactSpaceTransition — transisi antariksa Summary->Contact
- [x] Konten Contact (ilustrasi, icon sosial bulat, hover email tooltip, tombol Retrace Journey)
- [ ] Tombol Retrace Journey: saat ini ke area awal About, belum ke rasi bintang Aries full (WIP)

---

## Konten Aktual

- **Nama**: Muhammad Wira Hadi
- **Role/Title** (berputar): Web Developer, Full Stack Developer, Junior Developer
- **Tentang**: Full Stack Developer berbasis di Jakarta. Lulusan Universitas Bina Sarana Informatika (Informatics, IPK 3.96), pengalaman magang 6 bulan.
- **Pendidikan**: Universitas Bina Sarana Informatika — Bachelor of Informatics — Jakarta — 2022-2026 — IPK 3.96
- **Magang / Experiences**:
  - Lembaga Sensor Film RI (Jan 2026 – Mar 2026) — Fullstack Developer. Stack: PHP, Laravel 10, Vue.js, Tailwind, Inertia.js, MySQL.
  - Ditjen Badan Peradilan Agama / Badilag (Oct 2025 – Dec 2025) — Backend Developer. Stack: Laravel, MySQL.
- **Sosial**:
  - LinkedIn: https://linkedin.com/in/muhammad-wira-hadi-8962b3276/
  - GitHub: https://github.com/muhammadwirahadi
  - Email: muhammadwirahadi2@gmail.com
