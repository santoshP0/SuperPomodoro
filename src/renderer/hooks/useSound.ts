import { useEffect } from 'react'

function playBellTone() {
  try {
    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.5, ctx.currentTime)
    master.connect(ctx.destination)

    // Three harmonic partials for a bell-like tone
    const freqs = [880, 1760, 2640]
    const gains = [0.5, 0.3, 0.2]

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(gains[i], ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4)

      osc.connect(gain)
      gain.connect(master)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 1.4)
    })

    setTimeout(() => ctx.close(), 1600)
  } catch {
    // AudioContext may be blocked; silently skip
  }
}

export function useSound() {
  useEffect(() => {
    if (!window.electronAPI?.onPlaySound) return
    const cleanup = window.electronAPI.onPlaySound(playBellTone)
    return cleanup
  }, [])
}
