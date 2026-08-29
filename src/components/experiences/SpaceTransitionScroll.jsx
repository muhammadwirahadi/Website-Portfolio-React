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

// CATATAN ARSITEKTUR: dulu section Experiences dirender di DALAM section
// yang di-pin ini, dengan overflow-y-auto + Lenis instance sendiri untuk
// scroll internal, plus handler wheel/touch manual buat "oper" scroll ke
// halaman utama begitu mentok bawah. Itu bikin 2 sistem smooth-scroll
// (Lenis global + Lenis lokal) rebutan kontrol, dan scroll suka "nyangkut"
// karena keputusan oper-scrollnya bergantung ke progress animasi zoom yang
// nilainya nge-lag (efek dari scrub).
//
// Sekarang disederhanakan: section pin ini CUMA berisi animasi zoom
// sinematiknya doang (durasinya pendek & tetap). Konten Experiences
// sungguhan dirender sebagai section terpisah SETELAHNYA, mengikuti alur
// scroll utama halaman (sama seperti pola Education/Skills) - jadi cuma ada
// SATU sistem scroll (Lenis global) yang mengatur semuanya, tidak ada lagi
// container scroll bersarang.
function SpaceTransitionScroll({ active = false, onBack, setNavbarVisible, setLightTheme, setNavbarScrolled, setShowShootingStars, onNextJourney }) {
  const containerRef = useRef(null)
  const heroPanRef = useRef(null)
  const heroVisualsRef = useRef(null)
  const topOverlayRef = useRef(null)
  const experiencesWrapRef = useRef(null)

  // State untuk mematikan canvas Sparkles di halaman Experiences demi efisiensi render
  const [sparklesActive, setSparklesActive] = useState(true)

  // State untuk mengontrol kemunculan ScrollCue petunjuk scroll
  const [showScrollCue, setShowScrollCue] = useState(false)

  // State untuk melacak kapan halaman Experiences benar-benar aktif/selesai zoom-in
  const [isExperiencesActive, setIsExperiencesActive] = useState(false)
  const [showNextJourneyCue, setShowNextJourneyCue] = useState(true)
  const scrollTriggerRef = useRef(null)

  useEffect(() => {
    if (!active) return

    let context
    const timer = setTimeout(() => {
      if (!heroVisualsRef.current || !heroPanRef.current || !topOverlayRef.current || !experiencesWrapRef.current) {
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
        gsap.set(experiencesWrapRef.current, { opacity: 0 })

        gsap.set('.glow-path-line', { strokeDashoffset: 157 })

        // 3. Buat ScrollTrigger Timeline - HANYA untuk animasi zoom sinematiknya,
        //    bukan lagi untuk menahan konten Experiences yang panjang.
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
                // Biarkan Experiences.jsx yang memicu setNavbarVisible(true) setelah animasi kinetic-text selesai
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
              // Pin baru BENERAN lepas di sini - konten Experiences (di
              // bawahnya, normal flow) udah pasti persis di posisi teratas
              // layar, bukan masih ketutup/di bawah. Baru di titik INI
              // animasi masuknya (Kinetic Text Grid, dst) boleh mulai jalan
              // - kalau dipicu lebih awal (berdasarkan progress scrub),
              // kontennya masih belum kelihatan walau opacity-nya udah 1.
              setIsExperiencesActive(true)
              gsap.to(experiencesWrapRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
              })
            },
            onEnterBack: () => {
              // Scroll balik ke atas (masuk lagi ke area pin) - reset
              // supaya animasi masuk Experiences bisa terulang lagi nanti.
              setIsExperiencesActive(false)
              gsap.set(experiencesWrapRef.current, { opacity: 0 })
            },
            onLeaveBack: () => {
              setIsExperiencesActive(false)
              setNavbarVisible?.(true)
              setLightTheme?.(true)
              setShowShootingStars?.(true)
              setSparklesActive(true)
              setNavbarScrolled?.(true)
              setShowScrollCue?.(false)
            },
          },
        })

        // STAGE 1: Zoom out & memudarkan top overlay krem
        tl.to(topOverlayRef.current, { opacity: 0, ease: 'power1.inOut', duration: 0.25 }, 0)
          .fromTo(heroVisualsRef.current, { scale: 330 }, { scale: travelScale, ease: 'power2.out', duration: 0.25 }, 0)

          // STAGE 2: Gambar garis rasi bintang neon & traveling kamera ke Hamal
          .fromTo('.glow-path-line', { strokeDashoffset: 157 }, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.35 }, 0.25)
          .fromTo(
            heroPanRef.current,
            { x: ariDeltaX, y: ariDeltaY },
            { x: travelForwardX, y: travelForwardY, ease: 'power2.inOut', duration: 0.35 },
            0.25
          )

          // STAGE 3: Zoom-in tajam ke Hamal (memudarkan konten Experiences
          // TIDAK lagi dilakukan di sini lewat scrub - itu sekarang jalan
          // real-time lewat onLeave di atas, begitu pin beneran lepas).
          .fromTo(heroVisualsRef.current, { scale: travelScale }, { scale: 330, ease: 'power2.inOut', duration: 0.4 }, 0.6)
          .fromTo(
            heroPanRef.current,
            { x: travelForwardX, y: travelForwardY },
            { x: finalHamalX, y: finalHamalY, ease: 'power2.inOut', duration: 0.4 },
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

  // Toggle navbar "scrolled" state & ScrollCue berdasarkan posisi scroll WINDOW
  // relatif ke section Experiences - menggantikan pantauan scrollTop container
  // bersarang yang lama, karena sekarang cuma ada 1 sumber scroll (window).
  useEffect(() => {
    if (!isExperiencesActive) return

    const trigger = ScrollTrigger.create({
      trigger: experiencesWrapRef.current,
      start: 'top+=15 top',
      onEnter: () => {
        setNavbarScrolled?.(true)
        setShowScrollCue?.(false)
      },
      onLeaveBack: () => {
        setNavbarScrolled?.(false)
        setShowScrollCue?.(true)
      },
    })

    return () => trigger.kill()
  }, [isExperiencesActive])

  // Sembunyikan cue "lanjut ke Summary" begitu user sudah scroll melewati
  // akhir area transisi (tanda sudah di dalam konten Experiences yang panjang).
  useEffect(() => {
    if (!isExperiencesActive) return

    const handleWindowScroll = () => {
      const st = scrollTriggerRef.current
      if (!st) return
      const isPastEnd = window.scrollY > st.end + 10
      setShowNextJourneyCue(!isPastEnd)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [isExperiencesActive])

  return (
    <>
      {/* Section pin - HANYA animasi zoom sinematik 41 Arietis -> Hamal.
          Durasinya tetap/pendek, tidak lagi menahan konten Experiences. */}
      <section
        ref={containerRef}
        id="experiences"
        className="relative z-30 h-screen w-screen overflow-hidden bg-maroon"
      >
        <Sparkles className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60" active={sparklesActive} />

        <div ref={heroPanRef} className="absolute inset-0 h-full w-full pointer-events-none z-10">
          <div ref={heroVisualsRef} className="absolute inset-0 h-full w-full">
            <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="transStarGlowScroll" cx="50%" cy="50%" r="50%">
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

              {STARS.map((star) => {
                const isHamal = star.id === 'hamal'
                const size = star.radius * (isHamal ? 6.5 : 5)
                const scale = size / 24
                return (
                  <g key={star.id} data-star-id={star.id}>
                    <circle cx={star.cx} cy={star.cy} r={star.radius * 6.5} fill="url(#transStarGlowScroll)" />

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

        <div ref={topOverlayRef} className="pointer-events-none absolute inset-0 z-20 bg-cream" />
      </section>

      {/* Section konten Experiences sesungguhnya - NORMAL FLOW, mengikuti
          scroll utama halaman (bukan lagi di dalam kontainer yang di-pin). */}
      <div ref={experiencesWrapRef} id="experiences-content" className="relative z-30 opacity-0 -mt-[100vh]">
        <Experiences active={isExperiencesActive} onBack={onBack} setNavbarVisible={setNavbarVisible} onNextJourney={onNextJourney} showNextJourneyCue={showNextJourneyCue} />

        <ScrollCue visible={showScrollCue} light={true} disableScrollTrigger={true} />
      </div>
    </>
  )
}

export default SpaceTransitionScroll
