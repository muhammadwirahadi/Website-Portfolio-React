import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

// Posisi 4 bintang utama Aries mengikuti bentuk rasi yang sebenarnya (pola
// "kail" khas): 41 Arietis -> Hamal (bintang paling terang) -> Sheratan ->
// Mesarthim. Radius tiap bintang kira-kira proporsional dengan magnitude
// aslinya, jadi Hamal tampak paling besar/terang. Diposisikan di tengah
// kanvas (1600x900) sebagai focal point utama Hero.
const ARIES_STARS = [
  { id: '41-ari', x: 625, y: 370, radius: 3.2, label: '41 Arietis' },
  { id: 'hamal', x: 765, y: 440, radius: 5.4, label: 'Hamal' },
  { id: 'sheratan', x: 925, y: 530, radius: 3.8, label: 'Sheratan' },
  { id: 'mesarthim', x: 965, y: 605, radius: 3, label: 'Mesarthim' },
]

// Urutan rantai koneksi: dari bintang mana ke bintang mana garis ditarik.
// Urutan array ini juga menentukan urutan animasi reveal (titik -> garis ->
// titik berikutnya -> garis berikutnya, dst).
const ARIES_CHAIN = ['41-ari', 'hamal', 'sheratan', 'mesarthim']

// Bintang paling terang di rasi ini (dipakai untuk kasih ukuran sparkle
// lebih besar dibanding bintang lain, merefleksikan magnitude aslinya).
const BRIGHTEST_STAR_ID = 'hamal'

function findStar(id) {
  return ARIES_STARS.find((star) => star.id === id)
}

// Icon sparkle 4-ujung dengan sisi melengkung (bukan garis lurus), jadi
// bentuknya halus/clean - bukan diamond kaku. Path didesain dalam kotak
// 24x24, lalu ditranslasi + diskalakan supaya pusatnya pas di (cx, cy).
const SPARKLE_ICON_PATH =
  'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'

// Icon dibungkus <g> sendiri (bukan langsung <path>) supaya punya titik pusat
// transform yang jelas (fill-box + center) - dibutuhkan untuk animasi hover
// membesar tanpa bikin bentuknya geser.
function SparkleIcon({ cx, cy, size, fill }) {
  const scale = size / 24
  return (
    <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none">
      <g data-star-icon>
        <path
          d={SPARKLE_ICON_PATH}
          fill={fill}
          transform={`scale(${scale}) translate(-12, -12)`}
        />
      </g>
    </g>
  )
}

