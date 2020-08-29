import React from 'react';

class SideBar extends React.Component {
    render() {
        return (
            <div className="side-bar">
                <i class="fad fa-home-alt icon"></i> 
                <i class="fad fa-th-large icon"></i>
                <i class="fad fa-keyboard icon"></i>
                <i class="fas fa-folder icon active"></i>
                <i class="fad fa-power-off icon"></i>
            </div>
        )
    }
}

export default SideBar