import { Notification, BrowserWindow, app } from 'electron'
import { join } from 'path'
import type { TimerSnapshot } from '../types/ipc'

let soundWindow: BrowserWindow | null = null

function getSoundPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'sounds/bell.mp3')
    : join(__dirname, '../../assets/sounds/bell.mp3')
}

function ensureSoundWindow() {
  if (soundWindow && !soundWindow.isDestroyed()) return

  soundWindow = new BrowserWindow({
    show: false,
    skipTaskbar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  })
}

export function playSound() {
  ensureSoundWindow()
  const path = getSoundPath()
  soundWindow!.webContents.executeJavaScript(`
    (function() {
      const a = new Audio(${JSON.stringify('file://' + path)});
      a.volume = 0.8;
      a.play().catch(() => {});
    })()
  `)
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
