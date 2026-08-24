import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Text3DFlip from '../ui/Text3DFlip'
import ScrollCue from '../hero/ScrollCue'

gsap.registerPlugin(ScrollTrigger)

function NextJourney({ active = false, onNavigate }) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const buttonTriggerRef = useRef(null)
  const buttonInnerRef = useRef(null)
  const scrollCueRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // 1. ScrollTrigger Entrance Animation
  useEffect(() => {
    if (!active) return

    const context = gsap.context(() => {
      // Inisialisasi awal
      gsap.set(titleRef.current, { opacity: 0, y: 50 })
      gsap.set(buttonTriggerRef.current, { opacity: 0, scale: 0.7 })
      gsap.set(scrollCueRef.current, { opacity: 0 })
 
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reset',
        },
      })
 
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(buttonTriggerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.5)',
      }, '-=0.5')
      .to(scrollCueRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')

      // Animasi fade out petunjuk scroll saat mendekati transisi keluar/zoom out
      gsap.to(scrollCueRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom 98%',
          end: 'bottom 88%',
          scrub: true,
        }
      })

    }, sectionRef)

    return () => context.revert()
  }, [active])

  // 2. Magnetic Hover Effect (Persis seperti Logo/Icon Navbar)
  const handleMouseMove = (e) => {
    const trigger = buttonTriggerRef.current
    if (!trigger) return

    setIsHovered(true)

    const rect = trigger.getBoundingClientRect()
    // Hitung posisi mouse relatif terhadap pusat area tombol
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    // Tarik elemen dalam ke arah mouse sebesar 35% kekuatan tarikan magnet
    gsap.to(buttonInnerRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)

    // Kembalikan ke pusat dengan efek elastis snap back yang dinamis
    gsap.to(buttonInnerRef.current, {
      x: 0,
      y: 0,
      duration: 0.85,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    })
  }

  return (
    <section
      ref={sectionRef}
      id="next-journey"
      className="relative z-20 flex h-screen w-full items-center justify-center overflow-hidden bg-transparent py-24 text-maroon"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 px-6 max-w-6xl mx-auto w-full">
        {/* Teks "Still Curious ?" di Sebelah Kiri (Stacked 2 Baris untuk Keseimbangan Visual) */}
        <h2
          ref={titleRef}
          className="font-display text-5xl md:text-7xl font-bold uppercase tracking-widest text-maroon select-none text-center md:text-left leading-[1.1] whitespace-pre-line"
        >
          Still
          <br className="hidden md:block" />
          Curious?
        </h2>

        {/* Area Trigger Magnetic Tombol Bulat Raksasa di Sebelah Kanan (Persis Screenshot) */}
        <div
          ref={buttonTriggerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-cursor-light="true"
          className="relative flex h-120 w-120 items-center justify-center pointer-events-auto cursor-pointer"
        >
          {/* Tombol Bulat Raksasa Bagian Dalam */}
          <button
            ref={buttonInnerRef}
            className={`group relative flex h-95 w-95 items-center justify-center rounded-full border transition-all duration-500 shadow-sm focus:outline-none pointer-events-none overflow-hidden ${
              isHovered 
                ? 'bg-maroon border-maroon' 
                : 'bg-transparent border-maroon/20'
            }`}
            style={{ willChange: 'transform' }}
          >
            {/* 1. Giant Background Text3DFlip (Hanya Muncul Saat Hovered - Fades & Scales In) */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ${
              isHovered ? 'opacity-[0.10] scale-100' : 'opacity-0 scale-95'
            }`}>
              {/* Squeeze width (scaleX 0.85) and stretch height (scaleY 1.15) */}
              <div 
                style={{ transform: 'scaleX(0.85) scaleY(1.15)', transformOrigin: 'center center' }} 
                className="whitespace-nowrap"
              >
                <Text3DFlip
                  text="Scroll Down"
                  font={{
                    fontFamily: '"Playball", cursive',
                    fontWeight: 400,
                    fontSize: "70px",
                    lineHeight: "1em",
                    textAlign: "center",
                  }}
                  color={isHovered ? "#F0E4C8" : "#4A1620"}
                  flipColor="#F0E4C8"
                  isHovered={isHovered}
                  animation="hover"
                  staggerDuration={0.03}
                />
              </div>
            </div>

            {/* 2. Smaller Foreground Text3DFlip (Sejajar dan Centered Sempurna) */}
            <div className="relative z-10 flex items-center justify-center w-full px-4">
              <Text3DFlip
                text="SCROLL DOWN"
                font={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.25em",
                  lineHeight: "1.1em",
                  textAlign: "center",
                }}
                color={isHovered ? "#F0E4C8" : "#4A1620"}
                flipColor="#F0E4C8"
                isHovered={isHovered}
                animation="hover"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Petunjuk scroll untuk user ke transisi luar angkasa */}
      <div ref={scrollCueRef} className="pointer-events-none">
        <ScrollCue visible={active} light={true} disableScrollTrigger={true} />
      </div>
    </section>
  )
}

export default NextJourney
