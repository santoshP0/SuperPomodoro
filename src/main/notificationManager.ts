import { Notification, BrowserWindow } from 'electron'
import { IPC } from '../types/ipc'
import type { TimerSnapshot } from '../types/ipc'

/**
 * Ask the main renderer window to synthesize a bell tone via Web Audio API.
 * This avoids the fragile hidden-BrowserWindow + executeJavaScript approach
 * and removes the dependency on a bundled .mp3 asset.
 */
export function playSound() {
  const windows = BrowserWindow.getAllWindows()
  for (const win of windows) {
    if (!win.isDestroyed() && win.webContents) {
      win.webContents.send(IPC.PLAY_SOUND)
      break
    }
  }
}

export function notify(snapshot: TimerSnapshot, soundEnabled: boolean) {
  const title = 'SuperPomodoro'
  let body: string

  if (snapshot.state === 'SHORT_BREAK' || snapshot.state === 'LONG_BREAK') {
    const minutes = Math.round(snapshot.total / 60)
    body = snapshot.state === 'LONG_BREAK'
      ? `Long break — ${minutes} minutes. You earned it!`
      : `Short break — ${minutes} minutes. Step away!`
  } else if (snapshot.state === 'WORK') {
    body = `Break over. Time to focus! Session ${snapshot.session}`
  } else {
    return
  }

  if (Notification.isSupported()) {
    new Notification({ title, body, silent: true }).show()
  }

  if (soundEnabled) playSound()
}
