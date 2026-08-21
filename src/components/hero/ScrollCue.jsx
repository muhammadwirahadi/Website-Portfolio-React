import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Muncul bareng Navbar setelah intro rasi bintang selesai (dikontrol lewat
// prop `visible`), lalu otomatis menghilang begitu user mulai scroll -
// karena begitu mereka sudah scroll, mereka jelas sudah tahu caranya.
function ScrollCue({ visible = false, light = false, disableScrollTrigger = false }) {
  const rootRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    gsap.set(rootRef.current, { opacity: 0, y: 10 })
  }, [])

  useEffect(() => {
    if (!visible) {
      gsap.to(rootRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' })
      return
    }

    const root = rootRef.current
    const dot = dotRef.current

    const context = gsap.context(() => {
      gsap.to(root, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })

      gsap.set(dot, { y: 0, opacity: 1 })
      gsap.to(dot, {
        y: 12,
        opacity: 0,
        duration: 1.2,
        repeat: -1,
        ease: 'power1.inOut',
      })

      // Hilang begitu user mulai scroll, muncul lagi jika scroll balik ke atas
      if (!disableScrollTrigger) {
        ScrollTrigger.create({
          start: 'top -80',
          onEnter: () => gsap.to(root, { opacity: 0, duration: 0.4, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(root, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
        })
      }
    }, root)

    return () => context.revert()
  }, [visible, disableScrollTrigger])

  const textColorClass = light ? 'text-maroon/70' : 'text-cream/70'
  const subColorClass = light ? 'text-maroon/50' : 'text-cream/50'
  const borderColorClass = light ? 'border-maroon/30' : 'border-cream/30'
  const dotColorClass = light ? 'bg-maroon' : 'bg-gold'

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-x-0 bottom-10 z-10 flex items-center justify-center gap-4 ${textColorClass}`}
    >
      <span className={`text-[10px] uppercase tracking-[0.3em] font-mono ${subColorClass}`}>Scroll</span>
      {/* Bentuk Mouse */}
      <div className={`relative h-9 w-[22px] rounded-full border ${borderColorClass}`}>
        {/* Roda Mouse (Scroll Wheel) yang bergerak turun */}
        <div
          ref={dotRef}
          className={`absolute left-1/2 top-2 h-2.5 w-1.5 -translate-x-1/2 rounded-full ${dotColorClass}`}
        />
      </div>
      <span className={`text-[10px] uppercase tracking-[0.3em] font-mono ${subColorClass}`}>Down</span>
    </div>
  )
}

export default ScrollCue
