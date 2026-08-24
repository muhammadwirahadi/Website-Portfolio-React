import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
}

export default function HoverImageReveal({
  items = [],
  textColor = "#4A1620",
  dimColor = "rgba(74, 22, 32, 0.35)",
  rowGap = 20,
  imageWidth = 280,
  imageHeight = 360,
  rounded = 16,
  offsetX = 0,
  offsetY = 0,
  transition = DEFAULT_TRANSITION,
  style,
  cursorText = "",
  onItemClick,
}) {
  const containerRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  
  // Smooth spring physics for mouse following
  const springCfg = { stiffness: 180, damping: 25, mass: 0.6 }
  const x = useSpring(rawX, springCfg)
  const y = useSpring(rawY, springCfg)

  const anyActive = hovered != null

  const onMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(e.clientX - rect.left + offsetX)
    rawY.set(e.clientY - rect.top + offsetY)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        width: "100%",
        ...style,
      }}
    >
      {/* Floating Hover Image Reveal Container */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: imageWidth,
          height: imageHeight,
          borderRadius: rounded,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 30,
        }}
        animate={{ opacity: anyActive ? 1 : 0 }}
        transition={transition}
      >
        {items.map((item, i) => {
          const src = item.image?.src
          const yPos =
            hovered == null
              ? "100%"
              : i < hovered
                ? "-100%"
                : i > hovered
                  ? "100%"
                  : "0%"
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ y: yPos }}
              transition={transition}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt={item.company || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg,#333,#111)",
                  }}
                />
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Row List */}
      <div
        onMouseLeave={() => setHovered(null)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${rowGap}px`,
          width: "100%",
        }}
      >
        {items.map((item, i) => {
          const isHovered = hovered === i
          const color = anyActive ? (isHovered ? textColor : dimColor) : textColor

          const companyStyle = {
            display: "block",
            fontWeight: 700,
            textTransform: "none",
            transition: "color 0.25s ease-out",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onClick={() => onItemClick?.(item, i)}
              className="cursor-pointer"
              data-cursor-text={cursorText}
              style={{
                overflow: "hidden",
                width: "100%",
              }}
            >
              <div className="w-full py-6 md:py-8 border-b border-[#4A1620]/15 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Left: Company Name (slides up on hover) */}
                <div className="w-full md:w-[55%] text-left flex items-center" style={{ overflow: "hidden", clipPath: "inset(0px)" }}>
                  <motion.div
                    style={{ position: "relative", width: "100%" }}
                    animate={{ y: isHovered ? "-100%" : "0%" }}
                    transition={transition}
                  >
                    <span
                      style={{
                        ...companyStyle,
                        color,
                      }}
                      className="text-2xl md:text-4xl font-bold font-sans"
                    >
                      {item.company}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        ...companyStyle,
                        color,
                        position: "absolute",
                        top: "100%",
                        left: 0,
                      }}
                      className="text-2xl md:text-4xl font-bold font-sans"
                    >
                      {item.company}
                    </span>
                  </motion.div>
                </div>

                {/* Desktop layout for Period and Role */}
                <div className="hidden md:flex md:w-[45%] items-center justify-between">
                  {/* Center: Period */}
                  <div
                    className="w-[35%] text-center text-xs md:text-sm lg:text-base font-mono font-medium"
                    style={{
                      color,
                      transition: "color 0.25s ease-out",
                    }}
                  >
                    {item.period}
                  </div>

                  {/* Right: Role */}
                  <div
                    className="w-[65%] text-right text-xs md:text-base lg:text-lg font-medium"
                    style={{
                      color,
                      transition: "color 0.25s ease-out",
                    }}
                  >
                    {item.role}
                  </div>
                </div>

                {/* Mobile layout for Period and Role (underneath) */}
                <div
                  className="flex md:hidden items-center gap-2 mt-1.5 text-xs font-medium"
                  style={{
                    color,
                    transition: "color 0.25s ease-out",
                  }}
                >
                  <span>{item.role}</span>
                  <span className="opacity-40">•</span>
                  <span className="font-mono">{item.period}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
