import { BrowserWindow, screen, ipcMain, app } from 'electron'
import { join } from 'path'
import { IPC } from '../types/ipc'
import type { TimerSnapshot } from '../types/ipc'

const overlayWindows: BrowserWindow[] = []

function getPreloadPath(): string {
  return app.isPackaged
    ? join(app.getAppPath(), 'out/preload/index.js')
    : join(__dirname, '../../out/preload/index.js')
}

function overlayUrl(displayIndex: number, breakType: string): string {
  const base = app.isPackaged
    ? `file://${join(app.getAppPath(), 'out/renderer/index.html')}`
    : (process.env['ELECTRON_RENDERER_URL'] ?? 'http://localhost:5173/index.html')
  return `${base}?window=overlay&display=${displayIndex}&breakType=${breakType}`
}

export function createOverlays(snapshot: TimerSnapshot) {
  destroyOverlays()

  const displays = screen.getAllDisplays()

  for (let i = 0; i < displays.length; i++) {
    const { bounds } = displays[i]

    const win = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      fullscreen: true,
      alwaysOnTop: true,
      focusable: false,
      frame: false,
      transparent: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      hasShadow: false,
      webPreferences: {
        preload: getPreloadPath(),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false
      }
    })

    win.setAlwaysOnTop(true, 'screen-saver')
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    win.setIgnoreMouseEvents(true, { forward: true })
    win.setContentProtection(false)
    win.loadURL(overlayUrl(i, snapshot.state))

    overlayWindows.push(win)
  }
}

export function destroyOverlays() {
  for (const win of overlayWindows) {
    if (!win.isDestroyed()) win.destroy()
  }
  overlayWindows.length = 0
}

export function broadcastCountdown(remaining: number) {
  for (const win of overlayWindows) {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC.OVERLAY_COUNTDOWN, remaining)
    }
  }
}

export function closeOverlays() {
  for (const win of overlayWindows) {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC.OVERLAY_CLOSE)
    }
  }
  setTimeout(() => destroyOverlays(), 400)
}

export function registerOverlayIPC() {
  ipcMain.on(IPC.OVERLAY_SKIP_HOVER, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.setIgnoreMouseEvents(false)
  })

  ipcMain.on(IPC.OVERLAY_SKIP_LEAVE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.setIgnoreMouseEvents(true, { forward: true })
  })
}

export function refreshOnDisplayChange() {
  screen.on('display-added', () => {
    if (overlayWindows.length > 0) {
      const snapshot = { state: 'SHORT_BREAK' } as TimerSnapshot
      createOverlays(snapshot)
    }
  })
  screen.on('display-removed', () => {
    if (overlayWindows.length > 0) destroyOverlays()
  })
}
