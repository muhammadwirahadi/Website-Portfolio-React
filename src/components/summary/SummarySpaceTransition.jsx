import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Sparkles from '../hero/Sparkles'
import ScrollCue from '../hero/ScrollCue'
import Summary from './Summary'

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

function SummarySpaceTransition({ active = false, onBack, setNavbarVisible, setLightTheme, setNavbarScrolled, setShowShootingStars, onNextJourney }) {
  const containerRef = useRef(null)
  const heroPanRef = useRef(null)
  const heroVisualsRef = useRef(null)
  const topOverlayRef = useRef(null)
  const summaryRef = useRef(null)
  
  const [sparklesActive, setSparklesActive] = useState(true)
  const [showScrollCue, setShowScrollCue] = useState(false)
  const [isSummaryActive, setIsSummaryActive] = useState(false)
  const scrollTriggerRef = useRef(null)
  const lenisSummaryRef = useRef(null)

  useEffect(() => {
    if (!active) return

    let context;
    console.log('SummarySpaceTransition: useEffect mounted (active=true)')
    const timer = setTimeout(() => {
      if (!heroVisualsRef.current || !heroPanRef.current || !topOverlayRef.current || !summaryRef.current) {
        console.log('SummarySpaceTransition: refs check failed, returning early')
        return
      }

      context = gsap.context(() => {
        const containerRect = heroPanRef.current.getBoundingClientRect()
        const containerCenterX = containerRect.width / 2
        const containerCenterY = containerRect.height / 2

        // Bintang Hamal (Origin)
        const hamalGroup = heroVisualsRef.current.querySelector('[data-star-id="hamal"]')
        if (!hamalGroup) return
        const hamalIcon = hamalGroup.querySelector('[data-star-icon]')
        if (!hamalIcon) return
        const hamalRect = hamalIcon.getBoundingClientRect()
        const hamalX = hamalRect.left + hamalRect.width / 2 - containerRect.left
        const hamalY = hamalRect.top + hamalRect.height / 2 - containerRect.top
        const hamalDeltaX = containerCenterX - hamalX
        const hamalDeltaY = containerCenterY - hamalY

        // Bintang Sheratan (Target)
        const sheratanGroup = heroVisualsRef.current.querySelector('[data-star-id="sheratan"]')
        if (!sheratanGroup) return
        const sheratanIcon = sheratanGroup.querySelector('[data-star-icon]')
        if (!sheratanIcon) return
        const sheratanRect = sheratanIcon.getBoundingClientRect()
        const sheratanX = sheratanRect.left + sheratanRect.width / 2 - containerRect.left
        const sheratanY = sheratanRect.top + sheratanRect.height / 2 - containerRect.top

        const travelScale = 6.5

        // Panning offset sepanjang garis Hamal -> Sheratan
        const travelForwardX = containerCenterX - (hamalX + travelScale * (sheratanX - hamalX))
        const travelForwardY = containerCenterY - (hamalY + travelScale * (sheratanY - hamalY))

        // Panning offset akhir pada zoom-in maksimal ke Sheratan (skala 330)
        const finalSheratanX = containerCenterX - (hamalX + 330 * (sheratanX - hamalX))
        const finalSheratanY = containerCenterY - (hamalY + 330 * (sheratanY - hamalY))

        // Setup Posisi Awal (Terkunci pada Hamal)
        gsap.set(heroVisualsRef.current, {
          scale: 330,
          transformOrigin: `${hamalX}px ${hamalY}px`,
        })
        gsap.set(heroPanRef.current, {
          x: hamalDeltaX,
          y: hamalDeltaY,
        })
        gsap.set(topOverlayRef.current, { opacity: 1 })
        gsap.set(summaryRef.current, { opacity: 0, pointerEvents: 'none' })
        
        // Garis neon penghubung (Hamal -> Sheratan) - panjang 184px (dasharray 200/dashoffset 200)
        gsap.set('.glow-path-line-summary', { strokeDashoffset: 200 })

        // Buat ScrollTrigger Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              scrollTriggerRef.current = self
              setIsSummaryActive(self.progress >= 0.90)

              // Tampilkan navbar pada awal (saat meninggalkan Experiences) dan akhir (Summary)
              if (self.progress <= 0.05) {
                setNavbarVisible?.(true)
              } else if (self.progress >= 0.90) {
                // Navbar visible diatur sinkron oleh Summary.jsx
              } else {
                setNavbarVisible?.(false)
              }

              // Tema warna navbar
              if (self.progress <= 0.05 || self.progress >= 0.85) {
                setLightTheme?.(true)
              } else {
                setLightTheme?.(false)
              }

              // Pemicu shooting stars
              if (self.progress <= 0.05) {
                setShowShootingStars?.(true)
              } else {
                setShowShootingStars?.(false)
              }

              // Sparkles active
              if (self.progress >= 0.90) {
                setSparklesActive(false)
              } else {
                setSparklesActive(true)
              }

              // Scroll cue & scrolled navbar state
              if (self.progress >= 0.90) {
                const scrollTop = summaryRef.current?.scrollTop || 0
                setNavbarScrolled?.(scrollTop > 15)
                setShowScrollCue?.(scrollTop <= 15)
              } else {
                setNavbarScrolled?.(true)
                setShowScrollCue?.(false)
              }
            },
            onLeaveBack: () => {
              setIsSummaryActive(false)
              setNavbarVisible?.(true)
              setLightTheme?.(true)
              setShowShootingStars?.(true)
              setSparklesActive(true)
              setNavbarScrolled?.(true)
              setShowScrollCue?.(false)
              onBack?.() // Mundur ke Experiences page
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

        // STAGE 2: Panning kamera ke Sheratan & gambar garis neon
        .fromTo('.glow-path-line-summary', {
          strokeDashoffset: 200,
        }, {
          strokeDashoffset: 0,
          ease: 'power1.inOut',
          duration: 0.35,
        }, 0.25)
        .fromTo(heroPanRef.current, {
          x: hamalDeltaX,
          y: hamalDeltaY,
        }, {
          x: travelForwardX,
          y: travelForwardY,
          ease: 'power2.inOut',
          duration: 0.35,
        }, 0.25)

        // STAGE 3: Zoom-in tajam ke Sheratan & memudarkan Summary masuk
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
          x: finalSheratanX,
          y: finalSheratanY,
          ease: 'power2.inOut',
          duration: 0.40,
        }, 0.60)
        .to(summaryRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          ease: 'power2.inOut',
          duration: 0.25,
        }, 0.75)

        ScrollTrigger.refresh()
      }, containerRef)
    }, 50)

    return () => {
      clearTimeout(timer)
      if (context) context.revert()
    }
  }, [active])

  // 1. Inisialisasi Lenis khusus seksi Summary ketika aktif
  useEffect(() => {
    const el = summaryRef.current
    if (!el || !isSummaryActive) return

    const lenisSummary = new Lenis({
      wrapper: el,
      content: el.firstElementChild || el,
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    })

    lenisSummaryRef.current = lenisSummary
    lenisSummary.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time) => {
      lenisSummary.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenisSummary.destroy()
      lenisSummaryRef.current = null
    }
  }, [isSummaryActive])

  // 2. Handle event propagation untuk wheel/touch events inside Summary container
  // agar window scroller (Lenis global) dilewati ketika sedang berada di dalam Summary.
  useEffect(() => {
    const el = summaryRef.current
    if (!el) return

    const handleWheel = (e) => {
      const st = scrollTriggerRef.current
      const progress = st ? st.progress : 0
      if (progress < 0.95) return

      const { scrollTop, scrollHeight, clientHeight } = el
      const maxScroll = scrollHeight - clientHeight

      if (e.deltaY > 0) {
        // Scrolling down
        if (scrollTop < maxScroll - 15) {
          lenisSummaryRef.current?.start()
          e.stopPropagation()
        } else {
          // Jika sudah mencapai dasar, matikan Lenis lokal, gulirkan window secara manual, dan stop event lokal
          lenisSummaryRef.current?.stop()
          if (window.globalLenis) {
            window.globalLenis.scrollTo(window.globalLenis.scroll + e.deltaY)
          }
          e.stopPropagation()
          e.preventDefault()
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        if (scrollTop > 15) {
          lenisSummaryRef.current?.start()
          e.stopPropagation()
        } else {
          // Jika sudah mencapai paling atas, matikan Lenis lokal, gulirkan window secara manual ke atas
          lenisSummaryRef.current?.stop()
          if (window.globalLenis) {
            window.globalLenis.scrollTo(window.globalLenis.scroll + e.deltaY)
          }
          e.stopPropagation()
          e.preventDefault()
        }
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e) => {
      const st = scrollTriggerRef.current
      const progress = st ? st.progress : 0
      if (progress < 0.95) return

      if (e.touches.length > 0) {
        const touchEndY = e.touches[0].clientY
        const deltaY = touchStartY - touchEndY
        const { scrollTop, scrollHeight, clientHeight } = el
        const maxScroll = scrollHeight - clientHeight

        if (deltaY > 0) {
          // Swiping up (scrolling down)
          if (scrollTop < maxScroll - 15) {
            lenisSummaryRef.current?.start()
            e.stopPropagation()
          } else {
            lenisSummaryRef.current?.stop()
            if (window.globalLenis) {
              window.globalLenis.scrollTo(window.globalLenis.scroll + deltaY)
            }
            e.stopPropagation()
            e.preventDefault()
          }
        } else if (deltaY < 0) {
          // Swiping down (scrolling up)
          if (scrollTop > 15) {
            lenisSummaryRef.current?.start()
            e.stopPropagation()
          } else {
            lenisSummaryRef.current?.stop()
            if (window.globalLenis) {
              window.globalLenis.scrollTo(window.globalLenis.scroll + deltaY)
            }
            e.stopPropagation()
            e.preventDefault()
          }
        }
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const handleSummaryScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop
    setNavbarScrolled?.(scrollTop > 15)
    setShowScrollCue?.(scrollTop <= 15)
  }

  return (
    <section 
      ref={containerRef} 
      id="summary"
      className="relative z-30 h-screen w-screen overflow-hidden bg-maroon -mt-px"
    >
      <style>{`
        #summary {
          top: -2px !important;
          height: calc(100vh + 4px) !important;
        }
      `}</style>
      {/* Background Sparkles Particles */}
      <Sparkles className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60" active={sparklesActive} />

      {/* Peta Rasi Bintang */}
      <div ref={heroPanRef} className="absolute -top-px left-0 w-full h-[calc(100%+2px)] pointer-events-none z-10">
        <div ref={heroVisualsRef} className="absolute inset-0 h-full w-full">
          <svg 
            viewBox="0 0 1600 900" 
            className="h-full w-full" 
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="transStarGlowScrollSummary" cx="50%" cy="50%" r="50%">
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

            {/* Neon Draw Line (Hamal <-> Sheratan) - panjang 184px (dasharray 200/dashoffset 200) */}
            <line
              className="glow-path-line-summary"
              x1="765"
              y1="440"
              x2="925"
              y2="530"
              stroke="#D4AF37"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
            />

            {/* Bintang-bintang Rasi */}
            {STARS.map((star) => {
              const isSheratan = star.id === 'sheratan'
              const size = star.radius * (isSheratan ? 6.5 : 5)
              const scale = size / 24
              return (
                <g key={star.id} data-star-id={star.id}>
                  {/* Halo Glow */}
                  <circle
                    cx={star.cx}
                    cy={star.cy}
                    r={star.radius * 6.5}
                    fill="url(#transStarGlowScrollSummary)"
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
                      fill="#F8F1DC"
                    >
                      {star.label}
                    </text>
                  </g>

                  {/* Sparkle Icon (Matches Experiences/About star icon shapes) */}
                  <g transform={`translate(${star.cx}, ${star.cy})`} data-star-icon>
                    <path
                      d={SPARKLE_PATH}
                      fill={isSheratan ? '#F8F1DC' : '#F0E4C8'}
                      transform={`scale(${scale}) translate(-12, -12)`}
                    />
                  </g>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Top Cream Color Transition Overlay */}
      <div 
        ref={topOverlayRef} 
        className="pointer-events-none absolute inset-0 z-20 bg-cream"
      />

      {/* Summary Page Content */}
      <div 
        ref={summaryRef} 
        onScroll={handleSummaryScroll}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 overflow-y-auto"
      >
        <Summary 
          active={isSummaryActive} 
          onBack={onBack} 
          setNavbarVisible={setNavbarVisible} 
          scrollerRef={summaryRef} 
          onNextJourney={onNextJourney} 
        />
        
        <ScrollCue visible={showScrollCue} light={true} disableScrollTrigger={true} />
      </div>
    </section>
  )
}

export default SummarySpaceTransition
