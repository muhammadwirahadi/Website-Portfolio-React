import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function HamburgerIcon({ light = false }) {
  const lineColor = light ? 'bg-maroon' : 'bg-cream'
  return (
    <div className="flex flex-col gap-[6px] w-6 justify-center items-end group">
      <span className={`h-[2px] w-6 transition-all duration-300 ${lineColor} group-hover:w-4`} />
      <span className={`h-[2px] w-4 transition-all duration-300 ${lineColor} group-hover:w-6`} />
    </div>
  )
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function Navbar({ visible = false, light = false, isScrolled = false }) {
  // Warna teks navbar dibalik ketika berada di atas background terang
  const textColorClass = light ? 'text-maroon' : 'text-cream'
  const underlineColorClass = light ? 'after:bg-maroon' : 'after:bg-cream'
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const logoTextRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Mengunci scroll halaman (body) ketika Hamburger Menu sedang terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Efek Magnetic Hover pada Logo
  const handleMouseMove = (e) => {
    const rect = logoRef.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(logoTextRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(logoTextRef.current, {
      x: 0,
      y: 0,
      duration: 0.85,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    })
  }

  // Animasi Navbar Visibility (kontrol opacity & y saat App loading)
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
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <nav
          ref={navRef}
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6"
        >
          {/* Logo */}
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

          {/* Wrapper Konten Navigasi Kanan */}
          <div className="relative flex items-center justify-end min-h-[40px]">
            {/* Inline Links (Desktop - hanya terlihat jika belum di-scroll jauh) */}
            <ul className={`hidden md:flex items-center gap-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled 
                ? 'opacity-0 translate-x-8 scale-95 pointer-events-none' 
                : 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
            }`}>
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

            {/* Hamburger Button (Mobile selalu, Desktop saat mulai di-scroll) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`p-2 focus:outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                isScrolled
                  ? 'opacity-100 scale-100 rotate-0 pointer-events-auto'
                  : 'opacity-100 pointer-events-auto md:absolute md:right-0 md:opacity-0 md:scale-75 md:-rotate-90 md:pointer-events-none'
              } ${textColorClass}`}
              aria-label="Open Menu"
            >
              <HamburgerIcon light={light} />
            </button>
          </div>
        </nav>
      </div>

      {/* Drawer Overlay (Backdrop Blur) */}
      <div
        data-drawer-menu
        className={`fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm transition-opacity duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Panel Menu (Morphing rounded-l liquid entry animation) */}
      <div
        data-drawer-menu
        className={`fixed right-0 top-0 bottom-0 z-[101] h-screen w-full max-w-[380px] bg-maroon text-cream border-l border-gold/20 shadow-2xl p-10 flex flex-col justify-between transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isMenuOpen 
            ? 'translate-x-0 rounded-l-none' 
            : 'translate-x-full rounded-l-[150px] md:rounded-l-[200px]'
        }`}
      >
        {/* Top: Tombol Tutup (Close Button) */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 focus:outline-none cursor-pointer hover:rotate-90 transition-transform duration-300 text-cream/70 hover:text-cream"
            aria-label="Close Menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Middle: Links Menu (dengan staggered animation delay & font lebih besar) */}
        <ul className="flex flex-col gap-8 my-auto pl-4">
          {NAV_LINKS.map((link, index) => (
            <li
              key={link.href}
              className={`transform transition-all duration-500 ${
                isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <a
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-display text-3xl md:text-4xl font-bold tracking-widest text-cream hover:text-gold transition-colors duration-300 uppercase block py-2 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Bottom: Footer Sidebar */}
        <div className="text-xs uppercase tracking-[0.25em] text-cream/40 pl-4">
          © 2026 Muhammad Wira Hadi
        </div>
      </div>
    </>
  )
}

export default Navbar
