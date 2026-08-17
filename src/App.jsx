import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Constellation from './components/Constellation'
import Sparkles from './components/Sparkles'
import ScrollCue from './components/ScrollCue'

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

  const heroSectionRef = useRef(null)
  // heroPanRef menggeser seluruh layer visual supaya titik target (bintang
  // 41 Arietis) berakhir tepat di tengah layar. heroVisualsRef melakukan
  // scale/zoom-nya sendiri, dengan transform-origin persis di posisi asli
  // bintang tsb (diukur langsung dari DOM, bukan tebakan persen) supaya
  // bintangnya tidak "geser" aneh saat membesar.
  const heroPanRef = useRef(null)
  const heroVisualsRef = useRef(null)
  const overlayRef = useRef(null)
  const aboutContentRef = useRef(null)

  useEffect(() => {
    if (introComplete) setNavbarVisible(true)
  }, [introComplete])

  // Pin + zoom baru di-setup setelah intro selesai, supaya urutannya jelas:
  // rasi bintang kebentuk dulu -> baru scroll-zoom aktif.
  useEffect(() => {
    if (!introComplete) return

    const context = gsap.context(() => {
      // Ukur posisi ASLI bintang target langsung dari DOM (bukan tebakan
      // persentase) - ini penting karena SVG constellation di-scale pakai
      // preserveAspectRatio="slice", jadi posisi visualnya di layar tidak
      // selalu sama persis dengan hitungan persen dari koordinat viewBox.
      //
      // PENTING: ukur dari elemen ikon bintangnya SAJA ([data-star-icon]),
      // bukan dari seluruh grup bintang ([data-star-id]). Grup itu juga
      // memuat label nama bintang yang posisinya di ATAS bintang (walau
      // opacity 0, tetap ikut dihitung sebagai "area"), jadi kalau diukur
      // dari grupnya, titik tengah yang didapat ketarik ke atas dan bikin
      // hasil akhirnya kebawahan.
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
          end: '+=280%',
          scrub: 2,
          pin: true,
          pinSpacing: true,
          // Progress-based (bukan onEnter/onLeave) supaya tidak salah
          // ke-trigger begitu ScrollTrigger pertama kali di-setup (karena
          // Hero ada persis di posisi scroll 0, start-nya otomatis "sudah
          // terpenuhi" sejak awal). Navbar langsung hilang begitu scroll
          // mulai bergerak sedikit pun.
          onUpdate: (self) => {
            setNavbarVisible(self.progress <= 0.001 || self.progress >= 0.99)
          },
        },
      })

      timeline
        // Zoom besar-besaran - dinaikkan jauh lebih tinggi (100x) supaya
        // bukan cuma "ikonnya" yang membesar, tapi halo cahaya lembut di
        // sekitarnya (yang bentuknya lingkaran penuh, bukan bintang bercabang)
        // ikut membesar sampai benar-benar membanjiri seluruh layar - jarak
        // scroll (+=220%) juga diperpanjang supaya prosesnya kerasa lebih
        // panjang/smooth, bukan buru-buru.
        .to(heroPanRef.current, { x: deltaX, y: deltaY, ease: 'none', duration: 1 }, 0)
        .to(heroVisualsRef.current, { scale: 300, ease: 'none', duration: 1 }, 0)
        // Overlay & konten About baru mulai muncul di 94%-100% - jauh lebih
        // mepet ke akhir, supaya zoom-nya benar-benar selesai (layar sudah
        // penuh cahaya bintang) baru transisi warnanya jalan.
        .to(overlayRef.current, { opacity: 1, ease: 'none', duration: 0.06 }, 0.94)
        .to(aboutContentRef.current, { opacity: 1, ease: 'none', duration: 0.03 }, 0.985)
    }, heroSectionRef)

    return () => context.revert()
  }, [introComplete])

  return (
    <main className="bg-maroon text-cream">
      <Navbar visible={navbarVisible} />

      {/* Hero - dikunci di layar (pinned) selama proses zoom scroll ke
          bintang 41 Arietis. Section About dirender sebagai overlay di
          dalam Hero yang sama (fade-in di akhir), BUKAN section terpisah
          yang di-reveal dengan lanjut scroll ke bawah. */}
      <section ref={heroSectionRef} id="hero" className="relative h-screen overflow-hidden">
        <div ref={heroPanRef} className="absolute inset-0 h-full w-full">
          <div ref={heroVisualsRef} className="absolute inset-0 h-full w-full">
            {/* Lapisan bintang dekorasi latar (canvas particle) - di belakang. */}
            <Sparkles className="absolute inset-0 h-full w-full" />

            {/* Rasi bintang Aries - lapisan depan, sekaligus target zoom. */}
            <Constellation
              className="absolute inset-0 h-full w-full"
              onIntroComplete={() => setIntroComplete(true)}
            />
          </div>
        </div>

        {/* Overlay warna cream - transparan di awal, memudar masuk jadi
            solid menjelang akhir zoom, jadi latar untuk konten About. */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-20 bg-cream opacity-0"
        />

        {/* Konten About (placeholder) - fade-in di atas overlay, bukan
            section terpisah. Kontennya nanti diganti yang sesungguhnya. */}
        <div
          ref={aboutContentRef}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-maroon">
            Section About menyusul di sini
          </p>
        </div>

        <ScrollCue visible={introComplete} />
      </section>
    </main>
  )
}

export default App
