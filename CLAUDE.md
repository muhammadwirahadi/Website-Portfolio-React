# CLAUDE.md — Website Portfolio React

Panduan konteks untuk Claude saat membantu mengerjakan project ini. Baca file ini sebelum melakukan perubahan apapun.

## Tech Stack

- **React 19.2.8** (via Vite 8.2.0)
- **Tailwind CSS v4.3.3** (via plugin `@tailwindcss/vite`) — ✅ terinstall, `src/index.css` pakai `@import "tailwindcss";` + `@theme` untuk design token
- **GSAP 3.15.0 + ScrollTrigger** — ✅ terinstall & jadi tulang punggung semua animasi scroll (bukan cuma reveal biasa, tapi juga pin + scrub + timeline berlapis)
- **Lenis 1.3.26** — ✅ terinstall, TAPI belum benar-benar dipasang/di-init di manapun (belum ada `lib/lenis.js`). Perlu dipertimbangkan lagi apakah masih relevan setelah pola pin-scroll GSAP dipakai di Hero (Lenis + ScrollTrigger pin butuh integrasi khusus, jangan asal `new Lenis()` tanpa menghubungkannya ke `ScrollTrigger.update`).
- **ESLint** — linting standar

> Catatan lokasi: project root ada langsung di `C:\Users\muham\OneDrive\Desktop\Website Portofolio React` (folder nested `website-portfolio` yang sempat ada sebelumnya sudah tidak dipakai lagi).

## Struktur Folder (kondisi aktual saat ini)

```
website-portfolio/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        - bar navigasi, fade in/out dikontrol App
│   │   ├── Constellation.jsx - rasi bintang Aries (SVG) + semua interaksinya
│   │   ├── Sparkles.jsx      - canvas particle "stardust" (background dekorasi)
│   │   └── ScrollCue.jsx     - indikator "scroll" di Hero, hilang saat discroll
│   ├── App.jsx                - orkestrator utama: intro -> pin+zoom -> fade ke About
│   ├── main.jsx
│   └── index.css
├── public/
├── vite.config.js
└── package.json
```

Section lain (About isi sungguhan, Skills, Projects, Experience, Hobbies, Contact) **belum dibangun** — masih placeholder teks di dalam `App.jsx`.

## Alur Hero — Scrollytelling Utama (PENTING, baca sebelum mengubah App.jsx)

Ini bagian paling kompleks di project ini. Urutan yang sudah jadi:

1. **Intro (on mount)** — `Constellation.jsx` menggambar rasi Aries berurutan: titik `41 Arietis` muncul → garis ke `Hamal` digambar → titik `Hamal` muncul → garis ke `Sheratan` → dst, lalu bintang-bintang dekorasi (`Sparkles.jsx`) fade in. Setelah selesai, `Constellation` memanggil `onIntroComplete()`.
2. **`introComplete` jadi true** di `App.jsx` → `Navbar` dan `ScrollCue` fade in bareng.
3. **User scroll** → `ScrollTrigger` dengan `pin: true` mengunci Hero di layar. Selama scroll itu berlangsung (di-drive lewat `scrub`, BUKAN animasi lepas), satu timeline GSAP menjalankan paralel:
   - Seluruh layer visual (`heroVisualsRef`, isinya `Sparkles` + `Constellation`) di-**scale** membesar drastis (saat ini `scale: 160`), dengan `transform-origin` persis di posisi asli bintang **41 Arietis** — diukur LANGSUNG dari DOM (`getBoundingClientRect`), bukan tebakan persentase (lihat catatan teknis di bawah).
   - Layer yang sama juga di-**geser** (`heroPanRef`, properti `x`/`y`) supaya titik itu berakhir tepat di tengah layar.
   - Di 94%–100% akhir progress, sebuah `overlay` polos warna cream fade in menutupi layar, lalu konten section berikutnya (`aboutContentRef`) fade in di atasnya. **Ini transisi via fade, BUKAN scroll-reveal biasa** (section berikutnya tidak "digeser naik dari bawah" — dia cuma opacity 0→1 di posisi yang sama).
   - Selama scroll berlangsung: kedipan (twinkle) bintang di-pause + opacity dipaksa full, dan hover di bintang dimatikan sementara (`pointer-events: none`) — supaya rasi bintang terlihat "solid/diam" saat di-zoom.
   - Navbar disembunyikan total begitu scroll mulai bergerak sedikit pun, muncul lagi begitu progress mendekati akhir.

