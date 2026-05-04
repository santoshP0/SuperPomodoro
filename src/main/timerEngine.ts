import { EventEmitter } from 'events'
import type { TimerState, TimerSnapshot, AppSettings } from '../types/ipc'

const DEFAULT_SETTINGS: AppSettings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  sessionsBeforeLong: 4,
  autoStartBreak: true,
  autoStartWork: false,
  soundEnabled: true,
  launchOnStartup: false
}

class TimerEngine extends EventEmitter {
  private state: TimerState = 'IDLE'
  private remaining = 0
  private total = 0
  private session = 1
  private completedToday = 0
  private interval: ReturnType<typeof setInterval> | null = null
  private settings: AppSettings = { ...DEFAULT_SETTINGS }
  private stateBeforePause: TimerState = 'IDLE'

  updateSettings(s: AppSettings) {
    this.settings = s
    if (this.state === 'IDLE') {
      this.remaining = s.workDuration
      this.total = s.workDuration
    }
  }

  getSnapshot(): TimerSnapshot {
    return {
      state: this.state,
      remaining: this.remaining,
      total: this.total,
      session: this.session,
      completedToday: this.completedToday
    }
  }

  start() {
    if (this.state === 'IDLE') {
      this.state = 'WORK'
      this.remaining = this.settings.workDuration
      this.total = this.settings.workDuration
      this.startTicking()
    } else if (this.state === 'PAUSED') {
      this.state = this.stateBeforePause
      this.startTicking()
    }
    this.emit('tick', this.getSnapshot())
  }

  pause() {
    if (this.state === 'WORK' || this.state === 'SHORT_BREAK' || this.state === 'LONG_BREAK') {
      this.stateBeforePause = this.state
      this.state = 'PAUSED'
      this.stopTicking()
      this.emit('tick', this.getSnapshot())
    }
  }

  reset() {
    this.stopTicking()
    this.state = 'IDLE'
    this.remaining = this.settings.workDuration
    this.total = this.settings.workDuration
    this.session = 1
    this.emit('tick', this.getSnapshot())
  }

  skip() {
    if (this.state === 'SHORT_BREAK' || this.state === 'LONG_BREAK') {
      this.emit('breakEnd', this.getSnapshot())
      this.stopTicking()
      this.transitionToWork()
    } else if (this.state === 'WORK') {
      this.stopTicking()
      this.transitionToBreak()
    }
  }

  private startTicking() {
    this.stopTicking()
    this.interval = setInterval(() => this.tick(), 1000)
  }

  private stopTicking() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  private tick() {
    if (this.remaining > 0) {
      this.remaining--
      this.emit('tick', this.getSnapshot())
      if (this.state === 'SHORT_BREAK' || this.state === 'LONG_BREAK') {
        this.emit('overlayTick', this.remaining)
      }
    } else {
      this.stopTicking()
      this.onPhaseEnd()
    }
  }

  private onPhaseEnd() {
    const endedState = this.state
    this.emit('sessionEnd', { endedState, snapshot: this.getSnapshot() })

    if (endedState === 'WORK') {
      this.completedToday++
      this.transitionToBreak()
    } else {
      this.emit('breakEnd', this.getSnapshot())
      this.transitionToWork()
    }
  }

  private transitionToBreak() {
    const isLong =
      this.session >= this.settings.sessionsBeforeLong

    this.state = isLong ? 'LONG_BREAK' : 'SHORT_BREAK'
    this.remaining = isLong
      ? this.settings.longBreakDuration
      : this.settings.shortBreakDuration
    this.total = this.remaining

    this.emit('breakStart', this.getSnapshot())
    this.emit('tick', this.getSnapshot())

    if (this.settings.autoStartBreak) {
      this.startTicking()
    }
  }

  private transitionToWork() {
    if (this.session >= this.settings.sessionsBeforeLong) {
      this.session = 1
    } else {
      this.session++
    }
    this.state = 'WORK'
    this.remaining = this.settings.workDuration
    this.total = this.settings.workDuration

    this.emit('tick', this.getSnapshot())

    if (this.settings.autoStartWork) {
      this.startTicking()
    } else {
      this.state = 'IDLE'
      this.emit('tick', this.getSnapshot())
    }
  }
}

export const timerEngine = new TimerEngine()
