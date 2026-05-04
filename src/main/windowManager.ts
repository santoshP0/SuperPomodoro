import { BrowserWindow, app, shell } from 'electron'
import { join } from 'path'
import { IPC } from '../types/ipc'
import { timerEngine } from './timerEngine'

let mainWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null

function getPreloadPath(): string {
  return app.isPackaged
    ? join(app.getAppPath(), 'out/preload/index.js')
    : join(__dirname, '../../out/preload/index.js')
}

function rendererUrl(query = ''): string {
  const base = app.isPackaged
    ? `file://${join(app.getAppPath(), 'out/renderer/index.html')}`
    : (process.env['ELECTRON_RENDERER_URL'] ?? 'http://localhost:5173/index.html')
  return query ? `${base}?${query}` : base
}

function applyNativeStyling(win: BrowserWindow) {
  if (process.platform === 'darwin') {
    win.setVibrancy('sidebar')
  } else if (process.platform === 'win32') {
    try { win.setBackgroundMaterial('mica') } catch { /* Win10 fallback */ }
  }
}

export function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
    mainWindow.focus()
    return
  }

  mainWindow = new BrowserWindow({
    width: 340,
    height: 420,
    minWidth: 300,
    minHeight: 380,
    frame: false,
    transparent: process.platform === 'darwin',
    backgroundColor: process.platform === 'win32' ? '#00000000' : undefined,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    resizable: false,
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  applyNativeStyling(mainWindow)
  mainWindow.loadURL(rendererUrl('window=main'))

  mainWindow.once('ready-to-show', () => mainWindow?.show())

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

export function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show()
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 520,
    frame: false,
    transparent: process.platform === 'darwin',
    backgroundColor: process.platform === 'win32' ? '#00000000' : undefined,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    resizable: false,
    show: false,
    parent: mainWindow ?? undefined,
    modal: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  applyNativeStyling(settingsWindow)
  settingsWindow.loadURL(rendererUrl('window=settings'))

  settingsWindow.once('ready-to-show', () => settingsWindow?.show())

  settingsWindow.on('close', (e) => {
    e.preventDefault()
    settingsWindow?.hide()
  })
}

export function broadcastTimerUpdate() {
  const snapshot = timerEngine.getSnapshot()
  BrowserWindow.getAllWindows().forEach((win) => {
    if (!win.isDestroyed() && win.webContents) {
      win.webContents.send(IPC.TIMER_UPDATE, snapshot)
    }
  })
}

export function getMainWindow() {
  return mainWindow
}
