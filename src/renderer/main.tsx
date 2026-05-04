import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { MainWindow } from './windows/MainWindow/MainWindow'
import { SettingsWindow } from './windows/SettingsWindow/SettingsWindow'
import { OverlayWindow } from './windows/OverlayWindow/OverlayWindow'

const params = new URLSearchParams(window.location.search)
const windowType = params.get('window') ?? 'main'

const WindowComponent =
  windowType === 'settings' ? SettingsWindow :
  windowType === 'overlay'  ? OverlayWindow :
  MainWindow

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WindowComponent />
  </React.StrictMode>
)
