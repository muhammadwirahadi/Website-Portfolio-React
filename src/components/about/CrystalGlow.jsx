import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

function __OriginkitBase_CrystalGlow({
  text = 'Click!',
  fontFamily = 'Playball, cursive',
  fontWeight = 400,
  fontSize = '', // Biarkan kosong agar mewarisi font-size dari elemen induk h2
  textColor = '#4a1620', // Maroon asli web
  shadowColor = 'rgba(212, 175, 55, 0.4)', // Gold lembut
  glareColor = 'rgba(240, 228, 200, 0.75)', // Cream glare
  glareSpeed = 1,
  glareDirection = 'left-to-right',
  transition = { type: 'spring', stiffness: 400, damping: 25, mass: 1 },
}) {
  const variants = useMemo(() => {
    let hoverPos = 1
    let restPos = 0
    if (glareDirection === 'right-to-left') {
      hoverPos = 0
      restPos = 1
    }

    return {
      rest: {
        '--hover': 0.4,
        '--pos': restPos,
        transition: {
          '--hover': transition,
          '--pos': { duration: 0 },
        },
      },
      hover: {
        '--hover': 1,
        '--pos': hoverPos,
        transition: {
          '--hover': transition,
          '--pos': {
            duration: 1 / glareSpeed,
            ease: 'linear',
          },
        },
      },
      tap: {
        '--hover': 0,
      },
    }
  }, [glareDirection, glareSpeed, transition])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
.sparkle-button {
  padding: 0px;
  text-decoration: none;
  color: transparent;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.sparkle-button span {
  display: inline-block;
  font-size: var(--font-size, inherit);
  font-weight: ${fontWeight};
  text-decoration: none;
  color: transparent;
  
  /* Gunakan unit em agar bayangan membesar/mengecil otomatis mengikuti font-size induk */
  text-shadow:
    calc(var(--hover) * -0.0em) calc(var(--hover) * 0.0em) var(--shadow),
    calc(var(--hover) * -0.02em) calc(var(--hover) * 0.02em) var(--shadow),
    calc(var(--hover) * -0.04em) calc(var(--hover) * 0.04em) var(--shadow),
    calc(var(--hover) * -0.06em) calc(var(--hover) * 0.06em) var(--shadow),
    calc(var(--hover) * -0.08em) calc(var(--hover) * 0.08em) var(--shadow),
    calc(var(--hover) * -0.10em) calc(var(--hover) * 0.10em) var(--shadow);
  transform: translate(calc(var(--hover) * 0.10em), calc(var(--hover) * -0.10em));
}

.sparkle-button span:last-of-type {
  position: absolute;
  inset: 0;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(
    108deg,
    transparent 0 55%,
    var(--glare) 55% 60%,
    transparent 60% 70%,
    var(--glare) 70% 85%,
    transparent 85%
  ) calc(var(--pos) * -200%) 0% / 200% 100%, var(--color);
  -webkit-background-clip: text;
  color: transparent;
  z-index: 2;
  text-shadow: none;
}

.sparkle-button svg {
  position: absolute;
  z-index: 3;
  width: 0.6em;
  height: 0.6em;
  pointer-events: none;
  top: calc(var(--y, 50) * 1%);
  left: calc(var(--x, 0) * 1%);
  transform: translate(-50%, -50%) scale(0);
}

.sparkle-button svg path {
  fill: var(--glare);
}

.sparkle-button:hover svg {
  animation: sparkle 0.75s calc((var(--delay-step) * var(--d)) * 1s) both;
}

@keyframes sparkle {
  50% {
    transform: translate(-50%, -50%) scale(var(--s, 1));
  }
}

.sparkle-button svg:nth-of-type(1) { --x: -5; --y: 20; --s: 1.1; --d: 1; --delay-step: 0.15; }
.sparkle-button svg:nth-of-type(2) { --x: 15; --y: 80; --s: 1.25; --d: 2; --delay-step: 0.15; }
.sparkle-button svg:nth-of-type(3) { --x: 50; --y: -10; --s: 1.1; --d: 3; --delay-step: 0.15; }
.sparkle-button svg:nth-of-type(4) { --x: 80; --y: 90; --s: 0.9; --d: 2; --delay-step: 0.15; }
.sparkle-button svg:nth-of-type(5) { --x: 105; --y: 30; --s: 0.8; --d: 4; --delay-step: 0.15; }
`}</style>

      <motion.span
        className="sparkle-button cursor-pointer"
        style={{
          fontFamily,
          '--color': textColor,
          '--shadow': shadowColor,
          '--glare': glareColor,
          '--font-size': fontSize ? `${fontSize}px` : 'inherit',
        }}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={variants}
      >
        <Sparkle />
        <Sparkle />
        <Sparkle />
        <Sparkle />
        <Sparkle />

        <span>{text}</span>
        <span aria-hidden="true">{text}</span>
      </motion.span>
    </div>
  )
}

function Sparkle() {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z" />
    </svg>
  )
}

export default function CrystalGlow(props) {
  return <__OriginkitBase_CrystalGlow {...props} />
}
