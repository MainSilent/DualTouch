import React from 'react';

class Navigation extends React.Component {
    constructor() {
        super ()
        this.navigation = this.navigation.bind(this)
    }
    navigation(direction) {
        const value = this.props.position + direction
        const condition = value > 0 && value <= this.props.history.length

        condition && this.props.chPosition(value) 
    }
    render() {
        return (
            <div className="navigation">
                <span onClick={() => this.navigation(1)}><i className="fal fa-chevron-left"></i></span>
                <span onClick={() => this.navigation(-1)}><i className="fal fa-chevron-right"></i></span>
            </div>
        )
    }
}

export default Navigation