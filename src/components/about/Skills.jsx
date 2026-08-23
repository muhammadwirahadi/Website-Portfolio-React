import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InteractiveGrid from './InteractiveGrid'

gsap.registerPlugin(ScrollTrigger)

// Safe runtime converter from SVG string to Base64 Data URL to prevent browser/vite parser bugs
const svgToBase64 = (svgString) => {
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
  } catch (e) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  }
};

// 100% reliable Devicon, Wikimedia & custom base64 SVG icons for all 18 skills (rendered in original brand colors)
const SKILL_ICONS = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/codeigniter/codeigniter-plain.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  // Custom square GSAP box logo (GreenSock is not in Devicon) - redesigned to fill the card beautifully
  { src: svgToBase64("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' fill='none'><rect width='80' height='80' rx='16' fill='%2388CE02'/><text x='40' y='49' font-family='sans-serif' font-size='19' font-weight='900' fill='white' text-anchor='middle'>GSAP</text></svg>") },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" }
]

function Skills({ active = false }) {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const lineRef = useRef(null)
  const gridWrapRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const context = gsap.context(() => {
      // Inisialisasi status awal (Label & Garis mengikuti Education, GridWrap selalu terlihat, Kartu-kartu mulai dari scale 0)
      gsap.set(labelRef.current, { opacity: 0 })
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(gridWrapRef.current, { opacity: 1 })
      gsap.set('.interactive-grid-card', { opacity: 0, scale: 0, transformOrigin: 'center center' })

      // 1. Animasi Scrub (Persis Education): Label "Skills" & Garis pembatas
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 40%',
          end: 'top 20%',
          scrub: 1.5,
        },
      })

      // Tahap 1: Text "Skills" memudar masuk
      tl.to(labelRef.current, {
        opacity: 1,
        duration: 0.3,
      }, 0)

      // Tahap 2: Garis pembatas muncul menggambar dari kiri ke kanan
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0.2)

      // 2. Animasi Grid Cards (Constellation Scale Stagger: Bintang menyala bergantian dari tengah ke luar)
      gsap.to('.interactive-grid-card', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: {
          grid: [3, 6],
          from: 'center',
          amount: 0.6
        },
        ease: 'back.out(1.4)',
        onComplete: () => {
          // Bersihkan properti transform inline agar transisi hover CSS asli kembali aktif dengan normal
          gsap.set('.interactive-grid-card', { clearProps: 'transform' })
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 10%',
          toggleActions: 'play none none reset',
          onLeaveBack: () => {
            // Reset ke kondisi awal saat di-scroll balik ke atas
            gsap.set('.interactive-grid-card', { scale: 0, opacity: 0 })
          }
        },
      })
    }, sectionRef)

    return () => context.revert()
  }, [active])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative z-20 flex min-h-screen flex-col justify-center overflow-hidden bg-transparent py-24 text-maroon"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Label Seksi - Mengikuti struktur dan alignment Education */}
        <p
          ref={labelRef}
          className="text-sm uppercase tracking-[0.35em] text-maroon/60"
        >
          Skills
        </p>

        {/* Garis Pembatas - Mengikuti struktur dan alignment Education */}
        <div
          ref={lineRef}
          className="mt-4 h-0.5 w-full bg-maroon/25"
        />

        {/* Konten Grid Interaktif 3D (Columns: 6, Rows: 3, aspect-square, max-w-4xl hampir sejajar dengan garis) */}
        <div 
          ref={gridWrapRef} 
          className="pt-16 w-full max-w-4xl mx-auto"
        >
          <InteractiveGrid
            images={SKILL_ICONS}
            columns={6}
            rows={3}
            gap={0}
            rounded={12}
            padding="0px"
            cardFill="#f0e4c8"
            cardBorder="rgba(74, 22, 32, 0.15)"
            shadow={true}
            cardShadow="rgba(74, 22, 32, 0.15)"
            glow={true}
            glowStart="rgba(212, 175, 55, 0.25)"
            glowEnd="#D4AF37"
            glowIntensity={45}
            logoScale={3}
          />
        </div>
      </div>
    </section>
  )
}

export default Skills
