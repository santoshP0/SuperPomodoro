import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { AppSettings } from '../../types/ipc'

const isMac = navigator.platform.toLowerCase().includes('mac')

const DEFAULT: AppSettings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  sessionsBeforeLong: 4,
  autoStartBreak: true,
  autoStartWork: false,
  soundEnabled: true,
  launchOnStartup: false
}

function toMin(s: number) { return Math.round(s / 60) }
function toSec(m: number) { return m * 60 }

export function SettingsWindow() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.electronAPI?.getSettings().then(setSettings)
  }, [])

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  const handleSave = async () => {
    await window.electronAPI?.saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const labelCls = 'text-xs font-medium tracking-wide uppercase mb-1.5'
  const inputCls = 'w-full px-3 py-2 rounded-lg text-sm outline-none text-white bg-white/10 border border-white/10 focus:border-white/30 transition-colors'
  const rowCls = 'flex items-center justify-between py-2.5'
  const toggleCls = (on: boolean) =>
    `relative w-11 h-6 rounded-full transition-colors cursor-default ${on ? 'bg-red-500' : 'bg-white/15'}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
      style={{
        background: isMac
          ? 'transparent'
          : 'linear-gradient(160deg, rgba(20,20,28,0.97) 0%, rgba(14,14,20,0.98) 100%)'
      }}
    >
      {/* Title bar */}
      <div
        className="px-5 pt-4 pb-2 flex items-center"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Settings
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-5">
        {/* Durations */}
        <section>
          <p className={labelCls} style={{ color: 'rgba(255,255,255,0.4)' }}>Durations (minutes)</p>
          <div className="grid grid-cols-3 gap-3">
            {([
              ['Focus', 'workDuration'],
              ['Short Break', 'shortBreakDuration'],
              ['Long Break', 'longBreakDuration']
            ] as [string, keyof AppSettings][]).map(([label, key]) => (
              <div key={key}>
                <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                <input
                  type="number"
                  min={1}
                  max={120}
                  className={inputCls}
                  value={toMin(settings[key] as number)}
                  onChange={(e) => update(key, toSec(parseInt(e.target.value) || 1))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sessions before long break */}
        <section>
          <p className={labelCls} style={{ color: 'rgba(255,255,255,0.4)' }}>Sessions before long break</p>
          <input
            type="number"
            min={1}
            max={10}
            className={`${inputCls} w-24`}
            value={settings.sessionsBeforeLong}
            onChange={(e) => update('sessionsBeforeLong', parseInt(e.target.value) || 4)}
          />
        </section>

        {/* Toggles */}
        <section className="space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px' }}>
          {([
            ['Auto-start break', 'autoStartBreak'],
            ['Auto-start next focus session', 'autoStartWork'],
            ['Sound alerts', 'soundEnabled'],
            ['Launch at login', 'launchOnStartup']
          ] as [string, keyof AppSettings][]).map(([label, key]) => (
            <div key={key} className={rowCls}>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              <button
                className={toggleCls(settings[key] as boolean)}
                onClick={() => update(key, !settings[key] as AppSettings[typeof key])}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                  animate={{ x: settings[key] ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </section>
      </div>

      {/* Save button */}
      <div className="px-5 pb-5 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: saved ? 'rgba(32,191,107,0.85)' : 'rgba(255,71,87,0.85)',
            color: 'white',
            boxShadow: saved ? '0 2px 16px rgba(32,191,107,0.3)' : '0 2px 16px rgba(255,71,87,0.3)'
          }}
          animate={{ background: saved ? 'rgba(32,191,107,0.85)' : 'rgba(255,71,87,0.85)' }}
          transition={{ duration: 0.2 }}
        >
          {saved ? 'Saved ✓' : 'Save Settings'}
        </motion.button>
      </div>
    </motion.div>
  )
}
