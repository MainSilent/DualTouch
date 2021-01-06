import React from 'react';
import Main from './programs/main';
import Most from './programs/most';
import Latest from './programs/latest';

const programsPath = "../data/programs.json"
const storeAppsPath = "../data/store_apps.json"

class Programs extends React.Component {
    constructor() {
        super()
        this.state = {
            programs: [],
            storeApps: [],
            all: []
        }
    }
    componentDidMount() {
        location.href = '#/programs/'
        fetch(programsPath)
            .then(response => response.json())
            .then(data => this.setState({ programs: data, all: [...this.state.all, ...data] }))
        fetch(storeAppsPath)
            .then(response => response.json())
            .then(data => this.setState({ storeApps: data, all: [...this.state.all, ...data] }))
    }
    render() {
        return (
            <div className="programs-container">
                <div className="flex-container">
                    <div style={{ width: "48%" }}>
                        <Most 
                            apps={this.state.all}
                        />
                    </div>
                    <div style={{ width: "48%" }}>
                        <Latest
                            apps={this.state.all}
                        />
                    </div>
                </div>
                <div className="container">
                    <Main
                        programs={this.state.programs}
                        storeApps={this.state.storeApps}
                    />
                </div>
            </div>
        )
    }
}

export default Programs