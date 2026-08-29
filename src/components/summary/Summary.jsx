import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NextJourneySummary from './NextJourneySummary'

gsap.registerPlugin(ScrollTrigger)

function Summary({ active = false, onBack, setNavbarVisible, scrollerRef, onNextJourney }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const lineRef = useRef(null)
  const contentRef = useRef(null)
  const [startSummaryAnim, setStartSummaryAnim] = useState(false)

  // 1. Entrance animation for Summary Title & Content
  useEffect(() => {
    if (!active) {
      // Reset GSAP styles
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: 30 })
      if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0 })
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 0, y: 30 })
      setStartSummaryAnim(false)
      return
    }

    gsap.set(titleRef.current, { opacity: 0, y: 30 })
    gsap.set(contentRef.current, { opacity: 0, y: 30 })

    const tl = gsap.timeline({ delay: 0.1 })

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to(lineRef.current, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.5')
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        setStartSummaryAnim(true)
        setNavbarVisible?.(true)
      }
    }, '-=0.4')

  }, [active, setNavbarVisible])

  return (
    <div ref={containerRef} className="w-full bg-cream text-[#4A1620] relative overflow-x-hidden">
      {/* Halaman 1: Summary Content (min-h-screen) */}
      <div className="min-h-screen flex flex-col justify-center relative w-full py-24">
        {/* Header Section */}
        <div className="max-w-6xl w-full mx-auto px-6 relative">
          <div ref={titleRef} className="opacity-0">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#4A1620]">
              SUMMARY
            </h2>
          </div>
          <span 
            ref={lineRef}
            className="block h-[1px] w-full bg-[#4A1620]/25 mt-4 origin-left scale-x-0" 
          />
        </div>

        {/* Content Section */}
        <div 
          ref={contentRef}
          className="max-w-6xl w-full mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 opacity-0"
        >
          {/* Left Column: Personal Narrative Statement */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-[#4A1620] tracking-wide">
              Saya adalah pengembang web yang berfokus pada ekosistem JavaScript modern dan arsitektur backend yang andal. Memiliki pengalaman nyata dalam membangun platform pendaftaran magang terintegrasi, perancangan database relasional yang kompleks, serta integrasi visual interaktif menggunakan framework terdepan.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-[#4A1620]/80">
              Dengan latar belakang kuat dalam memecahkan masalah struktural database dan mengoptimalkan interaksi antarmuka pengguna, saya berdedikasi untuk menciptakan produk digital yang tidak hanya fungsional secara komparatif tetapi juga menghadirkan pengalaman pengguna (*user experience*) kelas premium.
            </p>
          </div>

          {/* Right Column: Key Focus & Core Competencies */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#4A1620]/60 mb-3">
                Core Specialization
              </h3>
              <ul className="flex flex-col gap-3 font-display text-lg font-medium text-[#4A1620]">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4A1620]" />
                  Fullstack Web Applications (Laravel, Vue.js, Inertia.js)
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4A1620]" />
                  Advanced UI/UX Motion Design (GSAP, Framer Motion)
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4A1620]" />
                  Database Engineering & RESTful API Architectures
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#4A1620]/60 mb-3">
                Key Accomplishments
              </h3>
              <div className="flex flex-col gap-4">
                <div className="border-l-2 border-[#4A1620]/20 pl-4 py-1">
                  <h4 className="font-bold text-sm">Sistem Informasi SI-LSF</h4>
                  <p className="text-xs text-[#4A1620]/75 mt-1">Mengintegrasikan sistem pendaftaran & logbook harian mahasiswa magang Lembaga Sensor Film RI secara terpusat.</p>
                </div>
                <div className="border-l-2 border-[#4A1620]/20 pl-4 py-1">
                  <h4 className="font-bold text-sm">Portal Magang Badilag</h4>
                  <p className="text-xs text-[#4A1620]/75 mt-1">Merancang arsitektur database relasional ERD & RBAC multi-role untuk pendaftaran magang Ditjen Badilag Mahkamah Agung.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Halaman 2: Next Journey (Menuju seksi Contact) */}
      <NextJourneySummary 
        active={active && startSummaryAnim} 
        onNavigate={onNextJourney} 
        scrollerRef={scrollerRef}
      />
    </div>
  )
}

export default Summary