### Catatan teknis penting (supaya tidak mengulang bug yang sudah pernah kejadian)

- **Jangan tebak posisi elemen SVG pakai persentase viewBox.** SVG constellation pakai `preserveAspectRatio="slice"`, jadi posisi visual di layar tidak linear dengan koordinat viewBox. Selalu ukur pakai `getBoundingClientRect()` di runtime.
- **Ukur dari elemen yang bentuknya simetris terhadap titik pusatnya**, bukan dari grup pembungkus yang isinya elemen asimetris (misal grup bintang yang juga memuat label nama di atasnya — walau `opacity: 0`, tetap dihitung sebagai "area" oleh `getBoundingClientRect` dan menggeser hasil pengukuran).
- **`filter` CSS yang "nempel" (walau netral, misal `brightness(1)`) bisa memicu browser me-rasterize elemen jadi bitmap** sebelum di-scale oleh ancestor — hasilnya blur saat di-zoom. Selalu `clearProps: 'filter'` setelah animasi hover selesai, jangan cuma di-set balik ke nilai netral.
- **`scrollbar-gutter: stable`** di `html` (index.css) itu WAJIB ada selama ada mekanisme pin/scroll dinamis — tanpa ini, begitu scrollbar muncul (karena `pin` menambah tinggi dokumen), lebar viewport berubah dan semua yang di-center kelihatan "kegeser".
- **Jangan pasang `overflow-hidden` di `<main>` atau ancestor manapun dari section yang di-pin** — itu mematikan scroll browser sepenuhnya, padahal `ScrollTrigger` butuh scroll asli untuk men-drive animasi.
- **Bug klasik yang pernah kejadian:** jangan referensikan variabel `const context = gsap.context(fn, scope)` DARI DALAM `fn` itu sendiri (misal `context.sesuatu = ...`) — `fn` dieksekusi sinkron sebelum assignment `const context` selesai, jadi itu Temporal Dead Zone error. Kalau butuh nyimpan sesuatu dari dalam callback `gsap.context`, pakai variabel `let` terpisah yang dideklarasikan di luar.
- **`scrub` kecil (misal `1`) terasa "kaku"/nempel persis ke posisi scroll.** Naikkan (`1.8`–`3`) untuk kesan inertia yang lebih halus/sinematik.

## Design System

### Color Palette
Terinspirasi dari poster event "Laufey — A Matter of Time Tour" (vintage romantic/elegant).

```js
colors: {
  maroon: '#4A1620',   // background utama
  cream: '#F0E4C8',    // teks aksen / script text / warna "cahaya bintang"
  gold: '#D4AF37',     // aksen, ornamen, highlight
}
```

> Palette masih bisa berkembang — selalu tanya dulu sebelum mengubah warna existing.

### Typography

- **Script/cursive** (khusus logo/nama "Wira" di Navbar) → `Playball`
- **Sans-serif bold/grotesk** (semua heading, body, teks lain) → `Archivo` — dipilih karena paling mendekati referensi desain user (bold, tight tracking, geometric grotesk)
- Import via Google Fonts di `src/index.css`, didaftarkan sebagai token `--font-script` dan `--font-display` di `@theme`

### Vibe / Art Direction
Vintage romantic, elegant, dramatic (dark maroon background + gold/cream accent). Bukan gaya minimalis modern flat.

## Konvensi Coding

- Komponen React pakai functional component + hooks
- Satu file per komponen di `src/components/`
- Styling murni pakai Tailwind utility classes (hindari custom CSS kecuali untuk hal yang tidak bisa dilakukan Tailwind)
- Animasi GSAP di-setup di dalam `useEffect`, pakai `gsap.context()` untuk cleanup yang benar (revert semua tween/ScrollTrigger saat unmount)
- Timeline GSAP yang panjang/berlapis (seperti di App.jsx) diberi komentar per baris menjelaskan KENAPA suatu step ada di posisi/durasi tertentu, bukan cuma APA yang di-tween — supaya gampang di-tuning lagi nanti tanpa harus reverse-engineer maksudnya
- Gunakan Bahasa Indonesia untuk komentar kode dan penjelasan, Bahasa Inggris untuk penamaan variabel/fungsi

