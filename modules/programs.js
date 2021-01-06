/*
  Problem: openExternal doesn't add value to userAssist
*/

const fs = require('fs')
const os = require ('os')
const path = require('path')
const { shell } = require('electron')
const { ipcMain } = require('electron')
const edge = require('electron-edge-js')
const recursive = require("recursive-readdir")
const diff = require("diff-arrays-of-objects")

const dataPath = path.resolve(__dirname, "../data/programs.json")
const username = os.userInfo().username
const Dirs = [
  `C:\\Users\\${username}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
  `C:\\ProgramData\\Microsoft\\Windows\\Start Menu`
]
const getIcon = edge.func({
  assemblyFile: path.resolve(__dirname, "tools\\extractFileIcon.dll"),
  typeName: 'extractFileIcon.Main',
  methodName: 'getIcon'
})

const programsList = new Promise(resolve => {
  let done = 0
  let Apps_List = []
  Dirs.forEach(dirPath => {
    recursive(dirPath, (err, files) => {
      if (err) throw err
      files.forEach((file) => {
        if(path.extname(file) == '.lnk') {
          const shortCutName = path.basename(file).split('.').slice(0, -1).join('.')
          try{var realPath = shell.readShortcutLink(file).target}catch(e){e}
          if(realPath) {
            const fileExt = realPath.split('.').pop()
            if(fileExt == 'exe' && path.basename(file).search(/Uninstall/i) == -1 && realPath.split('\\')[1].search(/windows/i) ==  -1) {
              const appDetail = {
                name: shortCutName,
                path: file
              }
              Apps_List.push(appDetail)
              setTimeout(() => {
                if(Apps_List.length == ++done) resolve(Apps_List)
              }, 0);
            }
          }        
        }
      })            
    })              
  })
})
const init = new Promise(resolve => {
  fs.access(dataPath, err => {
    if(err) {resolve({status: false, message: "Application data not found", code: 100}); return}
    fs.readFile(dataPath, (err, data) => {
      if(err) {resolve({status: false, message: "Application data can't be read", code: 101}); return}
      programsList.then(programs => {
        try{ var jsonData = JSON.parse(data.toString()) }
          catch(e){ resolve({status: false, message: "Application data can't be parse", code: 102}) }
        if(diff(jsonData, programs, 'path').added.length || diff(jsonData, programs, 'path').removed.length)
        {
          resolve({status: false, message: "Application data need to be update", code: 103})
        }
        else 
        {
          resolve({status: true, message: "Application data have been updated!"})
        }
      })
    })
  })
})

ipcMain.on('Programs-init', event => {
  event.reply('Programs-init-reply', "Updating Application data...", 0)
  let key = 1
  let done = 0
  let Apps_List = []
  Dirs.forEach(dirPath => {
    recursive(dirPath, (err, files) => {
      if(err) {event.reply('Programs-init-reply', false, {message:"Can't read start menu directories", code:100}); return}
      files.forEach((file) => {
        if(path.extname(file) == '.lnk') {
          const shortCutName = path.basename(file).split('.').slice(0, -1).join('.')
          try{var realPath = shell.readShortcutLink(file).target}catch(e){e}
          if(realPath) {
            const fileExt = realPath.split('.').pop()
            if(fileExt == 'exe' && path.basename(file).search(/Uninstall/i) == -1 && realPath.split('\\')[1].search(/windows/i) ==  -1) {
              getIcon(file, (err, iconPath) => {
                if (err) throw err
                fs.stat(file, (err, fileStats) => {
                  if(err == null) {
                    const appDetail = {
                      id: key,
                      name: shortCutName,
                      path: file,
                      realPath: realPath,
                      DateCreated: parseInt(`${fileStats.birthtimeMs}`.substr(0, 10)),
                      icon: iconPath
                    }
                    key++
                    Apps_List.push(appDetail)
                    setTimeout(() => { 
                      done++
                      event.reply('Programs-init-reply',
                        "Updating Application data...",
                        Math.round((100 * done) / Apps_List.length)
                      )
                      if(Apps_List.length == done) {
                        fs.writeFile(dataPath, JSON.stringify(Apps_List), err => {
                          if(err) {event.reply('Programs-init-reply', false, {message:"Can't save application data", code:101}); return}
                        })
                        event.reply('Programs-init-reply', "Updating Application data completed!", 101)
                      }
                    }, 0);
                  }
                })
              })
            }
          }        
        }
      })            
    })              
  })
})
ipcMain.on('run-program', (event, path) => {
  shell.openExternal(`${path}`)
    .catch(e => console.log(e))
})

exports.init = init