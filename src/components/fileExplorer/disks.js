import React from 'react';
import byteSize from 'byte-size';
const diskInfo = window.require('node-disk-info');

class Disks extends React.Component {
    constructor() {
        super()
        this.state = {
            info: {}
        }
    }
    size(d) {
        const all = Math.round(byteSize(d.blocks).value) + " " + byteSize(d.blocks).unit
        const used = Math.round(byteSize(d.used).value) + " " + byteSize(d.used).unit
        return used + " \\ " + all
    }
    componentDidMount() {
        diskInfo.getDiskInfo()
            .then(disks => {
                this.setState({ info: disks })
            })
            .catch(err => console.error(err))
    }
    render() {
        return (
            <div className="files disks">
                {Object.values(this.state.info).map((disk, i) =>
                    <div className="file disk" key={i} onClick={() => this.props.add(disk.mounted)}>
                        <img className="icon" src={`assets/images/icons/drive/${disk.mounted == "C:" ? "cdrive" : "drive"}.png`} />
                        <div className="detail">
                            <p className="name">{disk.mounted}</p>
                            <div id="progressbar">
                                <div style={{ width: disk.capacity }}></div>
                            </div>
                            <p className="size">{this.size(disk)}</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Disks