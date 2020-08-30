import React from 'react';

class TopBar extends React.Component {
    render() {
        return (
            <div className="top-bar">
                <i className="side-bar fad fa-home-alt icon"></i> 
                <i className="side-bar fad fa-th-large icon"></i>
                <i className="side-bar fad fa-keyboard icon"></i>
                <i className="side-bar fas fa-folder icon active"></i>
                <i className="side-bar fad fa-power-off icon"></i>
            </div>
        )
    }
}

export default TopBar