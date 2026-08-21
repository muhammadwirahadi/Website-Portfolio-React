import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Education() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      // Inisialisasi status awal elemen (tersembunyi)
      gsap.set([labelRef.current, cardRef.current], { opacity: 0, y: 32 })

      // Animasi Label Kategori (Education)
      gsap.to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      // Animasi Kartu Informasi Studi
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => context.revert()
  }, [])

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

        {/* Detail Pendidikan */}
        <div
          ref={cardRef}
          className="mt-4 border-t-2 border-maroon/25 pt-8"
        >
          {/* Konten Utama */}
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-maroon md:text-4xl">
              Universitas Bina Sarana Informatika
            </h3>
            
            <p className="mt-2 text-base uppercase tracking-[0.15em] text-maroon/70 font-medium">
              Bachelor of Informatics
            </p>
            
            <p className="mt-1 text-sm uppercase tracking-[0.1em] text-maroon/50 font-medium">
              Jakarta, Indonesia • 2022 - 2026 • IPK 3.96
            </p>
            
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-maroon/80">
              Currently pursuing a Bachelor&apos;s degree in Informatics from 2022 to 2026. Focusing on software engineering, web application development, and systems analysis to build solid technical foundations as a developer.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
