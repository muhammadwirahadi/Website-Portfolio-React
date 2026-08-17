import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Muncul bareng Navbar setelah intro rasi bintang selesai (dikontrol lewat
// prop `visible`), lalu otomatis menghilang begitu user mulai scroll -
// karena begitu mereka sudah scroll, mereka jelas sudah tahu caranya.
function ScrollCue({ visible = false }) {
  const rootRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    gsap.set(rootRef.current, { opacity: 0, y: 10 })
  }, [])

  useEffect(() => {
    if (!visible) return

    const root = rootRef.current
    const dot = dotRef.current

    const context = gsap.context(() => {
      gsap.to(root, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })

      gsap.set(dot, { y: 0, opacity: 1 })
      gsap.to(dot, {
        y: 18,
        opacity: 0,
        duration: 1.1,
        repeat: -1,
        ease: 'power1.in',
      })

      // Hilang begitu user mulai scroll, muncul lagi kalau scroll balik ke atas.
      ScrollTrigger.create({
        start: 'top -80',
        onEnter: () => gsap.to(root, { opacity: 0, duration: 0.4, ease: 'power2.out' }),
        onLeaveBack: () => gsap.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
      })
    }, root)

    return () => context.revert()
  }, [visible])

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3 text-cream/70"
    >
      <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
      <span className="relative h-9 w-px overflow-hidden bg-cream/20">
        <span
          ref={dotRef}
          className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold"
        />
      </span>
    </div>
  )
}

export default ScrollCue
