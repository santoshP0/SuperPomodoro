import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkipButton } from '../../components/SkipButton'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function OverlayWindow() {
  const params = new URLSearchParams(window.location.search)
  const breakType = params.get('breakType') ?? 'SHORT_BREAK'
  const isLong = breakType === 'LONG_BREAK'

  const [remaining, setRemaining] = useState<number | null>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!window.overlayAPI) return

    const cleanup = window.overlayAPI.onCountdownUpdate((r) => setRemaining(r))

    window.overlayAPI.onClose(() => {
      setClosing(true)
    })

    return cleanup
  }, [])

  const accentColor = isLong ? '#20bf6b' : '#2d98da'
  const label = isLong ? 'Long Break' : 'Short Break'
  const message = isLong
    ? 'Great work! Take a longer rest.'
    : 'Step away from the screen.'

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            pointerEvents: 'none',
            background: 'rgba(8, 8, 12, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
        >
          {/* Content card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
            className="flex flex-col items-center gap-5"
          >
            {/* Break label */}
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: accentColor, opacity: 0.9 }}
            >
              {label}
            </span>

            {/* Countdown */}
            <motion.div
              key={remaining}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.12 }}
              className="text-[80px] font-thin tabular-nums leading-none"
              style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-2px' }}
            >
              {remaining !== null ? formatTime(remaining) : '—'}
            </motion.div>

            {/* Subtitle */}
            <p className="text-base font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {message}
            </p>

            {/* Accent line */}
            <motion.div
              className="rounded-full mt-2"
              style={{ width: 48, height: 3, background: accentColor, opacity: 0.6 }}
              animate={{ scaleX: remaining !== null ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Skip button — visible after 5 seconds */}
            <div className="mt-4" style={{ pointerEvents: 'auto' }}>
              <SkipButton delayMs={5000} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
