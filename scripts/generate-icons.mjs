import Jimp from 'jimp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

mkdirSync(join(root, 'assets/icons'), { recursive: true })

// Colors
const TOMATO   = 0xFF4757FF
const BLUE     = 0x2D98DAFF
const GRAY     = 0x8E9BBFFF
const WHITE    = 0xFFFFFFFF
const BG_DARK  = 0x1A1A2EFF

async function makeAppIcon(size) {
  const img = new Jimp({ width: size, height: size, color: 0x00000000 })
  const cx = size / 2, cy = size / 2, r = size * 0.44

  // Dark circle background
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const dx = x - cx, dy = y - cy
      if (dx*dx + dy*dy <= r*r) img.setPixelColor(BG_DARK, x, y)
    }
  }

  // Tomato-red ring arc (timer ring)
  const r2 = r * 0.75, strokeW = size * 0.08
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (Math.abs(dist - r2) <= strokeW / 2) {
        const angle = Math.atan2(dy, dx)
        if (angle > -Math.PI * 0.9 && angle < Math.PI * 0.6)
          img.setPixelColor(TOMATO, x, y)
      }
    }
  }

  // Center dot
  const dotR = size * 0.06
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const dx = x - cx, dy = y - cy
      if (dx*dx + dy*dy <= dotR*dotR) img.setPixelColor(WHITE, x, y)
    }
  }

  return img
}

// Draw a filled circle
function circle(img, cx, cy, r, color) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      if (x < 0 || y < 0 || x >= img.bitmap.width || y >= img.bitmap.height) continue
      const dx = x - cx, dy = y - cy
      if (dx*dx + dy*dy <= r*r) img.setPixelColor(color, x, y)
    }
  }
}

// Tray icon: small colored circle on transparent bg
async function makeTrayIcon(size, color, label) {
  const img = new Jimp({ width: size, height: size, color: 0x00000000 })
  circle(img, size/2, size/2, size * 0.38, color)
  return img
}

// macOS template icon: black circle (system colors the rest)
async function makeTrayTemplate(size) {
  const img = new Jimp({ width: size, height: size, color: 0x00000000 })
  circle(img, size/2, size/2, size * 0.38, 0x000000FF)
  return img
}

console.log('Generating app icon...')
const appIcon = await makeAppIcon(1024)
await appIcon.write(join(root, 'assets/icons/icon.png'))
await (await makeAppIcon(512)).write(join(root, 'assets/icons/icon@2x.png'))

console.log('Generating tray icons...')
// Windows tray icons (colored)
await (await makeTrayIcon(16, TOMATO, 'work')).write(join(root, 'assets/icons/tray-work.png'))
await (await makeTrayIcon(32, TOMATO, 'work')).write(join(root, 'assets/icons/tray-work@2x.png'))
await (await makeTrayIcon(16, BLUE, 'break')).write(join(root, 'assets/icons/tray-break.png'))
await (await makeTrayIcon(32, BLUE, 'break')).write(join(root, 'assets/icons/tray-break@2x.png'))
await (await makeTrayIcon(16, GRAY, 'idle')).write(join(root, 'assets/icons/tray-idle.png'))
await (await makeTrayIcon(32, GRAY, 'idle')).write(join(root, 'assets/icons/tray-idle@2x.png'))

// macOS Template images (black, system handles dark/light)
await (await makeTrayTemplate(16)).write(join(root, 'assets/icons/tray-workTemplate.png'))
await (await makeTrayTemplate(32)).write(join(root, 'assets/icons/tray-workTemplate@2x.png'))
await (await makeTrayTemplate(16)).write(join(root, 'assets/icons/tray-breakTemplate.png'))
await (await makeTrayTemplate(32)).write(join(root, 'assets/icons/tray-breakTemplate@2x.png'))
await (await makeTrayTemplate(16)).write(join(root, 'assets/icons/tray-idleTemplate.png'))
await (await makeTrayTemplate(32)).write(join(root, 'assets/icons/tray-idleTemplate@2x.png'))

console.log('Done! Icons written to assets/icons/')
