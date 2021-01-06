// there are some problem when using topbar with events in electron so i have to use it instead in react
// i tried to define the functions in another file but it was not working
const edge = window.require('electron-edge-js')

const dllPath = './modules/tools/taskbar/Taskbar.dll'
// all running windows
const taskbar = edge.func({
    assemblyFile: dllPath,
    typeName: 'Taskbar.Main',
    methodName: 'init'
})
// close the window
const close_ = edge.func({
    assemblyFile: dllPath,
    typeName: 'Taskbar.Main',
    methodName: 'close'
})
// kill the process
const kill_ = edge.func({
    assemblyFile: dllPath,
    typeName: 'Taskbar.Main',
    methodName: 'kill'
})

import React from 'react';
import diff from 'diff-arrays-of-objects';
import TaskView from './components/topbar/taskview';
import DragClose from './components/topbar/drag-close';
import MediaController from './components/topbar/media-controller';

const { ipcRenderer } = window.require("electron");

const programsPath = "../data/programs.json";
const storeAppsPath = "../data/store_apps.json";

class TopBar extends React.Component {
    constructor() {
        super ()
        this.state = {
            taskbar_programs: [],
            programs: [],
            storeApps: [],
            toggle: true,
            current_window: 0
        }
        this.chToggle = this.chToggle.bind(this)
        this.close = this.close.bind(this)
        this.kill = this.kill.bind(this)
    }
    chToggle(bool) {
        this.setState({
            toggle: bool
        })
    }
    // for some storeApps does't show the icon, so we need to get it from storeApps.json
    // and we also do that for other taskbar_programs because the icon in 'program.icon' is low quality
    getIcon(taskbar_program) {
        let icon;
        const defaultIcon = "data:image/png;base64, " + taskbar_program.icon;
        // storeApps
        if(taskbar_program.path === "C:\\WINDOWS\\system32\\ApplicationFrameHost.exe" ||
        taskbar_program.path.startsWith("C:\\Program Files\\WindowsApps")) {
            const PFN_Path = taskbar_program.path.split('\\')[3]

            this.state.storeApps.forEach(app => {
                // we can't use '??' because it doesn't work with `''`
                const cmp = app.unplatedIcon ? app.unplatedIcon : app.Icon
                // if program title matches
                if (app.Name == taskbar_program.title)
                    icon = cmp
                // if program icon paths matches
                else if (app.unplatedIcon && app.unplatedIcon.includes(PFN_Path) ||
                app.unplatedIcon && app.Icon.includes(PFN_Path))
                    icon = cmp
            })
        }
        // programs
        else {
            this.state.programs.forEach(program => {
                if(program.realPath == taskbar_program.path)
                    icon = "data:image/png;base64, " + program.icon
            })
        }

        return icon ?? defaultIcon
    }
    toggle(hWnd) {
        this.state.toggle &&
            ipcRenderer.send('taskbar-toggle', hWnd)
    }
    close(program) {
        close_(program.handle)
    }
    kill(program) {
        kill_(program.handle)
    }
    componentDidMount() {
        // get all opend windows
        taskbar(newPrograms => {
            if (this.state.taskbar_programs !== newPrograms) {
                // Update the title of the program
                if (newPrograms[0] == "update_title") {
                    this.setState(prevState => {
                        const newData = prevState.taskbar_programs.map(program => {
                            if(program.handle == newPrograms[1]) {
                                program.title = newPrograms[2]
                            }  
                            return program   
                        })
                        return {
                            taskbar_programs: newData
                        }
                    })
                } 
                // Update the list of the taskbar_programs (i tried to use diff to give it an order but it did't work that well)
                else if (Array.isArray(newPrograms) && newPrograms.length !== this.state.taskbar_programs.length) {
                    const newDataDiff = diff(this.state.taskbar_programs, newPrograms.reverse(), 'handle');
                    let newData = [...newDataDiff.same, ...newDataDiff.updated, ...newDataDiff.added];
                    newDataDiff.removed.length > 0 &&
                        document.getElementById('program-'+newDataDiff.removed[0].handle).classList.remove("alert")
                    
                    this.setState({
                        taskbar_programs: newData
                    })
                }
            }
        })

        // current focused window
        ipcRenderer.on('taskbar-focus:reply', (event, hWnd) => {
            this.setState({
                current_window: hWnd
            }, () => 
                this.state.taskbar_programs.forEach(program => {
                    if (program.handle == hWnd && program.title == "Movies & TV") {
                        window.location = "#/control/Movies_TV/" + hWnd
                    }
                    else if (program.handle == hWnd && program.path == String.raw `D:\photoshop\Adobe Photoshop CC 2015\Photoshop.exe`) {
                        window.location = `#/control/Photoshop/${hWnd}/${encodeURIComponent(program.title)}`
                    }
                })
            )
        })
        ipcRenderer.send('taskbar-focus')

       // get storeApps and programs to check for program icon
       fetch(programsPath)
        .then(response => response.json())
        .then(data => this.setState({ programs: data }))
       fetch(storeAppsPath)
        .then(response => response.json())
        .then(data => this.setState({ storeApps: data }))
    }
    render() {
        return (
            <div className="top-bar">
                <div className="programs">
                    {this.state.taskbar_programs.map((program, i) => 
                        <DragClose key={i} index={i} program={program} chToggle={this.chToggle} close={this.close} kill={this.kill}>
                            <div 
                            id={"program-"+program.handle}
                            className={this.state.current_window == program.handle ? "program active" : "program"}
                            onClick={() => this.toggle(program.handle)}
                            >
                                <img className="icon" src={this.getIcon(program)}/>
                                <p className="title">{program.title}</p>
                            </div>  
                        </DragClose>
                    )}
                </div>
                <div className="tools">
                    <MediaController />
                    <TaskView />
                </div>
            </div>
        )
    }
}

export default TopBar