const edge = window.require('electron-edge-js')

const dllPath = "./modules/tools/control/Control.dll"

const bounds = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Window',
    methodName: 'bounds'
})

const chBounds = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Window',
    methodName: 'chBounds'
})

const manage = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Window',
    methodName: 'manage'
})

import React from 'react';
import $ from 'jquery';
import Draggable from 'react-draggable';

const os = window.require("os");

const username = os.userInfo().username

class Window extends React.Component {
    render() {
        const handle = parseInt(this.props.handle) 

        return (
            <div className="window-container">
                <div className="title">
                    <p>{this.props.title}</p>
                </div>

                <div className="set_position">
                    <i 
                        className="far fa-arrows-alt set_position_btn"
                        onClick={() => {
                            $('.set_position_btn').toggleClass('active')
                            this.props.toggle()
                        }}>
                    </i>
                </div>

                <div className="manage">
                    <div className="minimize" onClick={() => {
                        manage({type: 'minimize', handle: handle})
                        window.location = "#/control"
                    }}>
                        <i className="far fa-window-minimize"></i>
                    </div>
                    <div className="maximize" onClick={() => manage({type: 'maximize', handle: handle})}>
                        <i className="far fa-square"></i>
                    </div>
                    <div className="close" onClick={() => {
                        manage({type: 'close', handle: handle})
                        window.location = "#/control"
                    }}>
                        <i className="far fa-times"></i>
                    </div>
                </div>
            </div>
        )
    }
}

class Move extends React.Component {
    constructor() {
        super()
        this.state = {
            resize: false,
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            currentPosX: 0,
            currentPosY: 0,
            initialX: null,
            initialY: null
        }
        this.drag = this.drag.bind(this)
        this.toggleResize = this.toggleResize.bind(this)
        this.startResize = this.startResize.bind(this)
        this.moveResize = this.moveResize.bind(this)
        this.endResize = this.endResize.bind(this)
    }
    drag(event, data) {
        chBounds({
            type: 'move',
            handle: parseInt(this.props.handle),
            x: this.state.x + data.x,
            y: this.state.y + data.y
        })
    }
    startResize(e) {
        this.setState({
            resize: true,
            currentPosX: e.touches[0].clientX,
            currentPosY: e.touches[0].clientY,
            initialX: e.touches[0].clientX,
            initialY: e.touches[0].clientY
        }, () => $('.window .fa-square').css('opacity', '1'))
    }
    moveResize(e) {
        const positionX = e.touches[0].clientX - this.state.currentPosX
        const positionY = e.touches[0].clientY - this.state.currentPosY
        const newWidth = this.state.width + positionX
        const newHeight = this.state.height + positionY
        
        $('.window').css('width', newWidth)
        $('.window').css('height', newHeight)

        chBounds({
            type: 'resize',
            handle: parseInt(this.props.handle),
            width: newWidth,
            height: newHeight
        })
    }
    endResize() {
        this.setState({
            width: parseInt($('.window').css('width')),
            height: parseInt($('.window').css('height'))
        })
    }
    toggleResize() {
        this.state.resize && 
            this.setState({ resize: false }, () => $('.window .fa-square').css('opacity', '0'))
    }
    componentDidMount() {
        bounds(parseInt(this.props.handle), (err, bounds) => 
            this.setState({
                height: bounds.Height,
                width: bounds.Width,
                x: bounds.X,
                y: bounds.Y
            })
        )

        const elements = document.getElementsByClassName('fa-square')
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("touchstart", this.startResize)
            elements[i].addEventListener("touchmove", this.moveResize)
            elements[i].addEventListener("touchend", this.endResize)
        }
    }
    render() {
        const background_img = `url('C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Themes/TranscodedWallpaper')`
        const styles = { 
            move: {
                width: screen.width,
                height: screen.height,
                backgroundImage: background_img 
            },
            window: { 
                height: this.state.height,
                width: this.state.width,
                marginLeft: this.state.x,
                marginTop: this.state.y
            }
        }
        return (
            <div className="move-container">
                <div className="move" style={styles.move}>
                    <Draggable disabled={this.state.resize} onDrag={this.drag}>
                        <div style={styles.window} className="window" onClick={this.toggleResize}>
                            <i className="fas fa-square t-left"></i>
                            <i className="fas fa-square t-right"></i>
                            <i className="fas fa-square b-left"></i>
                            <i className="fas fa-square b-right"></i>
                        </div>
                    </Draggable>

                    <div className="taskbar" style={{ height: screen.height - screen.availHeight }}>
                        <p>Available Height: {screen.availHeight}</p>
                        <p>Taskbar</p>
                    </div>
                </div>
            </div>
        )
    }
}

export { Window, Move }