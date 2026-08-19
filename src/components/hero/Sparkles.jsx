import { useEffect, useRef } from 'react'

// Stardust - background partikel kecil yang flicker (berkedip) & drift
// (bergeser) pelan lewat canvas 2D. Menggantikan pendekatan titik SVG statis
// sebelumnya untuk bintang dekorasi latar - lebih halus & terasa hidup,
// tanpa perlu daftar posisi manual.

function parseColorToRgba(input) {
  if (!input) return { r: 0, g: 0, b: 0, a: 1 }
  const str = input.trim().toLowerCase()
  if (str === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }

  const rgbaMatch = str.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i
  )
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255
    const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255
    const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255
    const a =
      rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1
    return { r, g, b, a }
  }

  const hex = str.replace(/^#/, '')
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    }
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1,
    }
  }
  if (hex.length === 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: parseInt(hex[3] + hex[3], 16) / 255,
    }
  }
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    }
  }
  return { r: 0, g: 0, b: 0, a: 1 }
}

function rgbaToCanvasColor(rgba) {
  const r = Math.round(rgba.r * 255)
  const g = Math.round(rgba.g * 255)
  const b = Math.round(rgba.b * 255)
  if (rgba.a === 1) return `rgb(${r}, ${g}, ${b})`
  return `rgba(${r}, ${g}, ${b}, ${rgba.a})`
}

// Default disesuaikan ke palette Wira (gold/cream) dan dibuat cukup jarang
// (density rendah) supaya tetap terasa halus, bukan "rame"/noise penuh layar.
const DEFAULTS = {
  background: 'transparent',
  particleColor: '#F0E4C8',
  particleDensity: 1,
  minSize: 0.5,
  maxSize: 1.6,
  speed: 2,
  particleSpeed: 1,
  movement: 1,
  angle: 64,
}

// UI 1..10 -> internal 0.5..12 (kecepatan flicker)
function mapFlickerUiToInternal(ui) {
  const clamped = Math.max(1, Math.min(10, ui))
  const t = (clamped - 1) / 9
  return 0.5 + t * 11.5
}

// UI 1..10 -> internal 5..60 (kepadatan partikel)
function mapDensityUiToInternal(ui) {
  const clamped = Math.max(1, Math.min(10, ui))
  const t = (clamped - 1) / 9
  return 5 + t * 55
}

// Sudut (derajat) -> vektor arah drift. 0deg = atas, 90deg = kanan, dst
// (searah jarum jam dari atas).
function angleToDrift(angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { vx: Math.cos(rad), vy: Math.sin(rad) }
}

function Sparkles({
  background = DEFAULTS.background,
  particleColor = DEFAULTS.particleColor,
  particleDensity = DEFAULTS.particleDensity,
  minSize = DEFAULTS.minSize,
  maxSize = DEFAULTS.maxSize,
  speed = DEFAULTS.speed,
  particleSpeed = DEFAULTS.particleSpeed,
  movement = DEFAULTS.movement,
  angle = DEFAULTS.angle,
  className = '',
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initParticles = (width, height) => {
      const particles = []
      const area = width * height
      const mappedDensity = mapDensityUiToInternal(particleDensity)
      const count = Math.floor((area / 1e4) * mappedDensity)
      const velocityMultiplier = (particleSpeed / 10) * 0.5

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * velocityMultiplier,
          vy: (Math.random() - 0.5) * velocityMultiplier,
          size: minSize + Math.random() * (maxSize - minSize),
          opacity: Math.random(),
          opacityVel: (Math.random() - 0.5) * 0.04,
        })
      }
      particlesRef.current = particles
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = container.clientWidth || container.offsetWidth || 1
      const height = container.clientHeight || container.offsetHeight || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles(width, height)
    }
    resize()

    const mappedSpeed = mapFlickerUiToInternal(speed)
    const driftMag = movement * 0.1
    const { vx: driftDirX, vy: driftDirY } = angleToDrift(angle)
    const driftVx = driftDirX * driftMag
    const driftVy = driftDirY * driftMag

    const backgroundRgba = parseColorToRgba(background)
    const backgroundColor = rgbaToCanvasColor(backgroundRgba)
    const particleColorRgba = parseColorToRgba(particleColor)
    const particleColorBase = rgbaToCanvasColor({ ...particleColorRgba, a: 1 })

    const drawParticles = (width, height) => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = particleColorBase
      for (const particle of particlesRef.current) {
        ctx.globalAlpha = particleColorRgba.a * particle.opacity
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const animate = () => {
      const dpr = window.devicePixelRatio || 1
      const width = canvas.width / dpr
      const height = canvas.height / dpr

      for (const particle of particlesRef.current) {
        particle.x += particle.vx + driftVx
        particle.y += particle.vy + driftVy
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        particle.opacity += particle.opacityVel * mappedSpeed * 0.5
        if (particle.opacity <= 0.1 || particle.opacity >= 1) {
          particle.opacityVel *= -1
        }
        particle.opacity = Math.max(0.1, Math.min(1, particle.opacity))
      }

      drawParticles(width, height)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('resize', resize)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [
    background,
    particleColor,
    particleDensity,
    minSize,
    maxSize,
    speed,
    particleSpeed,
    movement,
    angle,
  ])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  )
}

export default Sparkles
