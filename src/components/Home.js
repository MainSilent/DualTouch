import React from 'react';

class Content extends React.Component {
    render() {
        return (
            <div className="home-container" style={{display: "flex", width: "100%", height: "calc(100% - 70px)"}}>
                <h1 style={{margin: "auto"}}>Home!</h1>
            </div>
        )
    }
}

export default Content