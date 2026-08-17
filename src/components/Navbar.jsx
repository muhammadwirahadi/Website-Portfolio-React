import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function Navbar({ visible = false }) {
  const navRef = useRef(null)

  // Navbar disembunyikan total di awal (opacity 0 + sedikit turun), baru
  // dimunculkan/disembunyikan lewat prop `visible` dari App. Tidak ada lagi
  // efek kapsul-mengambang saat scroll - navbar cuma satu bentuk (bar rata,
  // transparan menyatu dengan background), dan tugasnya cuma muncul/hilang.
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
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-10 py-6"
      >
        <a
          href="#hero"
          className="whitespace-nowrap font-script text-2xl leading-none text-cream"
        >
          MhmmdWiraHadi
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm uppercase tracking-[0.2em] text-cream/75 transition-colors duration-300 hover:text-gold"
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
