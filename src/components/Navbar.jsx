import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

// Jarak scroll (px) sebelum navbar berubah dari bar rata (menyatu dengan
// background) menjadi kapsul mengambang.
const FLOAT_THRESHOLD = 72

// Wrapper mengatur gutter (jarak dari tepi kiri-kanan layar) dan jarak dari
// atas. Nav mengatur tampilan visual kapsulnya sendiri (radius, warna, blur).
const WRAPPER_FLAT = { paddingLeft: 0, paddingRight: 0, paddingTop: 0 }
const WRAPPER_FLOATING = { paddingLeft: 20, paddingRight: 20, paddingTop: 16 }

const NAV_FLAT = {
  borderRadius: 0,
  paddingLeft: 40,
  paddingRight: 40,
  paddingTop: 22,
  paddingBottom: 22,
  backgroundColor: 'rgba(10, 6, 8, 0)',
  borderColor: 'rgba(212, 175, 55, 0)',
  backdropFilter: 'blur(0px)',
  boxShadow: '0 20px 45px -28px rgba(0, 0, 0, 0)',
}

const NAV_FLOATING = {
  borderRadius: 999,
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 14,
  paddingBottom: 14,
  backgroundColor: 'rgba(10, 6, 8, 0.55)',
  borderColor: 'rgba(212, 175, 55, 0.22)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 45px -18px rgba(0, 0, 0, 0.65)',
}

function Navbar() {
  const wrapperRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const nav = navRef.current

    gsap.set(wrapper, WRAPPER_FLAT)
    gsap.set(nav, NAV_FLAT)

    const context = gsap.context(() => {
      const toFloating = () => {
        gsap.to(wrapper, { ...WRAPPER_FLOATING, duration: 0.6, ease: 'power3.out' })
        gsap.to(nav, { ...NAV_FLOATING, duration: 0.6, ease: 'power3.out' })
      }

      const toFlat = () => {
        gsap.to(wrapper, { ...WRAPPER_FLAT, duration: 0.5, ease: 'power3.out' })
        gsap.to(nav, { ...NAV_FLAT, duration: 0.5, ease: 'power3.out' })
      }

      ScrollTrigger.create({
        start: `top -${FLOAT_THRESHOLD}`,
        onEnter: toFloating,
        onLeaveBack: toFlat,
      })
    }, wrapper)

    return () => context.revert()
  }, [])

  return (
    <div ref={wrapperRef} className="fixed inset-x-0 top-0 z-50">
      <nav
        ref={navRef}
        className="mx-auto flex w-full max-w-6xl items-center justify-between border border-transparent"
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
