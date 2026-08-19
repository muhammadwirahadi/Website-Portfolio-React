import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function Navbar({ visible = false, light = false }) {
  // Warna teks navbar dibalik ketika berada di atas background terang
  // (section About, dst) - tanpa ini, teks cream/gold jadi hampir tidak
  // kelihatan karena warnanya nyaris sama dengan background cream.
  const textColorClass = light ? 'text-maroon' : 'text-cream'
  const underlineColorClass = light ? 'after:bg-maroon' : 'after:bg-cream'
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const logoTextRef = useRef(null)

  // Efek Magnetic Hover pada Logo
  const handleMouseMove = (e) => {
    const rect = logoRef.current.getBoundingClientRect()
    // Hitung posisi kursor relatif terhadap titik tengah logo
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    // Tarik elemen teks ke arah kursor dengan kekuatan 35%
    gsap.to(logoTextRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handleMouseLeave = () => {
    // Kembalikan logo ke tengah dengan efek pegas/spring yang kenyal (elastic)
    gsap.to(logoTextRef.current, {
      x: 0,
      y: 0,
      duration: 0.85,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    })
  }

  // Navbar disembunyikan total di awal (opacity 0 + sedikit turun), baru
  // dimunculkan/disembunyikan lewat prop `visible` dari App.
  useEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -16, pointerEvents: 'none' })
  }, [])

  useEffect(() => {
    const nav = navRef.current

    if (visible) {
      gsap.to(nav, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    } else {
      gsap.to(nav, {
        opacity: 0,
        y: -16,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
  }, [visible])

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <nav
        ref={navRef}
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6"
      >
        <a
          ref={logoRef}
          href="#hero"
          className="group relative inline-block py-2 select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span
            ref={logoTextRef}
            className={`inline-block whitespace-nowrap font-script text-2xl leading-none transition-colors duration-300 ${textColorClass}`}
          >
            MhmmdWiraHadi
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative py-1 text-sm uppercase tracking-[0.2em] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:will-change-transform hover:after:origin-left hover:after:scale-x-100 ${textColorClass} ${underlineColorClass}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
