import React from 'react';
import { NavLink as Link } from 'react-router-dom';

class SideBar extends React.Component {
    render() {
        return (
            <div className="side-bar">
                <Link to="/" className="fad fa-home-alt icon" exact />
                <Link to="/programs" className="fad fa-th-large icon" />
                <Link to="/control" className="fad fa-keyboard icon" />
                <Link to="/file-explorer" className="fa fa-folder icon" />
                
                <a onClick={this.props.power} className="fad fa-power-off icon"></a>
            </div>
        )
    }
}

export default SideBar