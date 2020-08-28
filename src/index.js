import React from 'react';
import ReactDOM from 'react-dom';
import Loader from "./components/react/PreLoader";

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
        <div className="bg-image"></div>
        {
        this.state.isLoading ? <Loader stop={this.stopLoading}/> :

        <div style={{
          color: 'white',
          position: 'relative',
          fontSize: 50,
          textAlign: 'center' ,
          marginTop: '400px'
        }}>Done!</div>
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"))