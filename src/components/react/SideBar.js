import React from 'react';

class SideBar extends React.Component {
    render() {
        return (
            <div className="side-bar">
                <i className="fad fa-home-alt icon"></i> 
                <i className="fad fa-th-large icon"></i>
                <i className="fad fa-keyboard icon"></i>
                <i className="fas fa-folder icon active"></i>
                <i className="fad fa-power-off icon"></i>
            </div>
        )
    }
}

export default SideBar