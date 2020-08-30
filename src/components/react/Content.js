import React from 'react';
import storeApps from '../../../data/store_apps.json';
import Programs from '../../../data/programs.json';
const { ipcRenderer } = window.require("electron");

class Content extends React.Component {
    render() {
        // tmp styles
        const styles = {
            position: 'absolute',
            margin: "80px 85px 0",
            width: "90%",
            height: "80%",
            color: "white"
        }
        return (
            // i should also add 'Windows Accessroies'
            <div className="content" style={styles}>
                <h1>Store Apps</h1><hr/><br/>
                {storeApps.map(app => 
                <div key={app.id} onClick={()=>ipcRenderer.send('run-app', app.PFN, app.AppId)} style={{border: "2px solid black", float: "left", cursor: "pointer", margin: "20px", padding: "20px", borderRadius: "10px"}}>
                    <img width="100" src={app.unplatedIcon ?? app.Icon}/>
                    {app.Name}
                </div>    
                )}

                {Programs.map(app => 
                <div key={app.id} onClick={()=>ipcRenderer.send('run-program', app.path)} style={{border: "2px solid black", float: "left", cursor: "pointer", margin: "20px", padding: "20px", borderRadius: "10px"}}>
                    <img width="100" src={`data:image/png;base64, ${app.icon}`}/>
                    {app.name}
                </div>    
                )}
            </div>
        )
    }
}

export default Content