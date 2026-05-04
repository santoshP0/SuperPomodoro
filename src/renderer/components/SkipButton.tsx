import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SkipButtonProps {
  delayMs?: number
}

export function SkipButton({ delayMs = 5000 }: SkipButtonProps) {
  const [visible, setVisible] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Show after delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  // Forward mousemove to IPC so main can toggle setIgnoreMouseEvents
  useEffect(() => {
    if (!visible) return

    const handler = (e: MouseEvent) => {
      const btn = btnRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      const over =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom

      if (over) {
        window.overlayAPI?.notifySkipHover()
      } else {
        window.overlayAPI?.notifySkipLeave()
      }
    }

    window.addEventListener('mousemove', handler)
    return () => {
      window.removeEventListener('mousemove', handler)
      window.overlayAPI?.notifySkipLeave()
    }
  }, [visible])

  if (!visible) return null

  return (
    <motion.button
      ref={btnRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={() => window.overlayAPI?.sendSkip()}
      className="px-6 py-2 rounded-full text-sm font-medium cursor-default"
      style={{
        pointerEvents: 'auto',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)'
      }}
      whileHover={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.95)' }}
      whileTap={{ scale: 0.96 }}
    >
      Skip Break
    </motion.button>
  )
}
