import { useEffect, useMemo, useRef, useState } from 'react'

// Interactive Grid - grid kartu yang "membesar" begitu di-hover, kartu di
// sekitarnya ikut sedikit membesar juga (efek magnify). Diadaptasi dari
// komponen Originkit (awalnya TypeScript/Framer) jadi JavaScript biasa.

const NS = 'interactive-grid'
const MAX_GLOW_BLUR = 16
const DURATION = 200
const LEAVE_DELAY = 200

const CSS = `
.${NS}-card {
  transition: all ${DURATION}ms;
}
.${NS}-shadow {
  box-shadow:
    2px 2px 5px var(--ag-shadow),
    3px 3px 10px var(--ag-shadow),
    6px 6px 20px var(--ag-shadow);
}
.${NS}-card img {
  opacity: 0.75;
  transition: all ${DURATION}ms;
}
.${NS}-card:hover img { opacity: 1; }

.${NS}-small {
  transform: scale(1.05) translate(-5px) translateY(-5px) translateZ(0);
}
.${NS}-big {
  transform: scale(1.15) translate(-20px) translateY(-20px) translateZ(15px);
}

.${NS}-glow-big {
  animation: ${NS}-glow 1.5s ease-in-out infinite alternate;
}
.${NS}-glow-small {
  animation: ${NS}-glow-small 1.5s ease-in-out infinite alternate;
}
@keyframes ${NS}-glow {
  0%  { filter: drop-shadow(0 0 2px var(--ag-glow-start)); }
  to  { filter: drop-shadow(0 1px var(--ag-glow-blur) var(--ag-glow-end)); }
}
@keyframes ${NS}-glow-small {
  0%  { filter: drop-shadow(0 0 2px var(--ag-glow-start)); }
  to  { filter: drop-shadow(0 1px var(--ag-glow-blur-small) var(--ag-glow-start)); }
}
`

const srcOf = (image) => (typeof image === 'string' ? image : image?.src ?? '')

function InteractiveGrid({
  images = [],
  padding = '0px',
  columns = 6,
  rows = 3,
  gap = 0,
  rounded = 12,
  logoScale = 3,
  cardFill = '#f0e4c8',
  cardBorder = 'rgba(74, 22, 32, 0.15)',
  shadow = true,
  cardShadow = 'rgba(74, 22, 32, 0.15)',
  glow = true,
  glowStart = 'rgba(212, 175, 55, 0.25)',
  glowEnd = '#D4AF37',
  glowIntensity = 45,
  perspective = 1600,
  rotateX = 0,
  rotateY = 0,
  className = '',
}) {
  const urls = useMemo(() => (images ?? []).map(srcOf).filter(Boolean), [images])

  const cols = Math.max(1, Math.round(columns))
  const rowCount = Math.max(1, Math.round(rows))
  const count = cols * rowCount

  const [hovered, setHovered] = useState(null)
  const leaveTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  const neighbours = useMemo(() => {
    if (hovered === null) return []
    const out = []
    if (hovered % cols !== 0) out.push(hovered - 1)
    if (hovered % cols !== cols - 1) out.push(hovered + 1)
    out.push(hovered - cols)
    out.push(hovered + cols)
    return out.filter((n) => n >= 0 && n < count)
  }, [hovered, cols, count])

  const onEnter = (i) => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    setHovered(i)
  }
  const onLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => setHovered(null), LEAVE_DELAY)
  }

  const glowBlur = (Math.min(100, Math.max(0, glowIntensity)) / 100) * MAX_GLOW_BLUR
  const logoPct = Math.min(10, Math.max(1, Math.round(logoScale))) * 20

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        boxSizing: 'border-box',
        '--ag-shadow': cardShadow,
        '--ag-glow-start': glowStart,
        '--ag-glow-end': glowEnd,
        '--ag-glow-blur': `${glowBlur.toFixed(1)}px`,
        '--ag-glow-blur-small': `${(glowBlur / 2).toFixed(1)}px`,
      }}
    >
      <style>{CSS}</style>
      <div
        onPointerLeave={onLeave}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          gap,
          width: '100%',
          height: '100%',
          transform: `perspective(${perspective}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const isBig = hovered === i
          const isSmall = !isBig && neighbours.includes(i)
          return (
            <div
              key={i}
              onPointerEnter={() => onEnter(i)}
              className={[
                `${NS}-card`,
                shadow && `${NS}-shadow`,
                isBig && `${NS}-big`,
                isSmall && `${NS}-small`,
                glow && isBig && `${NS}-glow-big`,
                glow && isSmall && `${NS}-glow-small`,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 12px',
                background: cardFill,
                border: `1px solid ${cardBorder}`,
                borderRadius: rounded,
                boxSizing: 'border-box',
                minWidth: 0,
                minHeight: 0,
                aspectRatio: '1 / 1',
                overflow: 'visible',
                zIndex: isBig ? count + 1 : i + 1,
              }}
            >
              {urls[i % urls.length] && (
                <img
                  src={urls[i % urls.length]}
                  alt=""
                  draggable={false}
                  style={{
                    width: `${logoPct}%`,
                    height: `${logoPct}%`,
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InteractiveGrid
