import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Komponen CustomCursor mendengarkan koordinat mouse secara global dan
// merender cursor kustom di atas cursor bawaan. Hanya aktif di desktop
// (perangkat dengan pointer penunjuk presisi).
function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const textRef = useRef(null)
  
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const text = textRef.current

    // Set posisi awal kursor di luar layar agar tidak "berkedip" muncul
    // di koordinat (0,0) saat pertama kali render.
    gsap.set(cursor, { x: -200, y: -200 })

    // Gunakan gsap.quickTo untuk performa tinggi (menggunakan RequestAnimationFrame)
    // yang meminimalisir lag/delay dan memberikan efek lerp/inertia halus.
    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' })
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' })

    const handleMouseMove = (e) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }
      cursorX(e.clientX)
      cursorY(e.clientY)
    }

    // Sembunyikan kursor kustom jika mouse keluar dari area dokumen web (pindah tab dll)
    const handleMouseLeave = () => {
      isVisibleRef.current = false
      setIsVisible(false)
    }

    // Munculkan kembali kursor kustom jika mouse masuk kembali ke dokumen web
    const handleMouseEnter = () => {
      isVisibleRef.current = true
      setIsVisible(true)
    }

    // Animasi putaran teks "scroll down" secara terus-menerus (infinite rotation).
    const rotateTween = gsap.to(text, {
      rotation: 360,
      duration: 16,
      repeat: -1,
      ease: 'none',
    })

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      rotateTween.kill()
    }
  }, [])

  // Deteksi hover pada elemen-elemen interaktif untuk mengubah state kursor.
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target
      const isInteractive = target.closest(
        'a, button, [role="button"], .cursor-pointer, [data-star], [data-star-icon]'
      )
      setIsHovered(!!isInteractive)
    }

    window.addEventListener('mouseover', handleMouseOver)
    return () => window.removeEventListener('mouseover', handleMouseOver)
  }, [])

  // Deteksi scroll untuk memudarkan teks "scroll down" ketika sudah scroll ke bawah.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animasi reaksi kursor saat hover / scroll menggunakan GSAP.
  useEffect(() => {
    const dot = dotRef.current
    const text = textRef.current

    if (isHovered) {
      // Saat hover: kursor membesar menjadi lingkaran target/hollow ring
      gsap.to(dot, {
        scale: 5,
        backgroundColor: 'rgba(240, 228, 200, 0.1)',
        borderColor: '#D4AF37',
        borderWidth: '1px',
        duration: 0.3,
        ease: 'power2.out',
      })

      // Memudarkan teks "scroll down"
      gsap.to(text, {
        opacity: 0,
        scale: 0.6,
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      // Kondisi normal: kursor berbentuk titik kecil padat
      gsap.to(dot, {
        scale: 1,
        backgroundColor: '#D4AF37',
        borderColor: 'transparent',
        borderWidth: '0px',
        duration: 0.3,
        ease: 'power2.out',
      })

      // Kembalikan teks "scroll down" jika halaman belum di-scroll
      gsap.to(text, {
        opacity: isScrolled ? 0 : 1,
        scale: isScrolled ? 0.6 : 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [isHovered, isScrolled])

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 md:block transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transformBox: 'fill-box' }}
    >
      {/* Teks Melingkar "scroll down" */}
      <svg
        ref={textRef}
        width="90"
        height="90"
        viewBox="0 0 100 100"
        className="origin-center text-cream"
      >
        <defs>
          {/* Path lingkaran sebagai rel jalannya teks */}
          <path
            id="cursorCirclePath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          />
        </defs>
        <text fill="#f0e4c8" opacity="0.8" className="font-mono text-[8px] font-medium uppercase tracking-[0.24em]">
          <textPath href="#cursorCirclePath" startOffset="0%">
            scroll down • scroll down • • • • 
          </textPath>
        </text>
      </svg>

      {/* Titik Kursor Tengah */}
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent bg-gold"
      />
    </div>
  )
}

export default CustomCursor
