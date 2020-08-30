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
    //alwaysOnTop: true,
    fullscreen: true,
    //skipTaskbar: true,
    hasShadow: false,
    thickFrame: false,
    transparent: true,
    vibrancy: 'dark',
    // vbrancy make it slow!
    webPreferences: {
      nodeIntegration: true,
    } ,show:false
  })
  
  win.loadFile('public/index.html')

  // for zoom
  win.once("ready-to-show", () => {
    win.webContents.setZoomFactor(1.0); 
    win.show();
    win.webContents 
      .setVisualZoomLevelLimits(1, 5) 
      .then(console.log("Zoom Levels Have been Set between 100% and 500%")) 
      .catch((err) => console.log(err)); 
    win.webContents.on("zoom-changed", (event, zoomDirection) => { 
      var currentZoom = win.webContents.getZoomFactor(); 
      if (zoomDirection === "in") { 
          win.webContents.zoomFactor = currentZoom + 0.2; 
      } 
      if (zoomDirection === "out") {  
          win.webContents.zoomFactor = currentZoom - 0.2; 
      } 
    });
  });
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