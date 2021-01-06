import React from 'react';
import path from 'path';
import Main from './disks'
import byteSize from 'byte-size';
import icons from '../../../public/assets/file-icons/material-icons.json';
const { ipcRenderer } = window.require('electron');

class Files extends React.Component {
    constructor() {
        super()
        this.state = {
            files: "main"
        }
    }
    icon(name, type) {
        let icon = ""
        // File
        if (type == "file") {
            const defaultFile = "file"
            if (name.split(".").length > 1) {
                const ext = name.split(".").pop()
                icon = icons.fileExtensions[ext] ?? defaultFile
            }
            else icon = icons.fileNames[name] ?? defaultFile
        }
        // Directory
        else if (type == "dir") {
            const defaultFolder = "folder"
            icon = icons.folderNames[name] ?? defaultFolder
        }
        // Access Denied
        else if (type == "Access Denied") {
            icon = "Access Denied"
        }
        // Can't find any icon
        else icon = "Question Mark"

        const iconPath = path.join("assets\\file-icons", icons.iconDefinitions[icon].iconPath)
        return iconPath
    }
    formatSize(size, type) {
        if (type == "file") {
            const sizeObj = byteSize(size)
            return sizeObj.value + " " + sizeObj.unit
        }
        else if (type == "dir") return ""

        return "N/A"
    }
    openFile(path, type) {
        type == "dir" ? this.props.add(path) : ipcRenderer.send("file:open", path)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.files !== this.props.files) {
            this.setState({
                files: !this.props.files.length ? false : this.props.files
            })
        }
    }
    render() {
        return (
            this.state.files == "main" ? <Main add={this.props.add}/> :
            <div className="files">
                {!this.state.files ? <h1>Empty</h1> : this.state.files.map(file =>
                    <div className="file" key={file.id} onClick={() => this.openFile(file.path, file.type)}>
                        <img className="icon" src={
                            this.icon(file.path.split("\\").pop().toLowerCase(), file.type)
                        } />
                        <div className="detail">
                            <p className="name">{file.name}</p>
                            <p className="size">{this.formatSize(file.size, file.type)}</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Files