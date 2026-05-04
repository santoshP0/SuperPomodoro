import { useEffect, useState } from 'react'
import type { TimerSnapshot } from '../../types/ipc'

const DEFAULT_SNAPSHOT: TimerSnapshot = {
  state: 'IDLE',
  remaining: 1500,
  total: 1500,
  session: 1,
  completedToday: 0
}

declare global {
  interface Window {
    electronAPI: {
      onTimerUpdate: (cb: (s: TimerSnapshot) => void) => () => void
      onPlaySound: (cb: () => void) => () => void
      sendControl: (action: 'start' | 'pause' | 'reset' | 'skip') => void
      getSettings: () => Promise<import('../../types/ipc').AppSettings>
      saveSettings: (s: import('../../types/ipc').AppSettings) => Promise<boolean>
      openSettings: () => void
    }
    overlayAPI: {
      onCountdownUpdate: (cb: (remaining: number) => void) => () => void
      onClose: (cb: () => void) => void
      notifySkipHover: () => void
      notifySkipLeave: () => void
      sendSkip: () => void
    }
  }
}

export function useTimerState() {
  const [snapshot, setSnapshot] = useState<TimerSnapshot>(DEFAULT_SNAPSHOT)

  useEffect(() => {
    if (!window.electronAPI) return
    const cleanup = window.electronAPI.onTimerUpdate(setSnapshot)
    return cleanup
  }, [])

  const sendControl = (action: 'start' | 'pause' | 'reset' | 'skip') => {
    window.electronAPI?.sendControl(action)
  }

  return { snapshot, sendControl }
}
