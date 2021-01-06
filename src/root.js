import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
//Switch Components
import Home from "./components/Home";
import Programs from "./components/Programs";
import Control from "./components/Control";
import FileExplorer from "./components/FileExplorer";
import Power from "./components/Power";
// Extensions
import Movies_TV from "./components/control/extensions/movies&tv";
import Photoshop from "./components/control/extensions/photoshop";

class Root extends React.Component {
  constructor() {
    super ()
    this.state = {
      power: false
    }
    this.setPower = this.setPower.bind(this)
  }
  setPower() { this.setState({power: !this.state.power}) }
  render() {
    return (
      <Router>
        <SideBar power={this.setPower} />
        
        {this.state.power && <Power power={this.setPower} />}
        
        <div className="root">
          <TopBar />
          
          <Switch>
            <Route path="/file-explorer" component={FileExplorer} />
            <Route path="/control/Photoshop" component={Photoshop} />
            <Route path="/control/Movies_TV" component={Movies_TV} />
            <Route path="/control" component={Control} />
            <Route path="/programs" component={Programs} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default Root