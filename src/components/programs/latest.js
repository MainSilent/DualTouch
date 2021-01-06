import React from 'react';
const { ipcRenderer } = window.require("electron");

class Latest extends React.Component {
    constructor() {
        super()
        this.state = {
            apps: []
        }
        this.Latest = this.Latest.bind(this)
    }
    Latest() {
        return (
            this.state.apps.slice(0, 20).map(app =>
                Object.keys(app)[3] == "PFN" ?
                    <div className="program-c" key={"program-"+app.id} onClick={() => ipcRenderer.send('run-app', app.PFN, app.AppId)}>
                        <img src={app.unplatedIcon ?? app.Icon} className="icon" />
                        <p className="name">{app.Name}</p>
                    </div> 
                        :
                    <div className="program-c" key={"storeApp-"+app.id} onClick={() => ipcRenderer.send('run-program', app.path)}>
                        <img src={"data:image/png;base64, " + app.icon} className="icon" />
                        <p className="name">{app.name}</p>
                    </div>
            )
        )
    }
    componentDidUpdate(prevProps) {
        Array.prototype.sortBy = function (p) {
            return this.slice(0).sort(function (a, b) {
                return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
            });
        }
        if (prevProps.apps !== this.props.apps) {
            this.setState({
                apps: this.props.apps.sortBy("DateCreated")
            })
        }
    }
    render() {
        return (
            <div className="top-containers">
                <div className="header-container">
                    <div className="header">
                        <span>Latest Installed</span>
                    </div>
                </div>

                <div className="top-c">
                    {this.Latest()}
                </div>
            </div>
        )
    }
}

export default Latest