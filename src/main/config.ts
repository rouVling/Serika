
import { app, shell, BrowserWindow, ipcMain, screen, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { config } from 'dotenv'

let cfgWindow: BrowserWindow | null = null

export function createConfigWindow(): void {

  if (cfgWindow) {
    cfgWindow.show()
    return
  }

  const configWindow = new BrowserWindow({
    width: 905,
    height: 680,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // TODO: 为了方便开发，暂时关闭了 webSecurity，后续需要根据实际情况开启
      webSecurity: false,
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  configWindow.on('closed', () => {
    cfgWindow = null
  })

  cfgWindow = configWindow

  configWindow.on('ready-to-show', () => {
    configWindow.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    configWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + "/config.html")
  } else {
    configWindow.loadFile(join(__dirname, '../renderer/config.html'))
  }

  ipcMain.on("sendModelValue", (event, value) => {
    if (cfgWindow) {
      cfgWindow.webContents.send("modelValueReceived", value)
    }
  })
}