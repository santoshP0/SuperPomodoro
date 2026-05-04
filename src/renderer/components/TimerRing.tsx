import { motion } from 'framer-motion'

interface TimerRingProps {
  remaining: number
  total: number
  state: string
  size?: number
}

const STATE_COLORS: Record<string, string> = {
  WORK: '#ff4757',
  SHORT_BREAK: '#2d98da',
  LONG_BREAK: '#20bf6b',
  PAUSED: '#a4b0be',
  IDLE: '#ff4757'
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function TimerRing({ remaining, total, state, size = 200 }: TimerRingProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? remaining / total : 1
  const dashOffset = circumference * (1 - progress)
  const color = STATE_COLORS[state] ?? STATE_COLORS.IDLE

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={8}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {/* Center label */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          key={remaining}
          className="text-4xl font-semibold tracking-tight tabular-nums"
          style={{ color: 'rgba(255,255,255,0.95)', fontVariantNumeric: 'tabular-nums' }}
          initial={{ scale: 0.96, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {formatTime(remaining)}
        </motion.span>
        <span className="text-xs mt-1 font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {state === 'IDLE' ? 'Ready' :
           state === 'WORK' ? 'Focus' :
           state === 'SHORT_BREAK' ? 'Short Break' :
           state === 'LONG_BREAK' ? 'Long Break' : 'Paused'}
        </span>
      </div>
    </div>
  )
}
