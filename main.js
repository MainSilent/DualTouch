const fs = require('fs')
const path = require('path')
const { app, ipcMain } = require('electron')
const { BrowserWindow } = require('electron-acrylic-window')
const programs = require('./src/components/electron/programs')
const storeApps = require('./src/components/electron/storeApps')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    //fullscreen: true,
    //skipTaskbar: true,
    hasShadow: false,
    thickFrame: false,
    transparent: true,
    vibrancy: 'dark',
    webPreferences: {
      nodeIntegration: true,
    }
  })
  
  win.loadFile('public/index.html')
}

app.whenReady().then(createWindow)

//Init-Get Applications List, Icons
ipcMain.on('init', (event) => { 
  Promise.all([programs.init, storeApps.init])
    .then((response) => {
      const result = {'programs': response[0], 'storeApps': response[1]}
      event.reply('init-reply', result) 
    })
})
ipcMain.on('Restart', (event) => { 
  app.relaunch()
  app.exit()
})
ipcMain.on('Close', (event) => app.exit())