// It doesn't work as expected 😔

const edge = window.require('electron-edge-js')

const dllPath = "./modules/tools/control/Control.dll"

const move = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Mouse',
    methodName: 'move'
})

const rightClick = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Mouse',
    methodName: 'right'
})

const leftClick = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Mouse',
    methodName: 'left'
})

const currentPos = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Mouse',
    methodName: 'currentPos'
})

import React from 'react';

class Touchpad extends React.Component {
    constructor() {
        super()
        this.lastX = null;
        this.lastY = null;
    }

    handleMouse(X, Y) {
        const x = X - this.lastX
        const y = Y - this.lastY
            this.lastX = X
            this.lastY = Y
        currentPos(null, (err, pos) => move({x: pos.X + x, y: pos.Y + y}))
    }

    componentDidMount() {
        const element = document.getElementsByClassName("touchpad")[0]
        
        element.addEventListener("touchstart", event => {
            const touchPos = event.touches[0];
                this.lastX = touchPos.clientX;
                this.lastY = touchPos.clientY;
            event.preventDefault();
        })

        element.addEventListener("touchmove", event => {
            event.preventDefault();
            let touchPos = event.touches[0];
            this.handleMouse(touchPos.clientX, touchPos.clientY);
        })

        element.addEventListener("touchend", () => currentPos(null, (err, pos) => move({x: pos.X, y: pos.Y})))
    }
    render() {
        return (
            <div className="touchpad">
                <div className="left-side" onClick={() => leftClick(null)}></div>
                <div className="middle-line"></div>
                <div className="right-side" onClick={() => rightClick(null)}></div>
            </div>
        )
    }
}

export default Touchpad