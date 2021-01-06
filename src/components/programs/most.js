import React from 'react';
const { ipcRenderer } = window.require("electron");

class Latest extends React.Component {
    constructor() {
        super()
        this.state = {
            apps: [],
            userData: []
        }
        this.Most = this.Most.bind(this)
    }
    Most() {
        return (
            this.state.apps.slice(0, 20).map(app =>
                Object.keys(app)[3] == "PFN" ?
                    <div className="program-c" key={"program-" + app.id} onClick={() => ipcRenderer.send('run-app', app.PFN, app.AppId)}>
                        <img src={app.unplatedIcon ?? app.Icon} className="icon" />
                        <p className="name">{app.Name}</p>
                    </div>
                    :
                    <div className="program-c" key={"storeApp-" + app.id} onClick={() => ipcRenderer.send('run-program', app.path)}>
                        <img src={"data:image/png;base64, " + app.icon} className="icon" />
                        <p className="name">{app.name}</p>
                    </div>
            )
        )
    }
    componentDidMount() {
        Array.prototype.sortBy = function (p) {
            return this.slice(0).sort(function (a, b) {
                return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
            });
        }
        ipcRenderer.on("userAssist-init-reply", (event, data) => {
            let filterData = data.map(d => {
                let program = d.name.split('.').pop()
                let storeApps = d.name.split('!').length
                let val = d.count + d.focusCount + d.focusTime

                if (val) {
                    let newData
                    if (program == "lnk") {
                        newData = {
                            name: d.name.split('\\').pop().split('.')[0],
                            value: d.count
                        }
                        return newData
                    }
                    else if (storeApps == 2) {
                        newData = {
                            name: d.name.split('!')[0],
                            value: d.count
                        }
                        return newData
                    }
                }
            })
            const notUndefined = anyValue => typeof anyValue !== 'undefined'
            filterData = filterData.filter(notUndefined)

            this.setState({
                userData: filterData.sortBy("value")
            })
        })
        ipcRenderer.send("userAssist-init")
    }
    componentDidUpdate(prevProps) {
        const removeDup = arr => {
            let names = []
            for (let [key, value] of Object.entries(arr)) {
                let name = value.PFN ?? value.name
                if(names.includes(name)) {
                    delete arr[key]
                }
                names.push(name)
            }
            return arr
        }

        let finalData = []
        this.props.apps.forEach(app => {
            this.state.userData.forEach(data => {
                (app.PFN ?? app.name) == data.name &&
                    finalData.push({ ...app, value: data.value })
            })
        })
        if (prevProps.apps !== this.props.apps) {
            this.setState({
                apps: removeDup(finalData.sortBy("value"))
            })
        }
    }
    render() {
        return (
            <div className="top-containers">
                <div className="header-container">
                    <div className="header">
                        <span>Recently Used</span>
                    </div>
                </div>

                <div className="top-c">
                    {this.Most()}
                </div>
            </div>
        )
    }
}

export default Latest