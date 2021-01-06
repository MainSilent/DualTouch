const regedit = require('regedit')
const { ipcMain } = require('electron')
const jspack = require('jspack').jspack

function rot13(str) {
    var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
    var index = x => input.indexOf(x);
    var translate = x => index(x) > -1 ? output[index(x)] : x;
    return str.split('').map(translate).join('');
}

const regeditPath = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist"
const pathList = [
    `${regeditPath}\\{F4E57C4B-2036-45F0-A9AB-443BCFE33D9F}\\Count`,
    `${regeditPath}\\{CEBFF5CD-ACE2-4F4F-9178-9926F41749EA}\\Count`
]
const UserAssist = new Promise(resolve => {
    let final_data = []
    let final_count = 0
    pathList.forEach(path => {
        let count = 0
        regedit.list(path, (err, result) => {
            if (err) throw err
            const values = result[path].values
            const entries = Object.entries(values)
            for (let [file, data] of entries) {
                const Name = rot13(file)
                const Count = Number(jspack.Unpack('<I', data.value.slice(4, 8)))
                const FocusCount = Number(jspack.Unpack('<I', data.value.slice(8, 12)))
                const FocusTime = Number(jspack.Unpack('<I', data.value.slice(12, 16)))
                const App = {
                    name: Name,
                    count: Count,
                    focusCount: FocusCount,
                    focusTime: FocusTime
                }
                count++
                final_data.push(App)

                if (entries.length == count) {
                    ++final_count == 2 && resolve(final_data)
                }
            }
        })
    })
})
ipcMain.on('userAssist-init', event => {
    UserAssist.then(data => event.reply('userAssist-init-reply', data))
})