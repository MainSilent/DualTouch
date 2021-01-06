import React from 'react';
import $ from 'jquery';
import Files from './fileExplorer/files';
import Sidebar from './fileExplorer/sidebar';
import Navigation from './fileExplorer/navigation';
import BreadCrumbs from './fileExplorer/breadcrumbs';
const { ipcRenderer } = window.require("electron");

class FileExplorer extends React.Component {
    constructor() {
        super();
        this.state = {
            files: [],
            history: ["main"],
            position: 1,
            current: "",
            bookmarks: []
        }
        this.addHistory = this.addHistory.bind(this)
        this.getBookmarks = this.refreshBookmarks.bind(this)
    }
    chDir() {
        const current = this.state.history[this.state.history.length - this.state.position]
        if (current == "main") {
            this.setState({ files: "main" })
            return;
        }
        if (this.state.history.length) {
            ipcRenderer.on("fileExplorer-init-reply", (event, files) => {
                this.setState({
                    files: files
                })
                ipcRenderer.removeAllListeners()
            })
            ipcRenderer.send("fileExplorer-init", current)
        }
    }
    addHistory(newPath) {
        if (this.state.history[this.state.history.length - this.state.position] != newPath) {
            if (this.state.position == 1) {
                this.setState({
                    history: [...this.state.history, newPath]
                }, () => this.chDir())
            } else {
                const trimHistory = this.state.history.slice(0, this.state.history.length - (this.state.position - 1))
                this.setState({
                    history: [...trimHistory, newPath],
                    position: 1
                }, () => this.chDir())
            }
        }
    }
    refreshBookmarks(newBookmark) {
        this.setState({
            bookmarks: newBookmark
        })
    }
    changePosition(newPosition) {
        this.setState({
            position: newPosition,
        }, () => this.chDir())
    }
    componentDidMount() {
        ipcRenderer.on("file:bookmarks:reply", (event, data) => {
            this.setState({
                bookmarks: !data.values ? [] : data.values.bookmarks.value
            })
        })
        ipcRenderer.send("file:bookmarks")
    }
    componentDidUpdate(prevProps, prevState) {
        const current = this.state.history[this.state.history.length - this.state.position]
        if (prevState.history != this.state.history || prevState.position != this.state.position)
            this.setState({
                current: current == "main" ? false : current
            })
        
        const breadcrumbsMaxScroll = $('.breadcrumbs').prop("scrollWidth") - $('.breadcrumbs').width()
        $('.breadcrumbs').scrollLeft(breadcrumbsMaxScroll)
    }
    render() {
        return (
            <div className="fileExplorer-container">
                <Navigation
                    position={this.state.position}
                    chPosition={this.changePosition.bind(this)}
                    history={this.state.history}
                />

                <BreadCrumbs
                    current={this.state.current}
                    refresh={this.refreshBookmarks.bind(this)}
                    bookmarks={this.state.bookmarks}
                    add={this.addHistory}
                />

                <Sidebar
                    bookmarks={this.state.bookmarks}
                    add={this.addHistory}
                />

                <Files
                    files={this.state.files}
                    add={this.addHistory}
                />
            </div>
        )
    }
}

export default FileExplorer