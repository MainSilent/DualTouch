const edge = window.require('electron-edge-js')

const dllPath = "./modules/tools/control/Control.dll"

const send = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Movies_TV',
    methodName: 'send'
})

const getCurrent = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Movies_TV',
    methodName: 'getCurrent'
})

const getProgress = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Movies_TV',
    methodName: 'getProgress'
})

const getVolume = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Movies_TV',
    methodName: 'getVolume'
})

import React from 'react';
import { Window, Move } from '../window';
import Slider from 'rc-slider';

class Movies_TV extends React.Component {
    constructor() {
        super()
        this.state = {
            progress: 0,
            volume: 100,
            move: false,
            isProgress: false,
            isVolume: false,
            changing: false,
            title: "Movies & TV",
            current: "",
            duration: "",
            handle: parseInt(window.location.hash.split('/')[3]) 
        }
        this.toggleMove = this.toggleMove.bind(this)
        this.progress = this.progress.bind(this)
        this.volume = this.volume.bind(this)
    }
    toggleMove() {
        this.setState({
            move: !this.state.move
        })
    }
    progress(percent) {
        send({
            type: "setProgress",
            handle: this.state.handle,
            percent: percent
        })
        this.setState({ isProgress: false })
    }
    volume(percent) {
        send({
            type: "setVolume",
            handle: this.state.handle,
            percent: percent
        })
    }
    componentDidMount() {
        setInterval(() => {
            getCurrent(this.state.handle, (err, current) => {
                if (current) {
                    current = JSON.parse(current)
                    console.log(current.current.split("elapsed")[1]);
                    this.setState({
                        title: current.title,
                        current: current.current.split("elapsed")[1] ? current.current.split("elapsed")[1] : this.state.current,
                        duration: current.duration.split("remaining")[1] ? current.duration.split("remaining")[1] : this.state.duration
                    })
                }
            })
            getVolume(this.state.handle, (err, volume) => {
                Number.isInteger(volume) &&
                    this.setState({ volume: volume })
            })
            getProgress(this.state.handle, (err, Progress) => {
                Number.isInteger(Progress) && !this.state.isProgress &&
                    this.setState({ progress: Progress })
            })
        }, 200)
    }
    render() {
        return (
            <div className="Movies_TV-container">
                <Window handle={this.state.handle} title={this.state.title} toggle={this.toggleMove} />
                {this.state.move && <Move handle={this.state.handle} />}

                {!this.state.move && 
                <div className="controls">
                    <div className="progress">
                        <Slider
                            className="progressSlider"
                            value={this.state.progress}
                            onBeforeChange={() => this.setState({ isProgress: true })}
                            onChange={percent => this.setState({ progress: percent })}
                            onAfterChange={this.progress} 
                        />

                        <div className="length">
                            <p className="current">{this.state.current}</p>
                            <p className="duration">{this.state.duration}</p>
                        </div>
                    </div>

                    <div className="buttons">
                        <div className="volume">
                            <i className="fas fa-volume button" onClick={() => {
                                send({handle: this.state.handle, type: "volume"})
                                this.setState({isVolume:!this.state.isVolume})
                            }}></i>
                            {this.state.isVolume && 
                            <Slider
                                className="slider"
                                value={this.state.volume}
                                onChange={percent => this.setState({ volume: percent })}
                                onAfterChange={this.volume} 
                            />}
                        </div>

                        <div className="middle">
                            <p className="button" style={{ marginRight: "10px" }} onClick={() => send({handle: this.state.handle, type: "-10"})}>-10</p>

                            <div className="button" onClick={() => send({handle: this.state.handle, type: "play"})}>
                                <i className="fas fa-play"></i>
                                <i className="fas fa-pause"></i>
                            </div>

                            <p className="button" style={{ marginLeft: "10px" }} onClick={() => send({handle: this.state.handle, type: "+30"})}>+30</p>
                        </div>
                        
                        <i className="fas fa-expand-alt button" onClick={() => send({handle: this.state.handle, type: "expand"})}></i>
                    </div>
                </div>}
            </div>
        )
    }
}

export default Movies_TV