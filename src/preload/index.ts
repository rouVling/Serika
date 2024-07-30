import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { get } from 'http'

// Custom APIs for renderer
const api = {
  getScreenShot: () => ipcRenderer.invoke('get-screen-shot'),
  ping: () => ipcRenderer.send('ping'),
  openConfigWindow: () => ipcRenderer.send('open-config-window'),
  getStore: (key: string) => ipcRenderer.invoke('getStore', key),
  setStore: (key: string, value: any) => ipcRenderer.send('setStore', key, value),
  setIgnoreMouseEvent: (ignore: boolean) => ipcRenderer.send('setIgnoreMouseEvent', ignore),
  setEnableClickThrough: (enable: boolean) => ipcRenderer.send('setEnableClickThrough', enable),
  openFile: () => ipcRenderer.invoke('open-file'),
  openFolder: () => ipcRenderer.invoke('open-folder'),
  setChara: (folder, chara) => ipcRenderer.send('setChara', folder, chara),
  // getScreenShotResult: () => ipcRenderer.invoke('get-screen-shot-result'),

  onUpdateScreenShotResult: (callback: (value: string) => void) => ipcRenderer.on('update-screen-shot-result', (_, value) => callback(value)),
  onUpdateApikey: (callback: (value: string) => void) => ipcRenderer.on('update-apikey', (_, value) => callback(value)),
  onUpdateTokenSaveMode: (callback: (value: string) => void) => ipcRenderer.on('update-tokenSaveMode', (_, value) => callback(value)),
  onUpdatePrompt: (callback: (value: string) => void) => ipcRenderer.on('update-prompt', (_, value) => callback(value)),
  onUpdateChara: (callback: (folder: string, chara: string) => void) => ipcRenderer.on('update-chara', (_, folder, chara) => callback(folder, chara)),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
