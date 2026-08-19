import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RotatingText({
  texts = ['Web Developer', 'Junior Developer', 'Full Stack Developer'],
  intervalMs = 3000,
  className = '',
}) {
  const [index, setIndex] = useState(0)
  const isMounted = useRef(true)

  const textsSerialized = texts.join(',')
  // Interval otomatis pergantian kata
  useEffect(() => {
    isMounted.current = true
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, intervalMs)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [textsSerialized, intervalMs])

  // Pergantian kata saat di-hover (Pointer Enter)
  const handleHover = () => {
    setIndex((prev) => (prev + 1) % texts.length)
  }

  return (
    <span
      onPointerEnter={handleHover}
      className={className}
      style={{
        display: 'inline-flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'inherit',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            position: 'relative',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
            letterSpacing: 'inherit',
            textTransform: 'inherit',
            color: 'inherit',
          }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
