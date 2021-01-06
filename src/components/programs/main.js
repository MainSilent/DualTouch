import React from 'react';
import $ from 'jquery';
import { Route } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

class Programs extends React.Component {
    constructor() {
        super()
        this.programs = this.programs.bind(this)
        this.storeApps = this.storeApps.bind(this)
    }
    tabOnClick(event, path) {
        const id = event.target.id
        $('label').attr("class", "")
        $(`label[for=${id}]`).addClass("active")
        $('#' + id).attr("checked", "true")
        location.href = '#' + path
    }
    programs() {
        return (
            this.props.programs.map(program =>
                <div className="program-c" key={program.id} onClick={() => ipcRenderer.send('run-program', program.path)}>
                    <img src={"data:image/png;base64, " + program.icon} className="icon" />
                    <p className="name">{program.name}</p>
                </div>
            )
        )
    }
    storeApps() { 
        return (
            this.props.storeApps.map(app =>
                <div className="program-c" key={app.id} onClick={() => ipcRenderer.send('run-app', app.PFN, app.AppId)}>
                    <img src={app.unplatedIcon ?? app.Icon} className="icon" />
                    <p className="name">{app.Name}</p>
                </div>
            )
        )
    }
    componentDidMount() {
        $("label").not($("label").last()).css("box-shadow", "1px 0 2px -1.5px rgb(0, 0, 0, 0.4)")
    }
    render() {
        return (
            <div className="main-container">
                <div className="tab-container">
                    <div className="tab">
                        <label htmlFor="programs" className="active">Programs</label>
                        <input id="programs" name="tabs" type="radio" onChange={(e) => this.tabOnClick(e, '/programs/')} />
                    </div>
                    <div className="tab">
                        <label htmlFor="storeApps">StoreApps</label>
                        <input id="storeApps" name="tabs" type="radio" onChange={(e) => this.tabOnClick(e, '/programs/storeApps')} />
                    </div>
                    <div className="tab-line"></div>
                </div>

                <div className="route-c">
                    <Route path="/programs/" component={this.programs} exact />
                    <Route path="/programs/storeApps" component={this.storeApps} />
                </div>
            </div>
        )
    }
}

export default Programs