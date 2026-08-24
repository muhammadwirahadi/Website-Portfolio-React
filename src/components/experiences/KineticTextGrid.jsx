import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

export default function KineticTextGrid({
  text = "EXPERIENCES",
  textColor = "#4A1620",
  backgroundColor = "transparent",
  rowCount = 5,
  repeatCount = 5,
  rowGap = 20,
  wordGap = 28,
  expandDurationSec = 0.8,
  zoomScalePct = 120,
  onComplete,
  style,
}) {
  const [fontSize, setFontSize] = useState(80)

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? 32 : 80)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const font = useMemo(() => ({
    fontFamily: 'var(--font-display), "Archivo", sans-serif',
    fontWeight: 700,
    fontSize: fontSize,
    textTransform: "uppercase",
    lineHeight: "1.1em",
    letterSpacing: "0.35em",
    textAlign: "center",
  }), [fontSize])

  // Keep counts odd for an exact geometric center
  const safeRowCount = rowCount % 2 === 0 ? rowCount + 1 : rowCount
  const centerRowIndex = Math.floor(safeRowCount / 2)
  const safeRepeatCount = repeatCount % 2 === 0 ? repeatCount + 1 : repeatCount
  const centerWordIndex = Math.floor(safeRepeatCount / 2)

  const rows = useMemo(() => Array.from({ length: safeRowCount }, (_, i) => i), [safeRowCount])
  const words = useMemo(() => Array.from({ length: safeRepeatCount }, (_, i) => i), [safeRepeatCount])

  const maxZoomScale = zoomScalePct / 100
  const HOME_FACTOR = 0.4
  const horizontalShiftPx = window.innerWidth < 768 ? 90 : 160

  // Animation timeline configuration (Only play the first zoom and wipe phase)
  const tIn = expandDurationSec
  const tWipe = tIn + expandDurationSec
  const total = tWipe

  const n = (t) => t / total

  const seq = (times) => ({
    duration: total,
    times,
    ease: [0.44, 0, 0.56, 1],
    repeat: 0, // Play only once!
  })

  // Trigger onComplete callback when the animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, total * 1000)
    return () => clearTimeout(timer)
  }, [total, onComplete])

  const VISIBLE = "inset(0% 0% 0% 0%)"

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "visible",
        ...style,
      }}
    >
      <motion.div
        animate={{ scale: [1, maxZoomScale, 1] }}
        transition={seq([0, n(tIn), 1])}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: rowGap,
          position: "relative",
          willChange: "transform",
        }}
      >
        {rows.map((rowIndex) => {
          const isCenterRow = rowIndex === centerRowIndex
          const distanceFromCenterY = rowIndex - centerRowIndex
          const direction = rowIndex % 2 === 0 ? 1 : -1

          const speedMultiplier = 0.7 + (Math.abs(distanceFromCenterY) % 3) * 0.45
          const driftFull = direction * horizontalShiftPx * speedMultiplier
          const driftHome = driftFull * HOME_FACTOR

          const wipeLTR = rowIndex % 2 === 0
          const hidden = wipeLTR ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)"

          const xAnim = isCenterRow
            ? {
                values: [driftHome, driftFull, 0],
                times: [0, n(tIn), 1],
              }
            : {
                values: [driftHome, driftFull, driftFull],
                times: [0, n(tIn), 1],
              }

          return (
            <motion.div
              key={rowIndex}
              animate={{ x: xAnim.values }}
              transition={seq(xAnim.times)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: wordGap,
                whiteSpace: "nowrap",
                willChange: "transform",
              }}
            >
              {words.map((wordIndex) => {
                const isCenterWord = isCenterRow && wordIndex === centerWordIndex

                if (isCenterWord) {
                  return (
                    <span
                      key={wordIndex}
                      style={{
                        color: textColor,
                        lineHeight: 1,
                        display: "inline-block",
                        clipPath: VISIBLE,
                        ...font,
                      }}
                    >
                      {text}
                    </span>
                  )
                }

                const denom = Math.max(1, safeRepeatCount - 1)
                const sweepT = wipeLTR ? wordIndex / denom : (safeRepeatCount - 1 - wordIndex) / denom

                const wipeWindow = tWipe - tIn
                const perWipe = wipeWindow * 0.5
                const wStartOut = tIn + sweepT * (wipeWindow - perWipe)
                const wEndOut = wStartOut + perWipe

                return (
                  <motion.span
                    key={wordIndex}
                    animate={{
                      clipPath: [VISIBLE, VISIBLE, hidden],
                    }}
                    transition={seq([0, n(wStartOut), n(wEndOut)])}
                    style={{
                      color: textColor,
                      lineHeight: 1,
                      display: "inline-block",
                      clipPath: VISIBLE,
                      willChange: "clip-path",
                      ...font,
                    }}
                  >
                    {text}
                  </motion.span>
                )
              })}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
