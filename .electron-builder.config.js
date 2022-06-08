/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "YourAppID",
  productName: "SpeedyPlaylistCreator",
  copyright: "Copyright © 2022 Payman Ahmadpour",
  asar: true,
  directories: {
    output: "release/${version}",
    buildResources: "build",
  },
  files: ["dist"],
  win: {
    target: [
      {
        target: "portable",
        arch: ["x64"],
      },
    ],
    artifactName: "${productName}-${version}-Setup.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    artifactName: "${productName}-${version}-Installer.${ext}",
  },
  linux: {
    target: ["AppImage"],
    artifactName: "${productName}-${version}-Installer.${ext}",
    synopsis: "Easy to use playlist creator.",
    description: "Playlist creator that can help you create playlist for your local files! Supports mp3, flac, wav, m3u and m3u8",
    category: "Audio"
  },
}