### Standar Kualitas Kode & Desain (PENTING — SELALU DIPEGANG)

User secara eksplisit ingin kode dan tampilan terasa seperti buatan **developer React profesional berpengalaman**, bukan template/output AI generik. Ini bukan cuma soal hasil visual, tapi juga kualitas kode:

- **Hindari "AI-look" default**: jangan pakai kombinasi warna/layout klise. Selalu pakai palette maroon/cream/gold, dieksekusi dengan detail matang.
- **Restraint pada animasi**: satu momen animasi yang di-orkestrasi dengan baik lebih baik daripada banyak efek kecil yang berserakan.
- **Kualitas kode setara production**:
  - Penamaan variabel/fungsi jelas & deskriptif (`heroPanRef` bukan `ref1`, `ZOOM_TARGET_STAR_ID` bukan angka ajaib)
  - Tidak ada dead code, tidak ada komentar generik yang tidak perlu
  - Konstanta/"magic number" (threshold, durasi, easing) diberi nama dan diletakkan di atas file, bukan angka lepas di tengah kode
  - Cleanup function GSAP context/ScrollTrigger/event listener SELALU benar — jangan sampai ada memory leak atau listener yang nyangkut
  - Effect dependency array diperhatikan — jangan sampai ada closure basi (stale closure) atau effect yang jalan di waktu yang salah
  - Kalau ada kemungkinan bug non-obvious (race condition, timing, DOM measurement), TULISKAN alasannya di komentar, bukan cuma kode tanpa konteks
- Sebelum menganggap komponen selesai, self-critique: apakah ini terasa seperti section generik, atau benar-benar personal & presisi untuk brief vintage-romantic-scrollytelling ini?

## To-Do / Status Saat Ini

- [x] Install & konfigurasi Tailwind CSS
- [x] Install GSAP + ScrollTrigger
- [x] Install Lenis (belum di-init/dipakai — lihat catatan di Tech Stack)
- [x] Setup color palette & font
- [x] Navbar (fade in/out, tanpa efek kapsul-mengambang lagi — cuma bar transparan yang muncul/hilang)
- [x] Constellation rasi Aries — reveal berantai, twinkle, hover interaktif (label nama bintang custom, bukan tooltip browser)
- [x] Sparkles — background particle dekoratif (canvas)
- [x] ScrollCue — indikator scroll
- [x] Hero scroll-zoom sequence lengkap: intro → pin → zoom ke 41 Arietis → fade ke About
- [ ] Isi section About sungguhan (masih placeholder teks doang)
- [ ] Section Skills, Projects, Experience (opsional), Hobbies, Contact — belum dibangun sama sekali
- [ ] Putuskan nasib Lenis: dipakai beneran (integrasi ke ScrollTrigger.update) atau dicopot dari dependency kalau ternyata tidak diperlukan
- [ ] Konten asli tiap section (lihat bagian Konten di bawah)

## Konten (isi setelah didiskusikan dengan user)

- Nama: Wira (logo Navbar), kemungkinan nama lengkap **Muhammad Wira Hadi** — perlu dikonfirmasi ulang untuk Hero
- Role/Title: kemungkinan **Full Stack Developer** (berdasarkan pengalaman: backend sistem pendaftaran magang Badilag + seluruh web pendaftaran magang LSF) — belum final
- Tagline: belum diputuskan (beberapa draft sempat ditawarkan, belum dipilih)
- About (deskripsi singkat): belum diisi
- Skills/Tech stack: belum diisi
- Projects: minimal termasuk **Badilag** (backend sistem pendaftaran magang instansi pemerintah) dan **LSF** (seluruh web pendaftaran magang) — detail deskripsi/link belum dikumpulkan
- Hobbies: belum diisi
- Contact (email, sosial media): belum diisi
