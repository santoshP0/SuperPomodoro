# SuperPomodoro

A native Pomodoro timer for Mac and Windows with a full-screen break enforcement overlay.

<!-- Screenshots -->
<!-- Add screenshots here -->

---

## Features

- **Focus timer** — 25 min work sessions, short and long breaks
- **Full-screen break overlay** — covers all your monitors when a break starts. You can't click through it. Forces you to actually step away
- **Soft lock** — a Skip button appears after 5 seconds if you really need out
- **Lives in the menu bar / system tray** — no window cluttering your desktop. Mac menu bar, Windows tray
- **Native feel** — vibrancy on Mac, Mica on Windows 11, smooth spring animations throughout
- **Customizable** — change all durations, auto-start options, sound toggle, launch at login
- **Multi-monitor** — break overlay covers every connected display simultaneously

---

## Install

### Mac
1. Download `SuperPomodoro-1.0.0.dmg`
2. Open the DMG → drag **SuperPomodoro** to **Applications**
3. First launch: right-click the app → **Open** → click **Open** (one-time unsigned warning)
4. App appears in your menu bar (top-right). No Dock icon by design

### Windows
1. Download `SuperPomodoro Setup 1.0.0.exe`
2. Run the installer
3. If SmartScreen appears: click **More info** → **Run anyway** (one-time)
4. App appears in your system tray (bottom-right)

---

## How it works

| Phase | Default duration |
|---|---|
| Focus session | 25 minutes |
| Short break | 5 minutes |
| Long break | 15 minutes (after every 4 sessions) |

When a break starts, a full-screen dark overlay fades in over everything — all your monitors. A countdown timer shows how long is left. After 5 seconds a **Skip Break** button appears if you need it.

Click the tray/menu bar icon at any time to start, pause, skip, or open settings.

---

## Build from source

**Requirements:** Node.js 18+, npm

```bash
# Clone and install
git clone https://github.com/santoshp0/superpomodoro.git
cd superpomodoro
npm install

# Dev mode
npm run dev

# Build installers
npm run build:mac    # macOS — must run on a Mac
npm run build:win    # Windows — must run on Windows (or CI)
npm run build:all    # Both platforms
```

Installers are output to the `release/` folder.

### Code signing (optional)

Without signing the app works fine — users see a one-time security prompt on first launch.

To sign for a cleaner install experience:

**Mac** — requires Apple Developer Program ($99/year):
```bash
CSC_LINK=/path/to/cert.p12 CSC_KEY_PASSWORD=yourpassword npm run build:mac
```

**Windows** — requires a code signing certificate ($200-400/year):
```bash
WIN_CSC_LINK=/path/to/cert.p12 WIN_CSC_KEY_PASSWORD=yourpassword npm run build:win
```

---

## Tech stack

- [Electron](https://www.electronjs.org/) — desktop shell
- [React](https://react.dev/) + TypeScript — UI
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [electron-vite](https://electron-vite.org/) — build tooling
- [electron-builder](https://www.electron.build/) — packaging and installers
- [electron-store](https://github.com/sindresorhus/electron-store) — settings persistence

---

## License

MIT
