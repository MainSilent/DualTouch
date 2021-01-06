import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Root from "./root"
import Loader from "./PreLoader";
const os = window.require("os");

const username = os.userInfo().username

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      isLoading: true
    }
    this.stopLoading = this.stopLoading.bind(this);
  }
  stopLoading() {
    this.setState({
      isLoading: false
    })
  }
  render() {
    const background_img = `url('C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Themes/TranscodedWallpaper')`
    $('head').append(`<style>.index:before{background-image:${background_img} !important;}</style>`);
    return (
      <div className="index">
        {
          this.state.isLoading ? <Loader stop={this.stopLoading}/> :
          <Root/>
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"))