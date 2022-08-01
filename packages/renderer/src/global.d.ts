
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
      //v1 Functions
      findSongs: (arg0: string) => Promise<number>,
      indexSongs: () => void,
      updateIndex: (arg0: (arg0: any, arg1: number)=> void) => void,
      addTrack: (arg0: (arg0: any, arg1: [string, import('./types').Track])=> void) => void,
      coverArt: (arg0: any) => Promise<any>,
      savePlaylist: (arg0: string, arg1: string[]) => Promise<void>,
      loadPlaylist: (arg0: string) => Promise<Array<any>>,
      //v2 Functions
      maxSongs: (arg0: (arg0: any, arg1: number) => void) => void,
      getAlbums: () => Promise<any>,
      getCoverArt: (arg0: any) => Promise<any>,
      getTracksFromAlbum: (arg0: any) => Promise<Array<any>>,
    }
  }
}
