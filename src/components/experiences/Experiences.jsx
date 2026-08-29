import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import KineticTextGrid from './KineticTextGrid'
import HoverImageReveal from './HoverImageReveal'
import SkewInText from './SkewInText'
import MagneticCarousel from './MagneticCarousel'
import NextJourneyExperiences from './NextJourneyExperiences'
import lsfGrid from '../../assets/lsf-grid.png'
import badilagGrid from '../../assets/badilag-grid.png'

// Import asset screens LSF
import lsfLogin from '../../assets/lsf/login-lsf.png'
import lsfMahasiswa from '../../assets/lsf/mahasiswa-lsf.png'
import lsfPembimbing from '../../assets/lsf/pembimbing-lsf.png'
import lsfSuperadmin from '../../assets/lsf/superadmin-admin-lsf.png'
import lsfWelcome from '../../assets/lsf/welcome-lsf.png'

// Import asset screens Badilag
import badilagKegiatan from '../../assets/badilag/kegiatan-badilag.png'
import badilagLogin from '../../assets/badilag/login-badilag.png'
import badilagLowongan from '../../assets/badilag/lowongan-badilag.png'
import badilagPendaftaran from '../../assets/badilag/pendaftaran-badilag.png'
import badilagWelcome from '../../assets/badilag/welcome-badilag.png'

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCES_DATA = [
  {
    company: "Lembaga Sensor Film RI",
    period: "Jan 2026 - Mar 2026",
    role: "Fullstack Developer",
    image: { src: lsfGrid }
  },
  {
    company: "Ditjen Badan Peradilan Agama",
    period: "Oct 2025 - Dec 2025",
    role: "Backend Developer",
    image: { src: badilagGrid }
  },
]

const PROJECTS_DATA = [
  {
    company: "Lembaga Sensor Film RI",
    period: "Contract",
    role: "Fullstack Developer",
    image: { src: lsfGrid },
    details: {
      title: "Lembaga Sensor Film RI",
      role: "Fullstack Developer (Internship)",
      description: "Saya membangun website SI-LSF (Sistem Informasi Lembaga Sensor Film) untuk memudahkan mahasiswa melakukan pendaftaran magang secara online dan mencatat logbook harian magang secara terintegrasi setelah diterima. Sistem ini merapikan administrasi data magang secara terpusat bagi pembimbing lapangan dan staf administrasi LSF agar data magang terkelola dengan baik dan tidak terpencar-pencar.",
      tech: ["PHP", "Laravel 10", "Vue.js", "Tailwind", "Inertia.js", "MySQL", "GitHub"],
      carouselImages: [
        { 
          isInfo: true, 
          title: "LSF - Lembaga Sensor Film", 
          role: "Fullstack Developer", 
          description: "Sistem Informasi Kerja Praktik & Magang SI-LSF. Mempermudah pendaftaran mahasiswa secara online, pencatatan logbook harian magang, serta memusatkan administrasi data magang bagi pembimbing lapangan dan staf LSF agar terorganisir.", 
          tech: ["PHP", "Laravel 10", "Vue.js", "Tailwind", "Inertia.js", "MySQL", "GitHub"] 
        },
        { src: lsfWelcome },
        { src: lsfLogin },
        { src: lsfMahasiswa, bgPos: "left center" },
        { src: lsfPembimbing, bgPos: "left center" },
        { src: lsfSuperadmin, bgPos: "left center" }
      ]
    }
  },
  {
    company: "Ditjen Badan Peradilan Agama",
    period: "Contract",
    role: "Backend Developer",
    image: { src: badilagGrid },
    details: {
      title: "Ditjen Badan Peradilan Agama",
      role: "Backend Developer (Internship)",
      description: "Pengembangan website portal pendaftaran magang untuk Ditjen Badilag Mahkamah Agung RI dengan fokus utama pada sisi Backend. Bertanggung jawab atas perancangan Entity Relationship Diagram (ERD) database, arsitektur role-based access control, Validasi Data, Autentikasi saat login, pembuatan fitur fungsional untuk masing-masing user role, serta kontribusi minor pada pengerjaan visual antarmuka.",
      tech: ["PHP", "Laravel 10", "Vue.js", "Inertia.js", "Tailwind", "MySQL", "GitHub"],
      carouselImages: [
        { 
          isInfo: true, 
          title: "Badilag MA RI", 
          role: "Backend Developer", 
          description: "Portal pendaftaran magang Ditjen Badilag MA RI. Berfokus pada pengembangan backend, arsitektur role-based, perancangan Entity Relationship Diagram (ERD), Validasi Data, Autentikasi saat login, dan fungsionalitas fitur pengguna.", 
          tech: ["PHP", "Laravel 10", "Vue.js", "Inertia.js", "Tailwind", "MySQL", "GitHub"] 
        },
        { src: badilagWelcome },
        { src: badilagLogin },
        { src: badilagPendaftaran },
        { src: badilagKegiatan },
        { src: badilagLowongan }
      ]
    }
  },
]

