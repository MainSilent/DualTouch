import React from 'react';
import Keyboard from './control/keyboard';
import Touchpad from './control/touchpad';

class Control extends React.Component {
    render() {
        return (
            <div className="control-container">
                <div className="keyboard-container">
                    <Keyboard />
                </div>
                <div className="touchpad-container">
                    <Touchpad />
                </div>
            </div>
        )
    }
}

export default Control