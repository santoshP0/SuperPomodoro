import { motion } from 'framer-motion'

interface SessionDotsProps {
  current: number
  total: number
  completed: number
}

export function SessionDots({ current, total, completed }: SessionDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const sessionNum = i + 1
        const isDone = sessionNum < current
        const isActive = sessionNum === current

        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: isActive ? 1.2 : 1,
              opacity: isDone ? 0.9 : isActive ? 1 : 0.3
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="rounded-full"
            style={{
              width: isActive ? 10 : 7,
              height: isActive ? 10 : 7,
              background: isDone
                ? 'rgba(255,71,87,0.8)'
                : isActive
                ? '#ff4757'
                : 'rgba(255,255,255,0.25)'
            }}
          />
        )
      })}
      {completed > 0 && (
        <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {completed} today
        </span>
      )}
    </div>
  )
}
