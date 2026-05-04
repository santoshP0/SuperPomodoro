import { motion } from 'framer-motion'
import { TimerRing } from '../../components/TimerRing'
import { ControlButtons } from '../../components/ControlButtons'
import { SessionDots } from '../../components/SessionDots'
import { useTimerState } from '../../hooks/useTimerState'

const isMac = navigator.platform.toLowerCase().includes('mac')

export function MainWindow() {
  const { snapshot, sendControl } = useTimerState()
  const { state, remaining, total, session, completedToday } = snapshot

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
      style={{
        background: isMac
          ? 'transparent'
          : 'linear-gradient(160deg, rgba(20,20,28,0.97) 0%, rgba(14,14,20,0.98) 100%)',
        borderRadius: isMac ? 12 : 0
      }}
    >
      {/* Drag region / title bar */}
      <div
        className="flex items-center justify-between px-4 pt-3 pb-1"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
          SuperPomodoro
        </span>
        <button
          style={{ WebkitAppRegion: 'no-drag', color: 'rgba(255,255,255,0.25)' } as React.CSSProperties}
          onClick={() => window.electronAPI?.openSettings()}
          className="cursor-default p-1 rounded-md hover:bg-white/10 transition-colors"
          title="Settings"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6 pb-6">
        <TimerRing
          remaining={remaining}
          total={total}
          state={state}
          size={196}
        />

        <SessionDots
          current={session}
          total={4}
          completed={completedToday}
        />

        <ControlButtons
          state={state}
          onStart={() => sendControl('start')}
          onPause={() => sendControl('pause')}
          onReset={() => sendControl('reset')}
          onSkip={() => sendControl('skip')}
        />
      </div>
    </motion.div>
  )
}
