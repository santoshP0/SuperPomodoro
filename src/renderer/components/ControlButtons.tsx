import { motion } from 'framer-motion'
import type { TimerState } from '../types/ipc'

interface ControlButtonsProps {
  state: TimerState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const btn =
  'flex items-center justify-center rounded-full transition-opacity active:scale-95 select-none cursor-default'

export function ControlButtons({ state, onStart, onPause, onReset, onSkip }: ControlButtonsProps) {
  const isIdle = state === 'IDLE'
  const isPaused = state === 'PAUSED'
  const isRunning = state === 'WORK' || state === 'SHORT_BREAK' || state === 'LONG_BREAK'

  return (
    <div className="flex items-center gap-4">
      {/* Reset */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={`${btn} w-10 h-10`}
        style={{ color: 'rgba(255,255,255,0.4)' }}
        onClick={onReset}
        title="Reset"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </motion.button>

      {/* Play / Pause — primary button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`${btn} w-16 h-16`}
        style={{
          background: 'rgba(255,71,87,0.9)',
          boxShadow: '0 4px 24px rgba(255,71,87,0.35)',
          color: 'white'
        }}
        onClick={isRunning ? onPause : onStart}
        title={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        )}
      </motion.button>

      {/* Skip */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={`${btn} w-10 h-10`}
        style={{ color: isIdle ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)' }}
        onClick={onSkip}
        disabled={isIdle}
        title="Skip"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5,4 15,12 5,20"/>
          <line x1="19" y1="5" x2="19" y2="19"/>
        </svg>
      </motion.button>
    </div>
  )
}
