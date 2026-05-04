import type { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.superpomodoro.app',
  productName: 'SuperPomodoro',
  copyright: 'Copyright © 2026 SuperPomodoro',

  directories: {
    output: 'release',
    buildResources: 'resources'
  },

  files: [
    'out/main/**/*',
    'out/renderer/**/*',
    'out/preload/**/*',
    'package.json'
  ],

  extraResources: [
    { from: 'assets/sounds', to: 'sounds' },
    { from: 'assets/icons', to: 'icons' }
  ],

  asar: true,
  asarUnpack: ['**/*.mp3'],

  mac: {
    category: 'public.app-category.productivity',
    icon: 'assets/icons/icon.icns',
    target: [
      { target: 'dmg', arch: ['x64', 'arm64'] }
    ],
    hardenedRuntime: true,
    gatekeeperAssess: false,
    darkModeSupport: true
  },

  dmg: {
    title: 'SuperPomodoro',
    contents: [
      { x: 130, y: 220, type: 'file' },
      { x: 410, y: 220, type: 'link', path: '/Applications' }
    ],
    window: { width: 540, height: 380 }
  },

  win: {
    icon: 'assets/icons/icon.ico',
    target: [
      { target: 'nsis', arch: ['x64'] }
    ]
  },

  nsis: {
    oneClick: false,
    allowDirChange: true,
    perMachine: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'SuperPomodoro',
    runAfterFinish: true
  },

  publish: null
}

export default config
