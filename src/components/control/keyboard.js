const edge = window.require('electron-edge-js')

const dllPath = "./modules/tools/control/Control.dll"

const press = edge.func({
    assemblyFile: dllPath,
    typeName: 'Control.Keyboard',
    methodName: 'press'
})

import React from 'react';
import $ from 'jquery';
import layout from './layout';

class Keyboard extends React.Component {
    constructor() {
        super()
        this.state = {
            capslock: false, 
            shift: false
        }
    }
    toggleCaps() {
        this.setState({ capslock: !this.state.capslock })
    }
    toggleShift() {
        this.setState({ shift: !this.state.shift })
    }
    press(key) { 
        switch (key.name) {
            case 'spacebar':
                press(` `)
                break
            case 'winkey':
                press(`^{esc}`)
                break
            case 'menu':
                press(`+({F10})`)
                break
            case 'prt sc':
                press(`{PRTSC}`)
                break
            case 'capslock':
                this.toggleCaps()
                break
            case 'shift':
                this.toggleShift()
                press(`+`)
                break
            case 'ctrl':
                press(`^`)
                break
            case 'alt':
                press(`%`)
                break
            default:
                if (key.type == 'alphabet' && this.state.capslock || this.state.shift)
                    press(`{${key.cname}}`)
                else if (key.type == 'char' && this.state.shift)
                    press(`{${key.cname}}`)
                else
                    press(`{${key.name}}`)
        }
    }
    checkKey(name) {
        switch (name) {
            case 'spacebar':
                return ''
            case 'winkey':
                return <i className="fab fa-windows" style={{fontSize: '28px'}}></i>
            case 'menu':
                return <i className="fas fa-bars"></i>
            case 'up':
                return <i className="fal fa-chevron-up"></i>
            case 'right':
                return <i className="fal fa-chevron-right"></i>
            case 'left': 
                return <i className="fal fa-chevron-left"></i>
            case 'down':
                return <i className="fal fa-chevron-down"></i>
            default:
                return name
        }
    }
    styleKey(name) {
        switch (name) {
            case '~':
                return {top: '1px'}
            case '_':
                return {top: '-8px'}
        }
    }
    classKey(type, alter) {
        // i have no idea what i'm doing 😐
        if (type == 'alphabet' || type == 'char') {
            if (alter) {
                if (type === 'alphabet' && this.state.capslock || this.state.shift)
                    return "cname active-letter"
                else
                    return "cname"
            }
            else {
                if (type === 'alphabet' && !this.state.shift && !this.state.capslock)
                    return "name active-letter"
                else if (type === 'char' && !this.state.shift)
                    return "name active-letter"
                else
                    return "name"
            }
        } 
        else {
            return "name active-letter"
        }
    }
    render() {
        return (
            layout.keys.map((row, i) => 
                <div key={i} className="keys">
                {row.map((col, index) =>
                    <div 
                     key={index}
                     id={`key-${i}-${index}`}
                     onClick={() => this.press(col)}
                     onTouchStart={() => $(`#key-${i}-${index}`).addClass('active')}
                     onTouchEnd={() => $(`#key-${i}-${index}`).removeClass('active')}
                     className={`key ${col.name == "capslock" && this.state.capslock && "active"} ${col.name == "shift" && this.state.shift && "active"}`}
                     style={{ padding: `${i === 0 ? '1' : '1.7'}% ${i === 0 ? '2' : col.space * 2.5}%` }}>
                        <p className={this.classKey(col.type, false)}>{this.checkKey(col.name)}</p>
                        <p className={this.classKey(col.type, true)}
                         style={this.styleKey(col.cname)}>
                            {col.cname}
                        </p>
                    </div>
                )}
                </div>
            )
        )
    }
}

export default Keyboard