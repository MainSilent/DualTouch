import React from 'react';
import $ from 'jquery';
const { ipcRenderer } = window.require("electron");

class PreLoader extends React.Component {
    constructor() {
        super()
        this.state = {
            Programs: false,
            StoreApps: false,
            code: 0,
            progress: 0,
            errDetail: "",
            detail: ""
        }
    }
    stopLoading() {
        if(this.state.Programs && this.state.StoreApps) 
            this.props.stop()
    }
    startBarFade() {
        $(".round-loader, .progress").hide()
        $(".bar-loader").show()
        $(".bar-loader").addClass("bar-loader-fade")
        $(".details").css({marginTop: '3.4%'})
    }
    stopBarFade() {
        $(".round-loader, .progress").show()
        $(".bar-loader").hide()
        $(".bar-loader").removeClass("bar-loader-fade")
        $(".details").css({marginTop: '5%'})
    }
    toggleBar() { $(".round-loader, .bar-loader").toggle() }
    error() {
        $(".round-loader, .progress, .bar-loader").hide()
        $(".error-container").show()
    }
    Restart() { ipcRenderer.send("Restart") }
    Close() { ipcRenderer.send("Close") }

    Programs(msg) { 
        this.startBarFade()
        this.setState({detail: msg})
        ipcRenderer.on('Programs-init-reply', (event, detail, progress) => {
            if(!detail) {
                this.setState({
                    code: progress.code,
                    errDetail: progress.message
                }, () => this.error())
            } 
            else {
                this.setState({ detail: detail })
                if(progress == 101) {
                    this.setState({ Programs: true }, () => this.stopLoading())
                }
            }
        })
        ipcRenderer.send("Programs-init")
    }
    StoreApps(msg) {
        this.startBarFade()
        this.setState({detail: msg})
        ipcRenderer.on('storeApps-init-reply', (event, detail) => {
            if(detail.status === false) {
                this.setState({
                    code: detail.code,
                    errDetail: detail.message
                }, () => this.error())
            } 
            else {
                this.setState({
                    StoreApps: detail.status,
                    detail: detail.message
                },() => this.stopLoading())
            }
        })
        ipcRenderer.send("storeApps-init")
    }
    componentDidMount() {
        ipcRenderer.on('init-reply', (event, detail) => {
            this.setState({
                Programs: detail.programs.status,
                StoreApps: detail.storeApps.status
            },() => this.stopLoading())
            
            if(!detail.storeApps.status) 
                this.StoreApps(detail.storeApps.message) 
            if(!detail.programs.status)
                this.Programs(detail.programs.message)
        })
        ipcRenderer.send('init')
    }
    render() {
      return (
            <div className="loader-container">
                <div className="round-loader"></div>
                <div 
                    className="bar-loader"
                    style={{background: `linear-gradient(to right, #fff ${this.state.progress}%, rgba(255, 255, 255, 0.2) 0)`}}
                >
                    <p className="progress">{this.state.progress}%</p>
                    <p className="details">{this.state.detail}</p>
                </div>
                <div className="error-container">
                    <h1 className="error-title">Something Went Wrong! <span className="error-sad">:(</span></h1>
                    <hr className="error-hr"/>
                    <h2 className="error-code">Error Code: {this.state.code}</h2>
                    <h2 className="error-detail">Details:</h2>
                    <p className="error-detail-text">{this.state.errDetail}</p>
                    <div className="button-container">
                        <button className="button" onClick={this.Restart}>Restart</button>
                        <button className="button" onClick={this.Close}>Close</button>
                        <p className="more-p">NEED HELP? <a className="button">Click Here</a></p>
                    </div>
                </div>
            </div>  
        );
    }
}

export default PreLoader