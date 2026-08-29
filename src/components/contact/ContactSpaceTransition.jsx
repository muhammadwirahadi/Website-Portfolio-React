import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Sparkles from '../hero/Sparkles'
import Contact from './Contact'

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

function ContactSpaceTransition({ active = false, onBack, setNavbarVisible, setLightTheme, setNavbarScrolled, setShowShootingStars, onResetApp }) {
  const containerRef = useRef(null)
  const heroPanRef = useRef(null)
  const heroVisualsRef = useRef(null)
  const topOverlayRef = useRef(null)
  const contactWrapRef = useRef(null)

  const [sparklesActive, setSparklesActive] = useState(true)
  const [isContactActive, setIsContactActive] = useState(false)
  const scrollTriggerRef = useRef(null)

  useEffect(() => {
    if (!active) return

    let context
    const timer = setTimeout(() => {
      if (!heroVisualsRef.current || !heroPanRef.current || !topOverlayRef.current || !contactWrapRef.current) {
        return
      }

      context = gsap.context(() => {
        const containerRect = heroPanRef.current.getBoundingClientRect()
        const containerCenterX = containerRect.width / 2
        const containerCenterY = containerRect.height / 2

        // Bintang Sheratan (Origin utama)
        const sheratanGroup = heroVisualsRef.current.querySelector('[data-star-id="sheratan"]')
        if (!sheratanGroup) return
        const sheratanIcon = sheratanGroup.querySelector('[data-star-icon]')
        if (!sheratanIcon) return
        const sheratanRect = sheratanIcon.getBoundingClientRect()
        const sheratanX = sheratanRect.left + sheratanRect.width / 2 - containerRect.left
        const sheratanY = sheratanRect.top + sheratanRect.height / 2 - containerRect.top
        const sheratanDeltaX = containerCenterX - sheratanX
        const sheratanDeltaY = containerCenterY - sheratanY

        // Bintang Mesarthim (Target)
        const mesarthimGroup = heroVisualsRef.current.querySelector('[data-star-id="mesarthim"]')
        if (!mesarthimGroup) return
        const mesarthimIcon = mesarthimGroup.querySelector('[data-star-icon]')
        if (!mesarthimIcon) return
        const mesarthimRect = mesarthimIcon.getBoundingClientRect()
        const mesarthimX = mesarthimRect.left + mesarthimRect.width / 2 - containerRect.left
        const mesarthimY = mesarthimRect.top + mesarthimRect.height / 2 - containerRect.top

        const travelScale = 6.5

        const travelForwardX = containerCenterX - (sheratanX + travelScale * (mesarthimX - sheratanX))
        const travelForwardY = containerCenterY - (sheratanY + travelScale * (mesarthimY - sheratanY))

        const finalMesarthimX = containerCenterX - (sheratanX + 330 * (mesarthimX - sheratanX))
        const finalMesarthimY = containerCenterY - (sheratanY + 330 * (mesarthimY - sheratanY))

        // 2. Setup Posisi Awal
        gsap.set(heroVisualsRef.current, {
          scale: 330,
          transformOrigin: `${sheratanX}px ${sheratanY}px`,
        })
        gsap.set(heroPanRef.current, {
          x: sheratanDeltaX,
          y: sheratanDeltaY,
        })
        gsap.set(topOverlayRef.current, { opacity: 1 })
        gsap.set(contactWrapRef.current, { opacity: 0 })

        gsap.set('.glow-path-line-contact', { strokeDashoffset: 85 })

        // 3. Buat ScrollTrigger Timeline
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

              if (self.progress <= 0.05) {
                setNavbarVisible?.(true)
              } else if (self.progress >= 0.90) {
                // Let Contact.jsx handle navbar reveal after entrance animations
              } else {
                setNavbarVisible?.(false)
              }

              if (self.progress <= 0.05 || self.progress >= 0.85) {
                setLightTheme?.(true)
              } else {
                setLightTheme?.(false)
              }

              setShowShootingStars?.(self.progress <= 0.05)
              setSparklesActive(self.progress < 0.90)
            },
            onLeave: () => {
              setIsContactActive(true)
              gsap.to(contactWrapRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
              })
            },
            onEnterBack: () => {
              setIsContactActive(false)
              gsap.set(contactWrapRef.current, { opacity: 0 })
            },
            onLeaveBack: () => {
              setIsContactActive(false)
              setNavbarVisible?.(true)
              setLightTheme?.(true)
              setShowShootingStars?.(true)
              setSparklesActive(true)
            },
          },
        })

        // STAGE 1: Zoom out & memudarkan top overlay krem
        tl.to(topOverlayRef.current, { opacity: 0, ease: 'power1.inOut', duration: 0.25 }, 0)
          .fromTo(heroVisualsRef.current, { scale: 330 }, { scale: travelScale, ease: 'power2.out', duration: 0.25 }, 0)

          // STAGE 2: Gambar garis rasi bintang neon & traveling kamera ke Mesarthim
          .fromTo('.glow-path-line-contact', { strokeDashoffset: 85 }, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.35 }, 0.25)
          .fromTo(
            heroPanRef.current,
            { x: sheratanDeltaX, y: sheratanDeltaY },
            { x: travelForwardX, y: travelForwardY, ease: 'power2.inOut', duration: 0.35 },
            0.25
          )

          // STAGE 3: Zoom-in tajam ke Mesarthim
          .fromTo(heroVisualsRef.current, { scale: travelScale }, { scale: 330, ease: 'power2.inOut', duration: 0.4 }, 0.6)
          .fromTo(
            heroPanRef.current,
            { x: travelForwardX, y: travelForwardY },
            { x: finalMesarthimX, y: finalMesarthimY, ease: 'power2.inOut', duration: 0.4 },
            0.6
          )

        ScrollTrigger.refresh()
      }, containerRef.current)
    }, 50)

    return () => {
      clearTimeout(timer)
      if (context) context.revert()
    }
  }, [active])

  useEffect(() => {
    if (!isContactActive) return

    const handleWindowScroll = () => {
      const scrollTop = window.scrollY
      const st = scrollTriggerRef.current
      if (!st) return
      setNavbarScrolled?.(scrollTop > st.end + 15)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [isContactActive])

  const handleBackToHome = () => {
    onResetApp?.()
  }

  return (
    <>
      <section
        ref={containerRef}
        id="contact"
        className="relative z-30 h-screen w-screen overflow-hidden bg-maroon"
      >
        <style>{`
          #contact {
            top: -2px !important;
            height: calc(100vh + 4px) !important;
          }
        `}</style>

        <Sparkles className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60" active={sparklesActive} />

        <div ref={heroPanRef} className="absolute inset-0 h-full w-full pointer-events-none z-10">
          <div ref={heroVisualsRef} className="absolute inset-0 h-full w-full">
            <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="transStarGlowScrollContact" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F8F1DC" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </radialGradient>
              </defs>

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

              <line
                className="glow-path-line-contact"
                x1="925"
                y1="530"
                x2="965"
                y2="605"
                stroke="#D4AF37"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeDasharray="85"
                strokeDashoffset="85"
              />

              {STARS.map((star) => {
                const isMesarthim = star.id === 'mesarthim'
                const size = star.radius * (isMesarthim ? 6.5 : 5)
                const scale = size / 24
                return (
                  <g key={star.id} data-star-id={star.id}>
                    <circle cx={star.cx} cy={star.cy} r={star.radius * 6.5} fill="url(#transStarGlowScrollContact)" />

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

                    <g transform={`translate(${star.cx}, ${star.cy})`} data-star-icon>
                      <path
                        d={SPARKLE_PATH}
                        fill={isMesarthim ? '#F8F1DC' : '#F0E4C8'}
                        transform={`scale(${scale}) translate(-12, -12)`}
                      />
                    </g>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <div ref={topOverlayRef} className="pointer-events-none absolute inset-0 z-20 bg-cream" />
      </section>

      {/* Section konten Contact sesungguhnya - NORMAL FLOW */}
      <div ref={contactWrapRef} id="contact-content" className="relative z-30 opacity-0 -mt-[100vh]">
        <Contact active={isContactActive} onBack={onBack} setNavbarVisible={setNavbarVisible} onBackToHome={handleBackToHome} />
      </div>
    </>
  )
}

export default ContactSpaceTransition
