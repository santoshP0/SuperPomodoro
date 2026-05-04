import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../types/ipc'
import type { TimerSnapshot, AppSettings, TimerControl } from '../types/ipc'

contextBridge.exposeInMainWorld('electronAPI', {
  onTimerUpdate: (cb: (snapshot: TimerSnapshot) => void) => {
    ipcRenderer.on(IPC.TIMER_UPDATE, (_e, snapshot) => cb(snapshot))
    return () => ipcRenderer.removeAllListeners(IPC.TIMER_UPDATE)
  },
  onPlaySound: (cb: () => void) => {
    ipcRenderer.on(IPC.PLAY_SOUND, () => cb())
    return () => ipcRenderer.removeAllListeners(IPC.PLAY_SOUND)
  },
  sendControl: (action: TimerControl) => {
    ipcRenderer.send(IPC.TIMER_CONTROL, action)
  },
  getSettings: (): Promise<AppSettings> => {
    return ipcRenderer.invoke(IPC.SETTINGS_GET)
  },
  saveSettings: (settings: AppSettings): Promise<boolean> => {
    return ipcRenderer.invoke(IPC.SETTINGS_SAVE, settings)
  },
  openSettings: () => {
    ipcRenderer.send(IPC.SETTINGS_OPEN)
  }
})

// Overlay API — active only in overlay windows
contextBridge.exposeInMainWorld('overlayAPI', {
  onCountdownUpdate: (cb: (remaining: number) => void) => {
    ipcRenderer.on(IPC.OVERLAY_COUNTDOWN, (_e, remaining) => cb(remaining))
    return () => ipcRenderer.removeAllListeners(IPC.OVERLAY_COUNTDOWN)
  },
  onClose: (cb: () => void) => {
    ipcRenderer.once(IPC.OVERLAY_CLOSE, () => cb())
  },
  notifySkipHover: () => ipcRenderer.send(IPC.OVERLAY_SKIP_HOVER),
  notifySkipLeave: () => ipcRenderer.send(IPC.OVERLAY_SKIP_LEAVE),
  sendSkip: () => ipcRenderer.send(IPC.OVERLAY_SKIP)
})
