import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Education({ active = false }) {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const lineRef = useRef(null)
  const univRef = useRef(null)
  const degreeRef = useRef(null)
  const detailsRef = useRef(null)
  const descRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const context = gsap.context(() => {
      // Ambil semua elemen karakter dari nama universitas
      const univChars = univRef.current.querySelectorAll('.char')

      // Inisialisasi status awal elemen (tersembunyi/offset)
      gsap.set(labelRef.current, { opacity: 0 })
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(univChars, { opacity: 0, y: -60 })
      gsap.set([degreeRef.current, detailsRef.current, descRef.current], { opacity: 0, x: -40 })

      // 1. Animasi Scrub: Label "Education" (fade-in) dan Garis (draw from left to right)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 40%',
          end: 'top 20%',
          scrub: 1.5,
        },
      })

      // Tahap 1: Text "Education" memudar masuk (fade in)
      tl.to(labelRef.current, {
        opacity: 1,
        duration: 0.3,
      }, 0)

      // Tahap 2: Garis pembatas muncul menggambar dari kiri ke kanan (scaleX 0 -> 1)
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0.2)

      // 2. Animasi Play-Once: Nama Universitas muncul dengan animasi Letter Drop (staggered)
      // Diputar otomatis sekali jalan saat gilirannya tiba (top 20%)
      gsap.to(univChars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          toggleActions: 'play none none reset',
        },
      })

      // 3. Animasi Play-Once: Teks sisa informasi pendidikan muncul meluncur dari kiri (slide-in)
      // Diputar otomatis sekali jalan saat gilirannya tiba (top 5%)
      gsap.to([degreeRef.current, detailsRef.current, descRef.current], {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 5%',
          toggleActions: 'play none none reset',
        },
      })
    }, sectionRef)

    return () => context.revert()
  }, [active])

  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative z-20 flex min-h-screen flex-col justify-center overflow-hidden bg-transparent py-24 text-maroon"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Label Seksi */}
        <p
          ref={labelRef}
          className="text-sm uppercase tracking-[0.35em] text-maroon/60"
        >
          Education
        </p>

        {/* Garis Pembatas - Animasi menggambar dari kiri ke kanan */}
        <div
          ref={lineRef}
          className="mt-4 h-[2px] w-full bg-maroon/25"
        />

        {/* Detail Pendidikan */}
        <div className="pt-8">
          {/* Konten Utama */}
          <div>
            <h3
              ref={univRef}
              className="text-3xl font-bold tracking-tight text-maroon md:text-4xl"
            >
              {"Universitas Bina Sarana Informatika".split("").map((char, index) => (
                <span
                  key={index}
                  className="char inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h3>
            
            <p
              ref={degreeRef}
              className="mt-2 text-base uppercase tracking-[0.15em] text-maroon/70 font-medium"
            >
              Bachelor of Informatics
            </p>
            
            <p
              ref={detailsRef}
              className="mt-1 text-sm uppercase tracking-[0.1em] text-maroon/50 font-medium"
            >
              Jakarta, Indonesia • 2022 - 2026 • IPK 3.96
            </p>
            
            <p
              ref={descRef}
              className="mt-4 max-w-2xl text-base leading-relaxed text-maroon/80"
            >
              Currently pursuing a Bachelor&apos;s degree in Informatics from 2022 to 2026. Focusing on software engineering, web application development, and systems analysis to build solid technical foundations as a developer.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
