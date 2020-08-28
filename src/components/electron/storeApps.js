const fs = require('fs')
const { exec } = require("child_process")
const { ipcMain } = require('electron')

const init = new Promise((resolve) => {
    fs.access("data/store_apps.json", err => {
        if(err) {resolve({status: false, message: "StoreApps data not found", code: 200}); return}
        fs.readFile("data/store_apps.json", (err, data) => {
            exec(`src\\tools\\storeApps\\storeApps.exe /test`, (error, stdout, stderr) => {
                const test = Buffer.from(stdout)
                if (error) {resolve({status: false, message: "execute(error) storeApps faild", code: 201}); return}
                if (stderr) {resolve({status: false, message: "execute(stderr) storeApps faild", code: 202}); return}

                if(data.equals(test)) resolve({status: true, message: "StoreApps data is updated"})
                else {resolve({status: false, message: "StoreApps data needs update", code: 203}); return}
            })
        })
    })
})
// Event Listeners
ipcMain.on('storeApps-init', (event) => {
    event.reply('storeApps-init-reply', 
        {status: null, message: "Updating StoreApps data..."})
    exec(`src\\tools\\storeApps\\storeApps.exe "./data/store_apps.json"`, (error, stdout, stderr) => {
        if (error) {
            event.reply('storeApps-init-reply', 
            {status: false, message: 'storeApps error ' + error.message, code: 204})
            return;
        }
        if (stderr) {
            event.reply('storeApps-init-reply', 
            {status: false, message: 'storeApps stderr ' + stderr, code: 205})
            return;
        }
        event.reply('storeApps-init-reply', 
            {status: true, message: "StoreApps data have been updated"})
    })
})
ipcMain.on('run-app', (event, PFN, appId) => {
    exec(`start shell:AppsFolder\\${PFN}!${appId}`, (error, stdout, stderr) => {
        if (error) {
            console.log('\x1b[31m', `extractFileIcon-error: ${error.message}`, '\x1b[0m')
            return;
        }
        if (stderr) {
            console.log('\x1b[31m', `extractFileIcon-stderr: ${stderr}`, '\x1b[0m')
            return;
        }
    })
})

exports.init = init