// Hover diorkestrasi lewat GSAP supaya bintang membesar sedikit saat di-hover
// dan kembali normal saat kursor meninggalkan area bintang. Label nama
// bintang ikut fade-in/out bareng animasi yang sama.
function handleStarEnter(event) {
  const group = event.currentTarget.closest('[data-star]')
  const icon = group.querySelector('[data-star-icon]')
  const label = group.querySelector('[data-star-label]')

  gsap.killTweensOf([icon, label])

  // Membesarkan ukuran bintang sedikit dan meningkatkan kecerahan
  gsap.to(icon, {
    scale: 1.25,
    filter: 'brightness(1.5)',
    duration: 0.3,
    ease: 'power2.out',
    transformOrigin: '50% 50%',
  })

  gsap.fromTo(
    label,
    { opacity: 0, y: 6 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
  )
}

function handleStarLeave(event) {
  const group = event.currentTarget.closest('[data-star]')
  const icon = group.querySelector('[data-star-icon]')
  const label = group.querySelector('[data-star-label]')

  gsap.killTweensOf([icon, label])

  // Mengembalikan ukuran dan kecerahan bintang ke kondisi semula. Setelah
  // selesai, properti `filter` dilepas total (bukan cuma di-set 'brightness(1)')
  // supaya elemen tidak "terjebak" di layer komposit terpisah - filter yang
  // masih nempel (walau netral) bisa bikin browser me-rasterize elemen jadi
  // bitmap sebelum di-scale oleh animasi zoom, yang berujung ke blur.
  gsap.to(icon, {
    scale: 1,
    filter: 'brightness(1)',
    duration: 0.3,
    ease: 'power2.out',
    transformOrigin: '50% 50%',
    onComplete: () => gsap.set(icon, { clearProps: 'filter' }),
  })

  gsap.to(label, { opacity: 0, y: 6, duration: 0.2, ease: 'power2.out' })
}

// Label nama bintang - dirender native di dalam SVG (bukan tooltip browser
// bawaan) supaya font & warnanya konsisten sama desain. Teknik stroke ganda
// (outline gelap di belakang, fill terang di depan) dipakai supaya teksnya
// tetap kebaca jelas di atas background apapun, tanpa perlu kotak latar.
function StarLabel({ x, y, offsetY, text }) {
  const labelY = y - offsetY
  return (
    <g data-star-label className="pointer-events-none" style={{ opacity: 0 }}>
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        fontFamily="Archivo, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="0.4"
        stroke="#0A0608"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      >
        {text}
      </text>
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        fontFamily="Archivo, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="0.4"
        fill="#F0E4C8"
      >
        {text}
      </text>
    </g>
  )
}

function Constellation({ className = '', onIntroComplete }) {
  const containerRef = useRef(null)
  const twinkleTweensRef = useRef([])
  const isScrollingRef = useRef(false)

  useLayoutEffect(() => {
    const root = containerRef.current
    const lines = root.querySelectorAll('[data-line]')
    const constellationStars = root.querySelectorAll('[data-star]')
    const starHitAreas = root.querySelectorAll('[data-star-hit]')

    // Dideklarasikan di luar gsap.context supaya bisa di-assign dari dalam
    // callback-nya tanpa mengacu ke variabel `context` sebelum dia selesai
    // di-assign (referencing `context` di dalam initializer-nya sendiri akan
    // error - variabel `const` belum ada nilainya saat callback-nya jalan).
    let removeScrollListener

    const context = gsap.context(() => {
      // Siapkan tiap garis untuk efek "digambar" pelan-pelan (stroke-dasharray trick).
      lines.forEach((line) => {
        const length = line.getTotalLength()
        line.style.strokeDasharray = String(length)
        line.style.strokeDashoffset = String(length)
      })

      gsap.set(constellationStars, { opacity: 0 })

      const intro = gsap.timeline({ delay: 0.4 })

      // Reveal berurutan mengikuti rantai: titik pertama muncul, lalu garis
      // ke titik berikutnya "digambar", lalu titik berikutnya muncul, dst.
      ARIES_CHAIN.forEach((starId, index) => {
        const starEl = root.querySelector(`[data-star-id="${starId}"]`)

        intro.to(starEl, {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
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

      intro.add(() => {
        // Beri tahu parent (App) bahwa intro rasi bintang sudah selesai,
        // supaya navbar bisa mulai animasi muncul.
        onIntroComplete?.()

        // Kedipan halus tak berhenti, delay acak per bintang biar tidak
        // terlihat berkedip serempak/kaku. Opacity minimum dijaga cukup
        // tinggi supaya garis penghubung di baliknya tidak "nembus"
        // kelihatan saat lagi redup (jadi tetap rapi). Referensi tween-nya
        // disimpan supaya bisa di-pause/resume saat user scroll (lihat di
        // bawah - dipakai untuk mekanisme zoom scroll di App.jsx).
        constellationStars.forEach((star) => {
          const tween = gsap.to(star, {
            opacity: gsap.utils.random(0.65, 1),
            duration: gsap.utils.random(1.8, 3.6),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: gsap.utils.random(0, 2.5),
          })
          twinkleTweensRef.current.push(tween)
        })
      })

      // Selama user sedang scroll (proses zoom di App.jsx berlangsung),
      // kedipan dihentikan sementara dan opacity dipaksa penuh - supaya
      // rasi bintang terlihat solid/jelas saat di-zoom, bukan berkedip.
      // Hover juga dimatikan sementara (area hit-nya dibuat pointer-events:
      // none) supaya tidak ada efek membesar/label muncul saat kursor
      // kebetulan lewat di atas bintang selagi di-zoom. Balik ke posisi
      // scroll paling atas -> kedipan & hover jalan lagi seperti semula.
      const handleScroll = () => {
        if (window.scrollY > 0) {
          if (!isScrollingRef.current) {
            isScrollingRef.current = true
            twinkleTweensRef.current.forEach((tween) => tween.pause())
            gsap.to(constellationStars, { opacity: 1, duration: 0.25, overwrite: 'auto' })
            starHitAreas.forEach((hit) => {
              hit.style.pointerEvents = 'none'
            })
          }
        } else if (isScrollingRef.current) {
          isScrollingRef.current = false
          twinkleTweensRef.current.forEach((tween) => tween.resume())
          starHitAreas.forEach((hit) => {
            hit.style.pointerEvents = 'auto'
          })
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      removeScrollListener = () => window.removeEventListener('scroll', handleScroll)
    }, root)

    return () => {
      removeScrollListener?.()
      context.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className={`pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Halo lembut di sekeliling tiap bintang rasi - bikin efek
              "bercahaya" alih-alih titik solid flat. */}
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8F1DC" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          {/* Inti bintang dekorasi latar dipindah ke komponen Sparkles
              (canvas particle) - gradient ini cuma dipakai untuk halo bintang
              rasi Aries sekarang. */}
        </defs>

        {ARIES_CHAIN.slice(0, -1).map((fromId, index) => {
          const toId = ARIES_CHAIN[index + 1]
          const from = findStar(fromId)
          const to = findStar(toId)
          return (
            <g key={`${fromId}-${toId}`}>
              {/* Garis konstelasi asli */}
              <line
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
              {/* Garis transparan tebal (hit area) agar mudah di-hover kursor */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="transparent"
                strokeWidth="20"
                strokeLinecap="round"
                className="pointer-events-auto cursor-pointer"
                data-aries-hover
              />
            </g>
          )
        })}

        {ARIES_STARS.map((star) => {
          const isBrightest = star.id === BRIGHTEST_STAR_ID
          const iconSize = star.radius * (isBrightest ? 6.5 : 5)
          const iconFill = isBrightest ? '#F8F1DC' : '#F0E4C8'
          // Area hover: lingkaran tak terlihat, sedikit lebih besar dari ikon
          // supaya nyaman di-hover, dengan bentuk bulat penuh (tanpa celah
          // cekung) supaya kursor tidak keluar-masuk berkali-kali.
          const hitRadius = iconSize * 0.62

          return (
            <g key={star.id} data-star data-star-id={star.id}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.radius * 6.5}
                fill="url(#starGlow)"
                className="pointer-events-none"
              />

              <StarLabel
                x={star.x}
                y={star.y}
                offsetY={iconSize / 2 + 16}
                text={star.label}
              />

              <SparkleIcon cx={star.x} cy={star.y} size={iconSize} fill={iconFill} />

              <circle
                cx={star.x}
                cy={star.y}
                r={hitRadius}
                fill="transparent"
                data-star-hit
                className="pointer-events-auto cursor-pointer"
                onMouseEnter={handleStarEnter}
                onMouseLeave={handleStarLeave}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default Constellation
