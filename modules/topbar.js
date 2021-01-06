const {
    ipcMain
} = require("electron")
const path = require('path')
const edge = require('electron-edge-js')

const dllPath = path.resolve(__dirname, "tools\\taskbar\\Taskbar.dll")
//const dllPath = "E:\\Projects\\Taskbar\\bin\\Debug\\Taskbar.dll"

// // all running windows
// const taskbar = edge.func({
//     assemblyFile: dllPath,
//     typeName: 'Taskbar.Main',
//     methodName: 'init'
// })
// ipcMain.on('taskbar', event => {
//     taskbar(programs => {
//         event.reply('taskbar-reply', programs)
//     }, (err, result) => result && console.log("taskbar: "+result))
// })

// toggle the window
const toggle = edge.func({
    assemblyFile: dllPath,
    typeName: 'Taskbar.Main',
    methodName: 'toggleWindow'
})
ipcMain.on('taskbar-toggle', (event, hWnd) => 
    toggle(hWnd)
)

// current focused window
const focus = edge.func({
    assemblyFile: dllPath,
    typeName: 'Taskbar.Main',
    methodName: 'focus'
})
ipcMain.on('taskbar-focus', event => {
    focus(hWnd => {
        event.reply('taskbar-focus:reply', hWnd)
    }, err => (err, result) => result && console.log("focus: "+result))
})

// // close the window
// const close = edge.func({
//     assemblyFile: dllPath,
//     typeName: 'Taskbar.Main',
//     methodName: 'close'
// })
// ipcMain.on('taskbar-close', (event, hWnd) => {
//     close(hWnd, (err, result) => {
//         err && console.log("close: "+err)
//         event.reply('taskbar-close:reply', result);
//     })
// })

// // kill the process
// const kill = edge.func({
//     assemblyFile: dllPath,
//     typeName: 'Taskbar.Main',
//     methodName: 'kill'
// })
// ipcMain.on('taskbar-kill', (event, hWnd) => {
//     kill(hWnd, (err, result) => result && console.log("kill: "+result))
// })