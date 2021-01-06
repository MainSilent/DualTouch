import React from 'react';
import $ from 'jquery';
const os = window.require("os");

const username = os.userInfo().username

class Sidebar extends React.Component {
    constructor() {
        super ()
        this.state = {
            bookmark: []
        }
        this.switch = this.switch.bind(this)
        this.bookmark = this.bookmark.bind(this)
    }
    switch(event) {
        const id = event.target.id
        const add = this.props.add
        $(".sidebar div div").removeClass("active")
        $(`#${id}`).addClass("active")
        
        if (id == "This_PC") {
            add("main")
        } else {
            add(`C:\\Users\\${username}\\${id}`)
        }
    }
    bookmark(event) {
        const id = event.target.id
        $(".sidebar div div").removeClass("active")
        $(`#${id}`).addClass("active")
        this.props.add(this.props.bookmarks[id.charAt(8)])
    }
    render() {
        return (
            <div className="sidebar">
                <div className="quick_access">
                    <div id="This_PC" onClick={this.switch} className="active"><i className="fal fa-desktop"></i>This PC</div>
                    <div id="Desktop" onClick={this.switch}><i className="fal fa-rectangle-landscape"></i>Desktop</div>
                    <div id="Documents" onClick={this.switch}><i className="fal fa-file-alt"></i>Documents</div>
                    <div id="Downloads" onClick={this.switch}><i className="fal fa-arrow-to-bottom"></i>Downloads</div>
                    <div id="Music" onClick={this.switch}><i className="fal fa-music-alt"></i>Music</div>
                    <div id="Pictures" onClick={this.switch}><i className="fal fa-image"></i>Pictures</div>
                    <div id="Videos" onClick={this.switch}><i className="fal fa-play"></i>Videos</div>
                </div>

                <div className="line"></div>
                
                <div className="quick_access bookmarks">
                    {this.props.bookmarks.map((path, i) => 
                        path != 0 && <div key={i} id={"bookmark"+i} onClick={this.bookmark}>{path.split("\\").pop()}</div>    
                    )}
                </div>
            </div>
        )
    }
}

export default Sidebar