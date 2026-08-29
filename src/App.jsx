import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './components/ui/Navbar'
import Constellation from './components/hero/Constellation'
import Sparkles from './components/hero/Sparkles'
import ScrollCue from './components/hero/ScrollCue'
import CustomCursor from './components/ui/CustomCursor'
import About from './components/about/About'
import Education from './components/about/Education'
import Skills from './components/about/Skills'
import ShootingStars from './components/about/ShootingStars'
import NextJourney from './components/about/NextJourney'
import SpaceTransitionScroll from './components/experiences/SpaceTransitionScroll'
import Experiences from './components/experiences/Experiences'
import SummarySpaceTransition from './components/summary/SummarySpaceTransition'
import ContactSpaceTransition from './components/contact/ContactSpaceTransition'

gsap.registerPlugin(ScrollTrigger)

// Bintang yang jadi target zoom - harus cocok dengan salah satu id di
// ARIES_STARS pada Constellation.jsx.
const ZOOM_TARGET_STAR_ID = '41-ari'

function App() {
  // Navbar & info scroll sengaja disembunyikan di awal - baru muncul
  // bareng-bareng setelah animasi intro rasi bintang Aries selesai
  // (lihat Constellation.jsx).
  const [introComplete, setIntroComplete] = useState(false)

  // Navbar disembunyikan lagi selama proses zoom scroll berlangsung, lalu
  // muncul kembali begitu zoom + transisi ke About selesai.
  const [navbarVisible, setNavbarVisible] = useState(false)
  const [navbarScrolled, setNavbarScrolled] = useState(false)

  // Dipakai Navbar & CustomCursor untuk switch warna (cream <-> maroon).
  const [lightTheme, setLightTheme] = useState(false)

  // Mengontrol pemutaran animasi masuk (slide-in) konten About.
  // Dipisahkan dari lightTheme agar animasi teks & gambar baru mulai diputar
  // SETELAH kontainer About memudar masuk 100% solid (tidak blur lagi).
  const [aboutPlay, setAboutPlay] = useState(false)

  // Menyimpan status selesainya animasi masuk About untuk memicu ScrollCue
  const [aboutAnimCompletedState, setAboutAnimCompletedState] = useState(false)

  // Mengontrol keaktifan render bintang jatuh untuk optimasi performa
  const [showShootingStars, setShowShootingStars] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const heroSectionRef = useRef(null)
  // heroPanRef menggeser seluruh layer visual supaya titik target (bintang
  // 41 Arietis) berakhir tepat di tengah layar. heroVisualsRef melakukan
  // scale/zoom-nya sendiri, dengan transform-origin persis di posisi asli
  // bintang tsb (diukur langsung dari DOM, bukan tebakan persen) supaya
  // bintangnya tidak "geser" aneh saat membesar.
  const heroPanRef = useRef(null)
  const heroVisualsRef = useRef(null)
  const secondaryOverlayRef = useRef(null)
  const aboutContentRef = useRef(null)
  
  const scrollTriggerRef = useRef(null)
  const aboutAnimCompleted = useRef(false)
  const isLockedDown = useRef(false)
  const lenisRef = useRef(null)

  const handleAboutAnimComplete = () => {
    aboutAnimCompleted.current = true
    isLockedDown.current = false
    setAboutAnimCompletedState(true)
  }

  const handleScrollToExperiences = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#experiences', { duration: 3.0 })
    }
  }

  const handleScrollBackToAbout = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#next-journey', { duration: 3.0 })
    }
  }

  const handleScrollToSummary = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#summary', { duration: 3.0 })
    }
  }

  const handleScrollBackToExperiences = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#next-journey-projects', { duration: 3.0 })
    }
  }

  const handleScrollToContact = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#contact', { duration: 3.0 })
    }
  }

  const handleScrollBackToSummary = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#next-journey-summary', { duration: 3.0 })
    }
  }

  const handleResetToAbout = () => {
    setIsResetting(true)
    setTimeout(() => {
      // Teleport ke posisi 0 → Hero ScrollTrigger progress=0 → konstellasi Aries full terlihat
      window.scrollTo(0, 0)
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      }

      // Paksa GSAP memperbarui semua inline style agar sync dengan posisi scroll baru
      ScrollTrigger.update()

      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }, 700)
  }



  // Initialize Lenis smooth scroll with heavier/smoother inertial scroll speed
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6, // Heavier scrolling momentum feel (default 1.0)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85, // Slower scrolling multiplier for heavier scroll control
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis
    window.globalLenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerCallback)
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const getLockScroll = () => {
      const st = scrollTriggerRef.current
      if (!st) return 0
      return Math.round(st.start + (st.end - st.start) * 0.80)
    }

    const handleWheel = (e) => {
      // Lock scroll di halaman About jika animasi belum selesai
      const lockScroll = getLockScroll()
      if (lockScroll && e.deltaY > 0 && !aboutAnimCompleted.current) {
        if (window.scrollY >= lockScroll - 5) {
          e.preventDefault()
          if (lenisRef.current) {
            lenisRef.current.scrollTo(lockScroll, { immediate: true })
          } else {
            window.scrollTo(0, lockScroll)
          }
        }
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touchEndY = e.touches[0].clientY
        const deltaY = touchStartY - touchEndY
        
        const lockScroll = getLockScroll()
        if (lockScroll && deltaY > 0 && !aboutAnimCompleted.current) {
          if (window.scrollY >= lockScroll - 5) {
            e.preventDefault()
            if (lenisRef.current) {
              lenisRef.current.scrollTo(lockScroll, { immediate: true })
            } else {
              window.scrollTo(0, lockScroll)
            }
          }
        }
      }
    }

    const handleKeyDown = (e) => {
      const scrollDownKeys = [32, 34, 35, 40] // Space, PageDown, End, DownArrow

      const lockScroll = getLockScroll()
      if (lockScroll && scrollDownKeys.includes(e.keyCode) && !aboutAnimCompleted.current) {
        if (window.scrollY >= lockScroll - 5) {
          e.preventDefault()
          if (lenisRef.current) {
            lenisRef.current.scrollTo(lockScroll, { immediate: true })
          } else {
            window.scrollTo(0, lockScroll)
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('keydown', handleKeyDown, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (introComplete) {
      setNavbarVisible(true)
    }
  }, [introComplete])

  // Mengontrol overflow body dan status jalannya Lenis secara terpadu
  useEffect(() => {
    const lenis = lenisRef.current
    
    const shouldLock = !introComplete

    if (shouldLock) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      lenis?.start()
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [introComplete])

  // Pin + zoom baru di-setup setelah intro selesai, supaya urutannya jelas:
  // rasi bintang kebentuk dulu -> baru scroll-zoom aktif.
  useEffect(() => {
    if (!introComplete) return

    const context = gsap.context(() => {
      const starGroupEl = heroVisualsRef.current.querySelector(
        `[data-star-id="${ZOOM_TARGET_STAR_ID}"]`
      )
      const starIconEl = starGroupEl.querySelector('[data-star-icon]')
      const containerRect = heroPanRef.current.getBoundingClientRect()
      const starRect = starIconEl.getBoundingClientRect()

      const starCenterX = starRect.left + starRect.width / 2 - containerRect.left
      const starCenterY = starRect.top + starRect.height / 2 - containerRect.top
      const containerCenterX = containerRect.width / 2
      const containerCenterY = containerRect.height / 2

      const deltaX = containerCenterX - starCenterX
      const deltaY = containerCenterY - starCenterY

      gsap.set(heroVisualsRef.current, {
        transformOrigin: `${starCenterX}px ${starCenterY}px`,
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            setNavbarVisible(self.progress <= 0.001 || self.progress >= 0.80)
            setLightTheme(self.progress >= 0.76)
            setShowShootingStars(self.progress >= 0.76)
            setAboutPlay(self.progress >= 0.80)
            setNavbarScrolled(self.progress > 0.88)

            // Mengunci scroll ke bawah jika animasi masuk About belum selesai (kunci di progress 80%)
            if (self.progress >= 0.80) {
              if (!aboutAnimCompleted.current) {
                isLockedDown.current = true

                const lockScroll = Math.round(self.start + (self.end - self.start) * 0.80)
                if (Math.abs(self.scroll() - lockScroll) > 2) {
                  if (lenisRef.current) {
                    lenisRef.current.scrollTo(lockScroll, { immediate: true })
                  } else {
                    self.scroll(lockScroll)
                  }
                }
              } else {
                setAboutAnimCompletedState(self.progress <= 0.82)
              }
            } else if (self.progress < 0.70) {
              aboutAnimCompleted.current = false
              isLockedDown.current = false
              setAboutAnimCompletedState(false)
            }
          }
        },
      })

      scrollTriggerRef.current = timeline.scrollTrigger

      timeline
        .to(heroPanRef.current, { x: deltaX, y: deltaY, ease: 'none', duration: 1 }, 0)
        .to(heroVisualsRef.current, { scale: 330, ease: 'none', duration: 1 }, 0)
        .to(secondaryOverlayRef.current, { opacity: 1, ease: 'none', duration: 0.06 }, 0.70)
        .to(heroPanRef.current, { opacity: 0, ease: 'none', duration: 0.01 }, 0.76)
        .to(heroPanRef.current, { pointerEvents: 'none', display: 'none', duration: 0.01 }, 0.76)
        .to(aboutContentRef.current, { opacity: 1, pointerEvents: 'auto', ease: 'none', duration: 0.02 }, 0.77)

      // Memaksa ScrollTrigger menghitung ulang seluruh posisi pemicu halaman setelah pin spacer ditambahkan
      ScrollTrigger.refresh()
      setTimeout(() => {
        ScrollTrigger.refresh()
        // Cetak debug pemicu ScrollTrigger untuk memeriksa posisi absolut di DOM
        console.log('--- ALL SCROLLTRIGGERS ---')
        ScrollTrigger.getAll().forEach((st, i) => {
          console.log(`ScrollTrigger #${i}: trigger=${st.trigger?.id || st.trigger?.tagName || 'none'}, start=${st.start}, end=${st.end}, pin=${!!st.pin}`)
        })
      }, 300)
    }, heroSectionRef)

    return () => context.revert()
  }, [introComplete])

  // (Scroll theme and visibility events are handled dynamically within SpaceTransitionScroll)

  return (
    <main className="bg-maroon text-cream">
      <CustomCursor light={lightTheme} />
      <Navbar visible={navbarVisible} light={lightTheme} isScrolled={navbarScrolled} />

      {/* Secondary Fixed Cream Background - FIXED di viewport z-10 */}
      <div
        ref={secondaryOverlayRef}
        className="pointer-events-none fixed inset-0 z-10 bg-cream opacity-0"
      >
        <ShootingStars active={showShootingStars} />
      </div>

      {/* Section Hero - Pinned container z-20 (normal pointer events!) */}
      <section ref={heroSectionRef} id="hero" className="relative z-20 h-screen overflow-hidden bg-transparent">
        {/* 1. Lapisan bintang dekorasi latar - absolute z-0 */}
        <Sparkles className="pointer-events-none absolute inset-0 z-0 h-full w-full" active={!lightTheme} />

        {/* 2. Rasi bintang Aries - absolute z-5 */}
        <div ref={heroPanRef} className="absolute inset-0 z-5 h-full w-full">
          <div ref={heroVisualsRef} className="absolute inset-0 h-full w-full">
            <Constellation
              className="absolute inset-0 h-full w-full"
              onIntroComplete={() => setIntroComplete(true)}
            />
          </div>
        </div>

        {/* 4. Konten About sesungguhnya - fade-in di atas overlay */}
        <div
          ref={aboutContentRef}
          className="pointer-events-none absolute inset-0 z-30 opacity-0"
        >
          <About play={aboutPlay} onAnimationComplete={handleAboutAnimComplete} />
          
          {/* Petunjuk scroll khusus halaman About (muncul setelah animasi selesai) */}
          <ScrollCue visible={aboutAnimCompletedState} light={true} disableScrollTrigger={true} />
        </div>

        <ScrollCue visible={introComplete} />
      </section>

      {/* Section lanjutan setelah About (Education, Skills, dst) */}
      <Education active={aboutPlay} />
      <Skills active={aboutPlay} />
      <NextJourney active={aboutPlay} onNavigate={handleScrollToExperiences} />

      {/* Space Transition & Experiences Section (Scroll Pinned) */}
      <SpaceTransitionScroll 
        active={introComplete}
        onBack={handleScrollBackToAbout} 
        setNavbarVisible={setNavbarVisible}
        setLightTheme={setLightTheme}
        setNavbarScrolled={setNavbarScrolled}
        setShowShootingStars={setShowShootingStars}
        onNextJourney={handleScrollToSummary}
      />

      {/* Space Transition & Summary Section (Scroll Pinned) */}
      <div className="-mt-1 bg-maroon">
        <SummarySpaceTransition 
          active={introComplete}
          onBack={handleScrollBackToExperiences}
          setNavbarVisible={setNavbarVisible}
          setLightTheme={setLightTheme}
          setNavbarScrolled={setNavbarScrolled}
          setShowShootingStars={setShowShootingStars}
          onNextJourney={handleScrollToContact}
        />
      </div>

      {/* Space Transition & Contact Section (Scroll Pinned) */}
      <div className="-mt-1 bg-maroon">
        <ContactSpaceTransition 
          active={introComplete}
          onBack={handleScrollBackToSummary}
          setNavbarVisible={setNavbarVisible}
          setLightTheme={setLightTheme}
          setNavbarScrolled={setNavbarScrolled}
          setShowShootingStars={setShowShootingStars}
          onResetApp={handleResetToAbout}
        />
      </div>

      {/* Full Screen Reset Transition Overlay */}
      <div 
        className={`fixed inset-0 z-[9999] bg-cream pointer-events-none transition-opacity duration-700 ${
          isResetting ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </main>
  )
}

export default App
