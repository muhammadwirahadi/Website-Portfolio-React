import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Berapa banyak "bintang jatuh" yang jalan bersamaan (dikurangi untuk optimasi performa).
const STAR_COUNT = 12

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

// Bintang-bintang kecil yang muncul dari kiri, melintas ke arah kanan sambil
// meninggalkan jejak garis pudar di belakangnya.
function ShootingStars({ className = '', active = true }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const root = containerRef.current
    const stars = root.querySelectorAll('[data-shooting-star]')

    const context = gsap.context(() => {
      stars.forEach((star) => {
        // Direkursi lewat onComplete supaya tiap bintang punya lintasan baru
        // (posisi awal, drift arah, kecepatan) setiap kali dia mengulang.
        const runLap = () => {
          const startY = randomBetween(8, 88) // posisi vertikal awal (persen)
          const verticalDrift = randomBetween(-14, 14) // deviasi arah, biar tidak lurus kaku
          const duration = randomBetween(9, 15)

          gsap.set(star, { x: '-15vw', top: `${startY}%`, opacity: 0 })

          gsap
            .timeline({ delay: randomBetween(0.4, 4.5), onComplete: runLap })
            .to(star, { opacity: 0.75, duration: 0.5, ease: 'power1.out' }, 0)
            .to(
              star,
              { x: '115vw', top: `${startY + verticalDrift}%`, duration, ease: 'none' },
              0
            )
            .to(star, { opacity: 0, duration: 0.7, ease: 'power1.in' }, duration - 0.7)
        }

        runLap()
      })
    }, root)

    return () => context.revert()
  }, [active])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {Array.from({ length: STAR_COUNT }).map((_, index) => (
        <svg
          key={index}
          data-shooting-star
          className="absolute left-0 h-1 w-28"
          viewBox="0 0 120 4"
          style={{ opacity: 0 }}
        >
          <defs>
            <linearGradient
              id={`shooting-trail-${index}`}
              x1="0"
              y1="0"
              x2="112"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="1" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="2"
            x2="112"
            y2="2"
            stroke={`url(#shooting-trail-${index})`}
            strokeWidth="1.5"
          />
          <circle cx="116" cy="2" r="2.2" fill="#D4AF37" fillOpacity="0.9" />
        </svg>
      ))}
    </div>
  )
}

export default ShootingStars
