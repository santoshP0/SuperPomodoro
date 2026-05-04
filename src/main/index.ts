import { app, ipcMain } from 'electron'
import { timerEngine } from './timerEngine'
import { settingsStore } from './settingsStore'
import { createMainWindow, createSettingsWindow, broadcastTimerUpdate } from './windowManager'
import { createTray, updateTray, destroyTray } from './trayManager'
import { createOverlays, closeOverlays, broadcastCountdown, registerOverlayIPC, refreshOnDisplayChange } from './overlayManager'
import { notify } from './notificationManager'
import { IPC } from '../types/ipc'
import type { AppSettings, TimerControl } from '../types/ipc'

// Single-instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.on('second-instance', () => {
  createMainWindow()
})

// Quit prevention — app lives in tray
app.on('window-all-closed', (e: Event) => {
  e.preventDefault()
})

app.on('before-quit', () => {
  closeOverlays()
  destroyTray()
})

app.whenReady().then(() => {
  // Load persisted settings into the engine
  const settings = settingsStore.get()
  timerEngine.updateSettings(settings)

  // Apply startup setting
  app.setLoginItemSettings({ openAtLogin: settings.launchOnStartup })

  // macOS: hide from Dock — lives only in menu bar
  if (process.platform === 'darwin') {
    app.dock?.hide()
  }

  // Create tray
  createTray(
    () => createMainWindow(),
    () => createSettingsWindow()
  )

  // Wire timer events
  timerEngine.on('tick', (snapshot) => {
    broadcastTimerUpdate()
    const s = settingsStore.get()
    updateTray(snapshot, () => createMainWindow(), () => createSettingsWindow())
  })

  timerEngine.on('breakStart', (snapshot) => {
    const s = settingsStore.get()
    notify(snapshot, s.soundEnabled)
    createOverlays(snapshot)
  })

  timerEngine.on('breakEnd', (snapshot) => {
    closeOverlays()
    const s = settingsStore.get()
    notify(snapshot, s.soundEnabled)
  })

  timerEngine.on('overlayTick', (remaining: number) => {
    broadcastCountdown(remaining)
  })

  // IPC: timer controls
  ipcMain.on(IPC.TIMER_CONTROL, (_event, action: TimerControl) => {
    switch (action) {
      case 'start': timerEngine.start(); break
      case 'pause': timerEngine.pause(); break
      case 'reset': timerEngine.reset(); break
      case 'skip':  timerEngine.skip(); break
    }
  })

  // IPC: overlay skip
  ipcMain.on(IPC.OVERLAY_SKIP, () => {
    timerEngine.skip()
  })

  // IPC: settings
  ipcMain.handle(IPC.SETTINGS_GET, () => settingsStore.get())

  ipcMain.handle(IPC.SETTINGS_SAVE, (_event, newSettings: AppSettings) => {
    settingsStore.save(newSettings)
    timerEngine.updateSettings(newSettings)
    app.setLoginItemSettings({ openAtLogin: newSettings.launchOnStartup })
    return true
  })

  ipcMain.on(IPC.SETTINGS_OPEN, () => createSettingsWindow())

  // Overlay IPC (hover → mouse events toggle)
  registerOverlayIPC()

  // Display hot-plug
  refreshOnDisplayChange()
})
