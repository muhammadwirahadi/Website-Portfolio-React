import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Sparkles from '../hero/Sparkles'
import ScrollCue from '../hero/ScrollCue'
import Experiences from './Experiences'

gsap.registerPlugin(ScrollTrigger)

const STARS = [
  { id: '41-ari', cx: 625, cy: 370, radius: 3.2, label: '41 Arietis' },
  { id: 'hamal', cx: 765, cy: 440, radius: 5.4, label: 'Hamal' },
  { id: 'sheratan', cx: 925, cy: 530, radius: 3.8, label: 'Sheratan' },
  { id: 'mesarthim', cx: 965, cy: 605, radius: 3, label: 'Mesarthim' },
]

const LINES = [
  { from: { x: 625, y: 370 }, to: { x: 765, y: 440 } },
  { from: { x: 765, y: 440 }, to: { x: 925, y: 530 } },
  { from: { x: 925, y: 530 }, to: { x: 965, y: 605 } },
]

const SPARKLE_PATH =
  'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'

function SpaceTransitionScroll({ active = false, onBack, setNavbarVisible, setLightTheme, setNavbarScrolled, setShowShootingStars }) {
  const containerRef = useRef(null)
  const heroPanRef = useRef(null)
  const heroVisualsRef = useRef(null)
  const topOverlayRef = useRef(null)
  const experiencesRef = useRef(null)
  
  // State untuk mematikan canvas Sparkles di halaman Experiences demi efisiensi render
  const [sparklesActive, setSparklesActive] = useState(true)

  // State untuk mengontrol kemunculan ScrollCue petunjuk scroll
  const [showScrollCue, setShowScrollCue] = useState(false)

  useEffect(() => {
    if (!active) return

    let context;
    console.log('SpaceTransitionScroll: useEffect mounted (active=true)')
    const timer = setTimeout(() => {
      console.log('SpaceTransitionScroll: timer fired, refs:', {
        heroVisuals: heroVisualsRef.current,
        heroPan: heroPanRef.current,
        topOverlay: topOverlayRef.current,
        experiences: experiencesRef.current
      })
      if (!heroVisualsRef.current || !heroPanRef.current || !topOverlayRef.current || !experiencesRef.current) {
        console.log('SpaceTransitionScroll: refs check failed, returning early')
        return
      }

      context = gsap.context(() => {
        // 1. Dapatkan posisi fisik bintang & container dari DOM agar presisi di semua resolusi layar
        const containerRect = heroPanRef.current.getBoundingClientRect()
        const containerCenterX = containerRect.width / 2
        const containerCenterY = containerRect.height / 2

        // Bintang 41-ari (Origin utama)
        const ariGroup = heroVisualsRef.current.querySelector('[data-star-id="41-ari"]')
        if (!ariGroup) return
        const ariIcon = ariGroup.querySelector('[data-star-icon]')
        if (!ariIcon) return
        const ariRect = ariIcon.getBoundingClientRect()
        const ariX = ariRect.left + ariRect.width / 2 - containerRect.left
        const ariY = ariRect.top + ariRect.height / 2 - containerRect.top
        const ariDeltaX = containerCenterX - ariX
        const ariDeltaY = containerCenterY - ariY

        // Bintang Hamal (Target)
        const hamalGroup = heroVisualsRef.current.querySelector('[data-star-id="hamal"]')
        if (!hamalGroup) return
        const hamalIcon = hamalGroup.querySelector('[data-star-icon]')
        if (!hamalIcon) return
        const hamalRect = hamalIcon.getBoundingClientRect()
        const hamalX = hamalRect.left + hamalRect.width / 2 - containerRect.left
        const hamalY = hamalRect.top + hamalRect.height / 2 - containerRect.top

        // Nilai scale konstan selama traveling
        const travelScale = 6.5

        // Hitung pan offset untuk traveling sepanjang garis rasi bintang
        const travelForwardX = containerCenterX - (ariX + travelScale * (hamalX - ariX))
        const travelForwardY = containerCenterY - (ariY + travelScale * (hamalY - ariY))

        // Hitung pan offset akhir saat zoom-in maksimal ke Hamal (scale 330)
        const finalHamalX = containerCenterX - (ariX + 330 * (hamalX - ariX))
        const finalHamalY = containerCenterY - (ariY + 330 * (hamalY - ariY))

        // 2. Setup Posisi Awal
        gsap.set(heroVisualsRef.current, {
          scale: 330,
          transformOrigin: `${ariX}px ${ariY}px`,
        })
        gsap.set(heroPanRef.current, {
          x: ariDeltaX,
          y: ariDeltaY,
        })
        gsap.set(topOverlayRef.current, { opacity: 1 })
        gsap.set(experiencesRef.current, { opacity: 0, pointerEvents: 'none' })
        
        // Atur posisi awal untuk kedua garis neon (tanpa drop-shadow filter agar sangat ringan di GPU)
        gsap.set('.glow-path-line', { strokeDashoffset: 157 })

        console.log('SpaceTransitionScroll: Creating ScrollTrigger timeline')
        // 3. Buat ScrollTrigger Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=300%', // Panjang gulir untuk kenyamanan transisi
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              // Sembunyikan navbar selama transisi, tampilkan di awal (About) dan akhir (Experiences)
              if (self.progress <= 0.05 || self.progress >= 0.90) {
                setNavbarVisible?.(true)
              } else {
                setNavbarVisible?.(false)
              }

              // Switch warna tema navbar saat mencapai wilayah krem (About di awal, Experiences di akhir)
              if (self.progress <= 0.05 || self.progress >= 0.85) {
                setLightTheme?.(true)
              } else {
                setLightTheme?.(false)
              }

              // Matikan shooting stars begitu masuk area transisi antariksa (progress > 0.05)
              if (self.progress <= 0.05) {
                setShowShootingStars?.(true)
              } else {
                setShowShootingStars?.(false)
              }

              // Matikan sparkles setelah halaman Experiences selesai memudar masuk (progress >= 0.90)
              if (self.progress >= 0.90) {
                setSparklesActive(false)
              } else {
                setSparklesActive(true)
              }

              // Toggle navbar scrolled state (hamburger vs inline links) & scroll cue
              if (self.progress >= 0.90) {
                const scrollTop = experiencesRef.current?.scrollTop || 0
                setNavbarScrolled?.(scrollTop > 15)
                setShowScrollCue?.(scrollTop <= 15)
              } else {
                setNavbarScrolled?.(true)
                setShowScrollCue?.(false)
              }
            },
            onLeaveBack: () => {
              // Proteksi saat user scroll balik ke atas melewati batas awal transisi
              setNavbarVisible?.(true)
              setLightTheme?.(true)
              setShowShootingStars?.(true)
              setSparklesActive(true)
              setNavbarScrolled?.(true)
              setShowScrollCue?.(false)
            }
          }
        })

        // STAGE 1: Zoom out & memudarkan top overlay krem
        tl.to(topOverlayRef.current, {
          opacity: 0,
          ease: 'power1.inOut',
          duration: 0.25,
        }, 0)
        .fromTo(heroVisualsRef.current, {
          scale: 330,
        }, {
          scale: travelScale,
          ease: 'power2.out',
          duration: 0.25,
        }, 0)

        // STAGE 2: Gambar garis rasi bintang neon & traveling kamera ke Hamal
        .fromTo('.glow-path-line', {
          strokeDashoffset: 157,
        }, {
          strokeDashoffset: 0,
          ease: 'power1.inOut',
          duration: 0.35,
        }, 0.25)
        .fromTo(heroPanRef.current, {
          x: ariDeltaX,
          y: ariDeltaY,
        }, {
          x: travelForwardX,
          y: travelForwardY,
          ease: 'power2.inOut',
          duration: 0.35,
        }, 0.25)

        // STAGE 3: Zoom-in tajam ke Hamal & memudarkan halaman Experiences masuk
        .fromTo(heroVisualsRef.current, {
          scale: travelScale,
        }, {
          scale: 330,
          ease: 'power2.inOut',
          duration: 0.40,
        }, 0.60)
        .fromTo(heroPanRef.current, {
          x: travelForwardX,
          y: travelForwardY,
        }, {
          x: finalHamalX,
          y: finalHamalY,
          ease: 'power2.inOut',
          duration: 0.40,
        }, 0.60)
        .to(experiencesRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          ease: 'power2.inOut',
          duration: 0.25,
        }, 0.75)

        ScrollTrigger.refresh()
      }, containerRef.current)
    }, 50)

    return () => {
      clearTimeout(timer)
      if (context) context.revert()
    }
  }, [active])

  const handleExperiencesScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop
    setNavbarScrolled?.(scrollTop > 15)
    setShowScrollCue?.(scrollTop <= 15)
  }

  return (
    <section 
      ref={containerRef} 
      id="space-transition"
      className="relative z-30 h-screen w-screen overflow-hidden bg-maroon"
    >
      {/* Background Sparkles Particles (dimatikan secara dinamis ketika di halaman Experiences) */}
      <Sparkles className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60" active={sparklesActive} />

      {/* Peta Rasi Bintang */}
      <div ref={heroPanRef} className="absolute inset-0 h-full w-full pointer-events-none z-10">
        <div ref={heroVisualsRef} className="absolute inset-0 h-full w-full">
          <svg 
            viewBox="0 0 1600 900" 
            className="h-full w-full" 
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="transStarGlowScroll" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F8F1DC" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Rasi Bintang Aries Lines */}
            {LINES.map((line, idx) => (
              <line
                key={idx}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="#D4AF37"
                strokeWidth="1.4"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            ))}

            {/* Neon Draw Line (41-ari <-> Hamal) - Garis emas tipis solid (tanpa glow filter/overlay agar ringan) */}
            <line
              className="glow-path-line"
              x1="625"
              y1="370"
              x2="765"
              y2="440"
              stroke="#D4AF37"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="157"
              strokeDashoffset="157"
            />

            {/* Bintang-bintang Rasi */}
            {STARS.map((star) => {
              const isHamal = star.id === 'hamal'
              const size = star.radius * (isHamal ? 6.5 : 5)
              const scale = size / 24
              return (
                <g key={star.id} data-star-id={star.id}>
                  {/* Halo Glow */}
                  <circle
                    cx={star.cx}
                    cy={star.cy}
                    r={star.radius * 6.5}
                    fill="url(#transStarGlowScroll)"
                  />
                  
                  {/* Teks Label Bintang */}
                  <g className="pointer-events-none">
                    <text
                      x={star.cx}
                      y={star.cy - (size / 2 + 16)}
                      textAnchor="middle"
                      fontFamily="Archivo, sans-serif"
                      fontSize="14"
                      fontWeight="600"
                      letterSpacing="0.4"
                      stroke="#4A1620"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      fill="none"
                    >
                      {star.label}
                    </text>
                    <text
                      x={star.cx}
                      y={star.cy - (size / 2 + 16)}
                      textAnchor="middle"
                      fontFamily="Archivo, sans-serif"
                      fontSize="14"
                      fontWeight="600"
                      letterSpacing="0.4"
                      fill="#F0E4C8"
                    >
                      {star.label}
                    </text>
                  </g>

                  {/* Sparkle Icon */}
                  <g transform={`translate(${star.cx}, ${star.cy})`} data-star-icon>
                    <path
                      d={SPARKLE_PATH}
                      fill={isHamal ? '#F8F1DC' : '#F0E4C8'}
                      transform={`scale(${scale}) translate(-12, -12)`}
                    />
                  </g>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Top Cream Color Transition Overlay (matches NextJourney cream bg) */}
      <div 
        ref={topOverlayRef} 
        className="pointer-events-none absolute inset-0 z-20 bg-cream"
      />

      {/* Experiences Page Content (Fades in at the end of Hamal zoom-in) */}
      <div 
        ref={experiencesRef} 
        onScroll={handleExperiencesScroll}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 overflow-y-auto"
      >
        <Experiences onBack={onBack} />
        
        {/* Scroll Cue (petunjuk scroll ke bawah, hilang saat mulai discroll) */}
        <ScrollCue visible={showScrollCue} light={true} disableScrollTrigger={true} />
      </div>
    </section>
  )
}

export default SpaceTransitionScroll
