const edge = window.require('electron-edge-js')

const dllPath = "./modules/tools/control/Control.dll"

const screen = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Photoshop',
    methodName: 'screen'
})

const tools = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Photoshop',
    methodName: 'tools'
})

const click = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Photoshop',
    methodName: 'click'
})

const hand = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Photoshop',
    methodName: 'hand'
})

import React from 'react';
import $ from 'jquery';
import { Window, Move } from '../window';
import Slider from 'rc-slider';

class Photoshop extends React.Component {
    constructor() {
        super()
        this.state = {
            move: false,
            hand: false,
            zoom: 50,
            handle: parseInt(window.location.hash.split('/')[3]),
            title: decodeURIComponent(window.location.hash.split('/')[4])
        }
        this.toggleMove = this.toggleMove.bind(this)
        this.click = this.click.bind(this)
        this.zoom = this.zoom.bind(this)
    }
    toggleMove() {
        this.setState({ move: !this.state.move })
    }
    tools(type) {
        $('.buttons i').removeClass('active')

        switch (type) {
            case 'brush':
                tools({ handle: this.state.handle, type: "brush" })
                tools({ handle: this.state.handle, type: "brush" })
                $('#brush').addClass('active')
                break;
            case 'eraser':
                tools({ handle: this.state.handle, type: "eraser" })
                tools({ handle: this.state.handle, type: "eraser" })
                $('#eraser').addClass('active')
                break;
            case 'hand':
                tools({ handle: this.state.handle, type: "hand" })
                tools({ handle: this.state.handle, type: "hand" })
                $('#hand').addClass('active')
                break;
        }

        tools({ handle: this.state.handle, type: "reset"})
        this.setState({
            hand: type == 'hand' ? true : false 
        })
    }
    click(e) {
        e.persist()
        const $screen = $('#screen');
        const src = $screen.attr('src');
        const img = new Image();
        img.onload = () => {
            const scaleX = img.width / $screen.width();
            const scaleY = img.height / $screen.height();
            const offset = $screen.offset();
            const relativeX = (e.pageX - offset.left) * scaleX;
            const relativeY = (e.pageY - offset.top) * scaleY;
            
            click({ 
                handle: this.state.handle,
                x: relativeX,
                y: relativeY
            })
            tools({ handle: this.state.handle, type: "reset"})
        }
        img.src = src;
    }
    zoom(percent) {
        this.state.zoom < percent ? hand('zoom-in') : hand('zoom-out')

        this.setState({
            zoom: percent
        })
    }
    componentDidMount() {
        this.tools('brush')
        
        setInterval(() => {
            screen(this.state.handle, (err, image) => {
                $('#screen').attr('src', `data:image/jpeg;base64, ${image}`)
            })  
        }, 10)

        // photoshop scrolling
        var element = document.getElementById('screen');
        var initialX = null;
        var initialY = null;
        
        element.addEventListener("touchstart", startTouch);
        element.addEventListener("touchmove", moveTouch);

        function startTouch(e) {
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
        }

        function moveTouch(e) {
            if ($('#hand').attr('class').includes('active')) {
                e.preventDefault();
                if (e.touches.length < 2) {
                    var currentX = e.touches[0].clientX;
                    var currentY = e.touches[0].clientY;
                    var diffX = initialX - currentX;
                    var diffY = initialY - currentY;
                    
                    // for ------------------ X ------------------------ //
                    if (Math.abs(diffX) > Math.abs(diffY)) {
                        if (diffX > 0) hand('left')
                        else hand('right')
                    } 
    
                    // for ------------------ Y ------------------------ //
                    else {
                        if (diffY > 0) hand("up")
                        else hand("down")
                    }
                }
            }
        }
    }
    render() {
        return (
            <div className="Photoshop-container">
                <Window handle={this.state.handle} title={this.state.title} toggle={this.toggleMove} />
                {this.state.move && <Move handle={this.state.handle} />}

                {!this.state.move && 
                <div className="controls">
                        <div className="buttons">
                            <i id="brush" className="fas fa-paint-brush" onClick={() => this.tools('brush')}></i>
                            <i id="eraser" className="fas fa-eraser" onClick={() => this.tools('eraser')}></i>
                            <i id="hand" className="fas fa-hand-paper" onClick={() => this.tools('hand')}></i>
                            <Slider
                                className="slider"
                                vertical="true"
                                defaultValue={50}
                                onChange={this.zoom}
                            />
                        </div>

                        <div className="document">
                            <img id="screen" onClick={e => !this.state.hand && this.click(e)}/>
                        </div>
                </div>}
            </div>
        )
    }
}

export default Photoshop