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
  asarUnpack: ['**/*.wav'],

  mac: {
    category: 'public.app-category.productivity',
    // electron-builder auto-generates .icns from icon.png if .icns not present
    icon: 'assets/icons/icon.png',
    target: [
      { target: 'dmg', arch: ['x64', 'arm64'] }
    ],
    hardenedRuntime: true,
    gatekeeperAssess: false,
    darkModeSupport: true,
    entitlements: 'resources/entitlements.mac.plist',
    entitlementsInherit: 'resources/entitlements.mac.plist'
  },

  dmg: {
    title: 'SuperPomodoro',
    icon: 'assets/icons/icon.png',
    contents: [
      { x: 130, y: 220, type: 'file' },
      { x: 410, y: 220, type: 'link', path: '/Applications' }
    ],
    window: { width: 540, height: 380 }
  },

  win: {
    // electron-builder auto-generates .ico from icon.png if .ico not present
    icon: 'assets/icons/icon.png',
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
    runAfterFinish: true,
    installerIcon: 'assets/icons/icon.png',
    uninstallerIcon: 'assets/icons/icon.png'
  },

  publish: null
}

export default config
