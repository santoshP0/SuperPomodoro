import Store from 'electron-store'
import type { AppSettings } from '../types/ipc'

const defaults: AppSettings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  sessionsBeforeLong: 4,
  autoStartBreak: true,
  autoStartWork: false,
  soundEnabled: true,
  launchOnStartup: false
}

const store = new Store<AppSettings>({
  defaults,
  name: 'settings'
})

export const settingsStore = {
  get(): AppSettings {
    return {
      workDuration: store.get('workDuration'),
      shortBreakDuration: store.get('shortBreakDuration'),
      longBreakDuration: store.get('longBreakDuration'),
      sessionsBeforeLong: store.get('sessionsBeforeLong'),
      autoStartBreak: store.get('autoStartBreak'),
      autoStartWork: store.get('autoStartWork'),
      soundEnabled: store.get('soundEnabled'),
      launchOnStartup: store.get('launchOnStartup')
    }
  },
  save(s: AppSettings) {
    store.set(s)
  }
}
