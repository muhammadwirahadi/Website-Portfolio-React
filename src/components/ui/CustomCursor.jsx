import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Komponen CustomCursor mendengarkan koordinat mouse secara global dan
// merender cursor kustom di atas cursor bawaan. Hanya aktif di desktop
// (perangkat dengan pointer penunjuk presisi).
function CustomCursor({ light = false }) {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const textRef = useRef(null)
  const ariesRef = useRef(null)

  const [isOverDrawer, setIsOverDrawer] = useState(false)

  // Warna aksen kursor dibalik saat berada di atas background terang
  // (tetapi jika di atas drawer menu, kembalikan ke warna cream/gold agar kontras)
  const isDarkBg = !light || isOverDrawer
  const accentColor = isDarkBg ? '#F0E4C8' : '#4A1620'
  const idleTintColor = isDarkBg ? 'rgba(240, 228, 200, 0.1)' : 'rgba(74, 22, 32, 0.08)'
  
  const [isHovered, setIsHovered] = useState(false)
  const [isAriesHovered, setIsAriesHovered] = useState(false)
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

      const isAriesLine = target.closest('[data-aries-hover]')
      setIsAriesHovered(!!isAriesLine)

      // Cek apakah kursor berada di atas menu drawer
      const isDrawer = target.closest('[data-drawer-menu]')
      setIsOverDrawer(!!isDrawer)
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
    const aries = ariesRef.current

    if (isAriesHovered) {
      // Saat hover garis Aries: sembunyikan dot dan teks "scroll down"
      gsap.to(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
      gsap.to(text, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
      // Tampilkan ikon Aries
      gsap.to(aries, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      })
    } else {
      // Sembunyikan ikon Aries
      gsap.to(aries, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
      })

      if (isHovered) {
        // Saat hover: kursor membesar menjadi lingkaran target/hollow ring
        gsap.to(dot, {
          scale: 5,
          opacity: 1,
          backgroundColor: idleTintColor,
          borderColor: accentColor,
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
          opacity: 1,
          backgroundColor: accentColor,
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
    }
  }, [isHovered, isAriesHovered, isScrolled, light])

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
        <text fill={light ? '#4A1620' : '#F0E4C8'} opacity="0.8" className="font-mono text-[8px] font-medium uppercase tracking-[0.24em]">
          <textPath href="#cursorCirclePath" startOffset="0%">
            scroll down • scroll down • • • • 
          </textPath>
        </text>
      </svg>

      {/* Titik Kursor Tengah */}
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent"
      />

      {/* Aries Custom Icon */}
      <svg
        ref={ariesRef}
        width="44"
        height="44"
        viewBox="0 0 64 64"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <path
          d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m19.014 23.951c-.348.365-.859.575-1.406.575c-.968 0-1.982-.667-2.049-1.939c-.104-2.027-1.62-4.221-3.863-4.074c-1.875.127-3.147 1.585-4.003 4.587L33.9 46.044c-.244.884-.99 1.455-1.899 1.455s-1.655-.571-1.899-1.456l-5.794-20.946c-.596-2.091-1.737-4.588-3.792-4.588l-.147.004c-2.228.124-3.805 1.761-3.925 4.074c-.066 1.273-1.081 1.939-2.049 1.939c-.547 0-1.06-.21-1.406-.575c-.346-.364-.514-.854-.484-1.417c.193-3.707 2.771-7.778 7.17-8.021c3.976-.234 7.019 2.538 8.432 7.507L32 38.103l3.895-14.08c1.414-4.973 4.469-7.744 8.435-7.51c4.397.245 6.976 4.316 7.169 8.021c.028.563-.14 1.053-.485 1.417"
          fill={accentColor}
        />
      </svg>
    </div>
  )
}

export default CustomCursor
