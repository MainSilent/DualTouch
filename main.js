const { app, BrowserWindow, ipcMain, screen } = require('electron')
const programs = require('./modules/programs')
const storeApps = require('./modules/storeApps')
const regedit = require('regedit')
require('./modules/userAssist')
require('./modules/fileExplorer')
require('./modules/topbar')

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    fullscreen: true,
    skipTaskbar: true,
    hasShadow: false,
    thickFrame: false,
    backgroundColor: "#000",
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    //x: 3200,
    //y: 0
  })

  win.loadFile('public/index.html')
  //win.openDevTools()

  // for zoom
  win.once("ready-to-show", () => {
    win.webContents.setZoomFactor(1.0);
    //win.webContents.setZoomFactor(1.4);
    win.show();
    win.webContents
      .setVisualZoomLevelLimits(1, 5)
      .then()
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

app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())

//Init-Get Applications List, Icons
ipcMain.on('init', (event) => {
  Promise.all([programs.init, storeApps.init])
    .then((response) => {
      const result = { 'programs': response[0], 'storeApps': response[1] }
      event.reply('init-reply', result)
    })
})
// get window handle
ipcMain.on('window_handle', event => {
  event.reply('window_handle:reply', 
    win.getNativeWindowHandle().readInt32LE())
})

ipcMain.on('Restart', (event) => {
  app.relaunch()
  app.exit()
})
ipcMain.on('Close', (event) => app.exit())

// Init Regedit
regedit.createKey("HKCU\\Software\\DualTouch", err => err)

// handle errors
process.on('uncaughtException', err => {
  console.error(err);
});