import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TimerRing } from '../../components/TimerRing'
import { ControlButtons } from '../../components/ControlButtons'
import { SessionDots } from '../../components/SessionDots'
import { useTimerState } from '../../hooks/useTimerState'

const isMac = navigator.platform.toLowerCase().includes('mac')

function playBellTone() {
  try {
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Two quick sine tones at 880 Hz — a soft bell
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.value = 880

      const start = now + i * 0.22
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.5, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)

      osc.start(start)
      osc.stop(start + 0.5)
    }

    // Close the context after both tones finish
    setTimeout(() => ctx.close(), 1200)
  } catch {
    // Web Audio not available — silently ignore
  }
}

export function MainWindow() {
  const { snapshot, sendControl } = useTimerState()

  useEffect(() => {
    if (!window.electronAPI?.onPlaySound) return
    const cleanup = window.electronAPI.onPlaySound(playBellTone)
    return cleanup
  }, [])
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
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
