import React from 'react';
import $ from 'jquery';
const { execSync } = window.require("child_process")

class Power extends React.Component {
    action(name) {
        switch (name) {
            case "shutdown":
                execSync("shutdown.exe -s -t 0")
                break;
            case "restart":
                execSync("shutdown.exe -r -t 0")
                break;
            case "sleep":
                // This is hibernate for sleep `powercfg /hibernate on`
                execSync(`powercfg /hibernate off && RUNDLL32.EXE powrprof.dll,SetSuspendState 0,1,0`)
                break;
            case "logout":
                execSync("shutdown.exe -l")
                break;
            case "lock":
                execSync("rundll32.exe user32.dll,LockWorkStation")
                break;
        }
    }
    componentDidMount() {
        const power = this.props.power
        $('.power-container').on('click', function (e) {
            if (e.target !== this) return;
            power()
        })
    }
    render() {
        const actions = ["shutdown", "restart", "sleep", "logout", "lock"]
        return (
            <div className="power-container">
                {actions.map((action, i) =>
                    <img key={i} onClick={() => this.action(action)} className="icon" src={"assets/images/icons/power/" + action + ".png"} />
                )}
            </div>
        )
    }
}

export default Power