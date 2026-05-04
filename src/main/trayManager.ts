import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron'
import { join } from 'path'
import type { TimerSnapshot } from '../types/ipc'
import { timerEngine } from './timerEngine'

let tray: Tray | null = null

function getIconPath(state: TimerSnapshot['state']): string {
  const base = app.isPackaged
    ? join(process.resourcesPath, 'icons')
    : join(__dirname, '../../assets/icons')

  const name =
    state === 'WORK' ? 'tray-work' :
    state === 'SHORT_BREAK' || state === 'LONG_BREAK' ? 'tray-break' :
    'tray-idle'

  // macOS uses Template images for automatic dark/light mode
  const ext = process.platform === 'darwin' ? 'Template.png' : '.png'
  return join(base, `${name}${ext}`)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function buildMenu(snapshot: TimerSnapshot, openWindow: () => void, openSettings: () => void): Menu {
  const isPaused = snapshot.state === 'PAUSED'
  const isIdle = snapshot.state === 'IDLE'
  const isWorking = snapshot.state === 'WORK'
  const isBreak = snapshot.state === 'SHORT_BREAK' || snapshot.state === 'LONG_BREAK'

  const timeLabel = isIdle ? 'Not started' : formatTime(snapshot.remaining)
  const phaseLabel =
    snapshot.state === 'WORK' ? 'Focus' :
    snapshot.state === 'SHORT_BREAK' ? 'Short Break' :
    snapshot.state === 'LONG_BREAK' ? 'Long Break' :
    snapshot.state === 'PAUSED' ? 'Paused' : 'SuperPomodoro'

  return Menu.buildFromTemplate([
    { label: `${phaseLabel} — ${timeLabel}`, enabled: false },
    { type: 'separator' },
    {
      label: isPaused || isIdle ? 'Start' : 'Pause',
      accelerator: 'CmdOrCtrl+Space',
      click: () => isPaused || isIdle ? timerEngine.start() : timerEngine.pause()
    },
    {
      label: 'Skip',
      enabled: isWorking || isBreak,
      click: () => timerEngine.skip()
    },
    {
      label: 'Reset',
      click: () => timerEngine.reset()
    },
    { type: 'separator' },
    { label: 'Open Timer', click: openWindow },
    { label: 'Settings…', click: openSettings },
    { type: 'separator' },
    { label: 'Quit SuperPomodoro', role: 'quit' }
  ])
}

export function createTray(openWindow: () => void, openSettings: () => void) {
  const snapshot = timerEngine.getSnapshot()
  const iconPath = getIconPath(snapshot.state)

  let img: Electron.NativeImage
  try {
    img = nativeImage.createFromPath(iconPath)
  } catch {
    // Fallback to empty image during dev before assets exist
    img = nativeImage.createEmpty()
  }

  tray = new Tray(img)
  tray.setToolTip('SuperPomodoro')

  if (process.platform !== 'darwin') {
    tray.on('double-click', openWindow)
  }

  updateTray(snapshot, openWindow, openSettings)
}

export function updateTray(snapshot: TimerSnapshot, openWindow: () => void, openSettings: () => void) {
  if (!tray) return

  // Update icon
  const iconPath = getIconPath(snapshot.state)
  try {
    const img = nativeImage.createFromPath(iconPath)
    if (!img.isEmpty()) tray.setImage(img)
  } catch {
    // Icon file may not exist during early dev
  }

  // Update tooltip with live time
  const timeStr = snapshot.state !== 'IDLE' ? ` — ${formatTime(snapshot.remaining)}` : ''
  tray.setToolTip(`SuperPomodoro${timeStr}`)

  tray.setContextMenu(buildMenu(snapshot, openWindow, openSettings))
}

export function destroyTray() {
  tray?.destroy()
  tray = null
}

export function getTray() {
  return tray
}
