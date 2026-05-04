const { Jimp } = require('jimp')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
fs.mkdirSync(path.join(root, 'assets/icons'), { recursive: true })

const TOMATO  = 0xFF4757FF
const BLUE    = 0x2D98DAFF
const GRAY    = 0x8E9BBFFF
const WHITE   = 0xFFFFFFFF
const BG_DARK = 0x1A1A2EFF

function setCircle(img, cx, cy, r, color) {
  const { width, height } = img.bitmap
  for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
    for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue
      const dx = x - cx, dy = y - cy
      if (dx*dx + dy*dy <= r*r) img.setPixelColor(color, x, y)
    }
  }
}

async function makeAppIcon(size) {
  const img = new Jimp({ width: size, height: size, color: 0x00000000 })
  const cx = size / 2, cy = size / 2

  // Dark circle background
  setCircle(img, cx, cy, size * 0.44, BG_DARK)

  // Tomato ring arc
  const r2 = size * 0.44 * 0.75, stroke = size * 0.075
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (Math.abs(dist - r2) <= stroke / 2) {
        const angle = Math.atan2(dy, dx)
        if (angle > -Math.PI * 0.85 && angle < Math.PI * 0.55)
          img.setPixelColor(TOMATO, x, y)
      }
    }
  }

  // White center dot
  setCircle(img, cx, cy, size * 0.055, WHITE)
  return img
}

async function makeTrayIcon(size, color) {
  const img = new Jimp({ width: size, height: size, color: 0x00000000 })
  setCircle(img, size/2, size/2, size * 0.4, color)
  return img
}

async function makeTrayTemplate(size) {
  const img = new Jimp({ width: size, height: size, color: 0x00000000 })
  setCircle(img, size/2, size/2, size * 0.4, 0x000000FF)
  return img
}

async function main() {
  console.log('Generating app icon (1024px)...')
  await (await makeAppIcon(1024)).write(path.join(root, 'assets/icons/icon.png'))
  await (await makeAppIcon(512)).write(path.join(root, 'assets/icons/icon@2x.png'))

  console.log('Generating tray icons...')
  const trayDefs = [
    ['tray-work', TOMATO],
    ['tray-break', BLUE],
    ['tray-idle', GRAY],
  ]
  for (const [name, color] of trayDefs) {
    await (await makeTrayIcon(16, color)).write(path.join(root, `assets/icons/${name}.png`))
    await (await makeTrayIcon(32, color)).write(path.join(root, `assets/icons/${name}@2x.png`))
    await (await makeTrayTemplate(16)).write(path.join(root, `assets/icons/${name}Template.png`))
    await (await makeTrayTemplate(32)).write(path.join(root, `assets/icons/${name}Template@2x.png`))
  }
  console.log('All icons generated in assets/icons/')
}

main().catch(e => { console.error(e); process.exit(1) })