function Experiences({ active = false, onBack, setNavbarVisible, onNextJourney, showNextJourneyCue = true }) {
  const containerRef = useRef(null)
  
  // Refs untuk seksi Experiences (Page 1)
  const titleRef = useRef(null)
  const lineRef = useRef(null)
  const listRef = useRef(null)
  
  // Refs untuk seksi Projects (Page 2)
  const projectsSectionRef = useRef(null)
  const projectsLineRef = useRef(null)
  const projectsListRef = useRef(null)
  
  const [kineticComplete, setKineticComplete] = useState(false)
  const [startProjectsAnim, setStartProjectsAnim] = useState(false)
  const [finalLeft, setFinalLeft] = useState(24)

  // State untuk mengontrol project detail modal
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      const W = window.innerWidth
      if (W >= 1152) {
        setFinalLeft((W - 1152) / 2 + 24)
      } else {
        setFinalLeft(24)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!active) {
      window.globalLenis?.start()
      setKineticComplete(false)
      setStartProjectsAnim(false)
      setSelectedProject(null)
      if (titleRef.current) {
        gsap.set(titleRef.current, {
          position: 'absolute',
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: window.innerWidth < 768 ? 1.33 : 3.33,
          fontSize: window.innerWidth < 768 ? '24px' : '24px',
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          textAlign: 'center',
          opacity: 0,
          color: '#4A1620',
          fontFamily: 'var(--font-display), "Archivo", sans-serif',
        })
      }
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0 })
      }
      if (listRef.current) {
        gsap.set(listRef.current, { opacity: 0, y: 30 })
      }
      if (projectsSectionRef.current) {
        gsap.set(projectsSectionRef.current, { opacity: 0, y: 0 })
      }
      if (projectsLineRef.current) {
        gsap.set(projectsLineRef.current, { scaleX: 0 })
      }
      if (projectsListRef.current) {
        gsap.set(projectsListRef.current, { opacity: 0, y: 30 })
      }
      return
    }

    // Kinetic Text Grid baru mulai main (active baru jadi true) - kunci
    // scroll sementara di sini. Tanpa ini, momentum/inersia dari Lenis
    // (smooth scroll) masih "meluncur" dikit selagi animasi Kinetic Text
    // main beberapa detik, jadi begitu animasinya selesai, posisi user udah
    // "kelewat" dari titik paling atas section Experiences - makanya harus
    // scroll manual lagi buat balik ke atas.
    window.globalLenis?.stop()

    // Set posisi awal Experiences di tengah layar saat aktif
    gsap.set(titleRef.current, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: window.innerWidth < 768 ? 1.33 : 3.33,
      fontSize: window.innerWidth < 768 ? '24px' : '24px',
      fontWeight: 700,
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      textAlign: 'center',
      opacity: 0,
      color: '#4A1620',
      fontFamily: 'var(--font-display), "Archivo", sans-serif',
    })
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0 })
    }
    if (listRef.current) {
      gsap.set(listRef.current, { opacity: 0, y: 30 })
    }
    if (projectsSectionRef.current) {
      gsap.set(projectsSectionRef.current, { opacity: 0, y: 0 })
    }
    if (projectsLineRef.current) {
      gsap.set(projectsLineRef.current, { scaleX: 0 })
    }
    if (projectsListRef.current) {
      gsap.set(projectsListRef.current, { opacity: 0, y: 30 })
    }
  }, [active])

  // ScrollTrigger untuk memicu munculnya seksi Projects (Page 2)
  // setelah Experiences (Page 1) mulai bergeser ke atas. Pakai scroller
  // default (window) sekarang - dulu di-arahkan ke container scroll
  // bersarang, tapi itu sudah dihapus (lihat SpaceTransitionScroll.jsx).
  useEffect(() => {
    if (!active) return

    const context = gsap.context(() => {
      gsap.fromTo(projectsSectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: projectsSectionRef.current,
            start: 'top 45%',
            toggleActions: 'play none none none',
            onEnter: () => {
              setStartProjectsAnim(true)
            }
          }
        }
      )
    }, containerRef)

    return () => context.revert()
  }, [active])

  const handleKineticComplete = () => {
    setKineticComplete(true)

    // Animasi Kinetic Text Grid udah selesai - baru di titik ini scroll
    // dibuka lagi, biar posisi user tetap presis di atas section Experiences
    // selama proses reveal (title settle, garis, list fade-in) berlangsung.
    window.globalLenis?.start()

    const context = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 1 })

      const tl = gsap.timeline()
      
      tl.to(titleRef.current, {
        left: finalLeft,
        top: '22vh',
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        fontSize: window.innerWidth < 768 ? '16px' : '24px',
        duration: 1.0,
        ease: 'power3.inOut',
      })
      .to(lineRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.4')
      .to(listRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3')
      
      setNavbarVisible?.(true)
    }, containerRef)
  }

  // Callback dipicu saat huruf-huruf Projects selesai skew-in
  const handleProjectsTitleComplete = () => {
    const context = gsap.context(() => {
      const tl = gsap.timeline()
      
      tl.to(projectsLineRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      })
      .to(projectsListRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3')
    }, containerRef)
  }

  return (
    <div ref={containerRef} className="w-full bg-cream text-[#4A1620] relative overflow-x-hidden">
      
      {/* Halaman 1: Experiences (Mengisi 1 layar penuh min-h-screen) */}
      <div className="min-h-screen relative w-full pt-[28vh] pb-24">
        {/* Teks Judul Experiences */}
        <p
          ref={titleRef}
          style={{
            margin: 0,
            padding: 0,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          EXPERIENCES
        </p>

        {/* Garis Pembatas Experiences */}
        <div
          ref={lineRef}
          className="absolute h-0.5 bg-[#4A1620]/25 z-20"
          style={{
            left: finalLeft,
            width: window.innerWidth - 2 * finalLeft,
            top: 'calc(22vh + 40px)',
            transformOrigin: 'left center',
          }}
        />

        {/* List Pengalaman */}
        <div ref={listRef} className="max-w-6xl w-full mx-auto px-6 opacity-0 relative z-10">
          <HoverImageReveal items={EXPERIENCES_DATA} textColor="#4A1620" dimColor="rgba(74, 22, 32, 0.35)" />
        </div>
      </div>

      {/* Halaman 2: Projects (Mengisi 1 layar penuh berikutnya min-h-screen) */}
      <div 
        ref={projectsSectionRef} 
        className="min-h-screen flex flex-col justify-center relative w-full py-24 opacity-0"
      >
        <div className="max-w-6xl w-full mx-auto px-6">
          
          {/* Projects Title (menggunakan SkewInText) */}
          <div className="flex items-center">
            <SkewInText 
              text="Projects"
              appearTrigger={startProjectsAnim ? "default" : "manual"}
              onLetterAnimationComplete={handleProjectsTitleComplete}
              font={{
                fontFamily: "var(--font-display), 'Archivo', sans-serif",
                fontWeight: 700,
                fontSize: window.innerWidth < 768 ? '16px' : '24px',
                lineHeight: "1.2em",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                textAlign: "left",
              }}
              color="#4A1620"
              width="auto"
              height="auto"
              startSkewX={-70}
              startX={300}
            />
          </div>

          {/* Garis Pembatas Projects */}
          <div
            ref={projectsLineRef}
            className="mt-4 h-0.5 w-full bg-[#4A1620]/25 origin-left"
            style={{
              transform: 'scaleX(0)',
            }}
          />

          {/* List Projects dengan Hover Image Reveal (period diganti "Contract" & cursorText "View") */}
          <div ref={projectsListRef} className="opacity-0 translate-y-10">
            <HoverImageReveal 
              items={PROJECTS_DATA} 
              textColor="#4A1620" 
              dimColor="rgba(74, 22, 32, 0.35)"
              cursorText="View"
              onItemClick={(item) => setSelectedProject(item.details)}
            />
          </div>
        </div>
      </div>

      {/* Halaman 3: Next Journey (Menuju seksi Summary) */}
      <NextJourneyExperiences 
        active={active && startProjectsAnim} 
        onNavigate={onNextJourney} 
        showCue={showNextJourneyCue}
      />

      {/* Grid Animasi Kinetic Text Grid (Appear Text) */}
      {active && !kineticComplete && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <KineticTextGrid onComplete={handleKineticComplete} />
        </div>
      )}

      {/* MODAL DETAIL PROJECT (Magnetic Carousel) */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-[#F8F1DC]/97 z-[999] backdrop-blur-md flex flex-col items-center justify-center p-6"
          onClick={() => setSelectedProject(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Container Magnetic Carousel */}
          <div 
            className="w-full max-w-6xl h-[500px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MagneticCarousel images={selectedProject.carouselImages} openSizeWidth={750} openSizeHeight={420} />
          </div>

          {/* Instruksi Pengguna */}
          <p className="mt-8 text-xs font-mono uppercase tracking-[0.2em] text-[#4A1620]/60 select-none animate-pulse">
            Click cards to expand/collapse • Click outside or button to close
          </p>

          {/* Tombol Tutup Silang di Kanan Atas (Dibuat sejajar dengan batas konten/hamburger menu) */}
          <div className="absolute top-28 left-0 right-0 max-w-6xl w-full mx-auto px-6 pointer-events-none z-50">
            <motion.div 
              onClick={(e) => {
                e.stopPropagation()
                setSelectedProject(null)
              }}
              role="button"
              className="absolute right-6 top-0 text-[#4A1620] cursor-pointer font-bold text-2xl flex items-center justify-center h-12 w-12 border border-[#4A1620]/25 rounded-full select-none pointer-events-auto"
              style={{ zIndex: 10000, cursor: "none" }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 90, 
                backgroundColor: "#4A1620", 
                borderColor: "#4A1620",
                color: "#F8F1DC" 
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              &times;
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Experiences
