const { join } = require('path')
const regedit = require('regedit')
const { readdir, lstat } = require('fs')
const { ipcMain, shell } = require('electron')

ipcMain.on('fileExplorer-init', (event, path) => {
    let done = 0
    let filesData = []
    readdir(path, (err, files) => {
        if (err) throw err

        if (!files.length) event.reply("fileExplorer-init-reply", [])
        else
            files.forEach(file => {
                const newPath = join(path, file)
                lstat(newPath, (err, stat) => {
                    const name = newPath.split("\\").pop()
                    const data = {
                        id: ++done,
                        name: name,
                        path: newPath
                    }
                    if (err) {
                        data.type = "Access Denied"
                        filesData.push(data)
                    }
                    else {
                        isDir = stat.isDirectory()
                        data.size = !isDir && stat.size
                        data.type = isDir ? "dir" : "file"
                        filesData.push(data)
                    }

                    if (done == files.length)
                        event.reply("fileExplorer-init-reply", filesData)
                })
            })
    })
})
ipcMain.on('file:open', (event, path) => {
    shell.openExternal(path)
        .catch(e => console.log(e))
})
ipcMain.on('file:bookmarks', event => {
    regedit.list('HKCU\\Software\\DualTouch', (err, data) => {
        if (err) console.log(err)
        event.reply("file:bookmarks:reply", data["HKCU\\Software\\DualTouch"])
    })
})