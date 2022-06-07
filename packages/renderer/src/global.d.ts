
export { }

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import('fs')
    ipcRenderer: import('electron').IpcRenderer
    removeLoading: () => void
    electron: {
      openFolder: () => Promise<string>,
      openFile: () => Promise<string>,
      saveFile: () => Promise<string>
    }
    manager: {
      findSongs: (arg0: string) => Promise<number>,
      indexSongs: () => void,
      updateIndex: (arg0: (arg0: any, arg1: number)=> void) => void,
      addTrack: (arg0: (arg0: any, arg1: [string, import('./types').Track])=> void) => void,
      coverArt: (arg0: any) => Promise<any>,
      savePlaylist: (arg0: string, arg1: string[]) => Promise<void>,
      loadPlaylist: (arg0: string) => Promise<string[]>
    }
  }
}
