export type TimerState = 'IDLE' | 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK' | 'PAUSED'

export type TimerControl = 'start' | 'pause' | 'reset' | 'skip'

export interface TimerSnapshot {
  state: TimerState
  remaining: number
  total: number
  session: number
  completedToday: number
}

export interface AppSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLong: number
  autoStartBreak: boolean
  autoStartWork: boolean
  soundEnabled: boolean
  launchOnStartup: boolean
}

export const IPC = {
  TIMER_UPDATE: 'timer:update',
  BREAK_START: 'break:start',
  BREAK_END: 'break:end',
  TIMER_CONTROL: 'timer:control',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SAVE: 'settings:save',
  SETTINGS_OPEN: 'settings:open',
  OVERLAY_CLOSE: 'overlay:close',
  OVERLAY_SKIP_HOVER: 'overlay:skip-hover',
  OVERLAY_SKIP_LEAVE: 'overlay:skip-leave',
  OVERLAY_SKIP: 'overlay:skip',
  OVERLAY_COUNTDOWN: 'overlay:countdown',
  PLAY_SOUND: 'sound:play'
} as const
