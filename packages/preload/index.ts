import fs from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

const { appendLoading, removeLoading } = useLoading()

;(async () => {
  await domReady()

  appendLoading()
})()

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs)
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld('electron', {
  openFolder : () => ipcRenderer.invoke("dialog:openFolder"),
  openFile : () => ipcRenderer.invoke("dialog:openFile"),
  saveFile : () => ipcRenderer.invoke("dialog:saveFile")
})
contextBridge.exposeInMainWorld('manager', {
  findSongs : (arg: string) => ipcRenderer.invoke("manager:findSongs", arg),
  indexSongs : () => ipcRenderer.send('manager:indexSongs'),
  updateIndex : (callback: any) => ipcRenderer.on('manager:updateIndex', callback),
  addTrack : (callback: any) => ipcRenderer.on('manager:addTrack', callback),
  coverArt : (track: any) => ipcRenderer.invoke('manager:coverArt', track),
  savePlaylist : (playlistPath: string, songPaths: string[]) => ipcRenderer.invoke('manager:savePlaylist', playlistPath, songPaths),
  loadPlaylist : (playlistPath: string) => ipcRenderer.invoke('manager:loadPlaylist', playlistPath)
})

// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}