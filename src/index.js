import React from 'react';
import ReactDOM from 'react-dom';
import Loader from "./components/react/PreLoader";
import SideBar from "./components/react/SideBar";
import TopBar from "./components/react/TopBar";
import Content from "./components/react/Content";

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
    return (
      <div className="Main">
        {
        this.state.isLoading ? <Loader stop={this.stopLoading}/> :
        
        <div className="main-content">
          <SideBar />
          <TopBar />
          <Content />
        </div>
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"))