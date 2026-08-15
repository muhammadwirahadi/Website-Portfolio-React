import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Posisi 4 bintang utama Aries mengikuti bentuk rasi yang sebenarnya (pola
// "kail" khas): 41 Arietis -> Hamal (bintang paling terang) -> Sheratan ->
// Mesarthim. Radius tiap bintang kira-kira proporsional dengan magnitude
// aslinya, jadi Hamal tampak paling besar/terang. Diposisikan di tengah
// kanvas (1600x900) sebagai focal point utama Hero.
const ARIES_STARS = [
  { id: '41-ari', x: 625, y: 370, radius: 3.2, label: '41 Arietis' },
  { id: 'hamal', x: 765, y: 440, radius: 5.4, label: 'Hamal (α Arietis)' },
  { id: 'sheratan', x: 925, y: 530, radius: 3.8, label: 'Sheratan (β Arietis)' },
  { id: 'mesarthim', x: 975, y: 490, radius: 3, label: 'Mesarthim (γ Arietis)' },
]

// Urutan rantai koneksi: dari bintang mana ke bintang mana garis ditarik.
// Urutan array ini juga menentukan urutan animasi reveal (titik -> garis ->
// titik berikutnya -> garis berikutnya, dst).
const ARIES_CHAIN = ['41-ari', 'hamal', 'sheratan', 'mesarthim']

// Bintang dekorasi latar (bukan bagian rasi), disebar di seluruh kanvas
// 1600x900 supaya terasa seperti langit malam penuh, bukan cuma di satu
// sudut. Posisi hardcode (bukan Math.random saat render) biar konsisten
// antar render/reload.
const BACKGROUND_STARS = [
  { x: 60, y: 80, radius: 1.4 },
  { x: 180, y: 220, radius: 1 },
  { x: 320, y: 60, radius: 1.6 },
  { x: 420, y: 340, radius: 1.1 },
  { x: 540, y: 150, radius: 0.9 },
  { x: 90, y: 420, radius: 1.2 },
  { x: 260, y: 500, radius: 1 },
  { x: 620, y: 460, radius: 1.4 },
  { x: 760, y: 120, radius: 1 },
  { x: 820, y: 380, radius: 1.3 },
  { x: 700, y: 620, radius: 0.9 },
  { x: 950, y: 260, radius: 1.1 },
  { x: 1020, y: 60, radius: 1.5 },
  { x: 1100, y: 480, radius: 1 },
  { x: 1250, y: 520, radius: 1.2 },
  { x: 1380, y: 100, radius: 0.9 },
  { x: 1420, y: 460, radius: 1.3 },
  { x: 1550, y: 560, radius: 1 },
  { x: 1500, y: 90, radius: 1.1 },
  { x: 140, y: 640, radius: 0.8 },
  { x: 380, y: 700, radius: 1.2 },
  { x: 900, y: 700, radius: 1 },
  { x: 1200, y: 700, radius: 1.4 },
  { x: 40, y: 780, radius: 0.9 },
  { x: 1550, y: 780, radius: 1.1 },
]

function findStar(id) {
  return ARIES_STARS.find((star) => star.id === id)
}

function Constellation({ className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const root = containerRef.current
    const lines = root.querySelectorAll('[data-line]')
    const constellationStars = root.querySelectorAll('[data-star]')
    const backgroundStars = root.querySelectorAll('[data-bg-star]')

    const context = gsap.context(() => {
      // Siapkan tiap garis untuk efek "digambar" pelan-pelan (stroke-dasharray trick).
      lines.forEach((line) => {
        const length = line.getTotalLength()
        line.style.strokeDasharray = String(length)
        line.style.strokeDashoffset = String(length)
      })

      gsap.set(constellationStars, { opacity: 0, scale: 0, transformOrigin: 'center' })
      gsap.set(backgroundStars, { opacity: 0 })

      const intro = gsap.timeline({ delay: 0.4 })

      // Reveal berurutan mengikuti rantai: titik pertama muncul, lalu garis
      // ke titik berikutnya "digambar", lalu titik berikutnya muncul, dst.
      ARIES_CHAIN.forEach((starId, index) => {
        const starEl = root.querySelector(`[data-star-id="${starId}"]`)

        intro.to(starEl, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(2.4)',
        })

        const nextId = ARIES_CHAIN[index + 1]
        if (nextId) {
          const lineEl = root.querySelector(`[data-line-id="${starId}-${nextId}"]`)
          intro.to(lineEl, {
            strokeDashoffset: 0,
            duration: 0.95,
            ease: 'power2.inOut',
          })
        }
      })

      intro
        .to(
          backgroundStars,
          { opacity: 1, duration: 1.2, stagger: 0.03, ease: 'power1.out' },
          '-=0.2'
        )
        .add(() => {
          // Kedipan halus tak berhenti, delay acak per bintang biar tidak
          // terlihat berkedip serempak/kaku.
          const twinkleTargets = [...constellationStars, ...backgroundStars]
          twinkleTargets.forEach((star) => {
            gsap.to(star, {
              opacity: gsap.utils.random(0.3, 0.85),
              duration: gsap.utils.random(1.8, 3.6),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: gsap.utils.random(0, 2.5),
            })
          })
        })
    }, root)

    return () => context.revert()
  }, [])

  return (
    <div ref={containerRef} className={`pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {BACKGROUND_STARS.map((star, index) => (
          <circle
            key={`bg-${index}`}
            data-bg-star
            cx={star.x}
            cy={star.y}
            r={star.radius}
            fill="#F0E4C8"
          />
        ))}

        {ARIES_CHAIN.slice(0, -1).map((fromId, index) => {
          const toId = ARIES_CHAIN[index + 1]
          const from = findStar(fromId)
          const to = findStar(toId)
          return (
            <line
              key={`${fromId}-${toId}`}
              data-line
              data-line-id={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#D4AF37"
              strokeWidth="1.4"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
          )
        })}

        {ARIES_STARS.map((star) => (
          <circle
            key={star.id}
            data-star
            data-star-id={star.id}
            cx={star.x}
            cy={star.y}
            r={star.radius}
            fill="#D4AF37"
          >
            <title>{star.label}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

export default Constellation
