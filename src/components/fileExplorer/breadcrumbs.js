import React from 'react';
const regedit = window.require('regedit');

class BreadCrumbs extends React.Component {
    constructor() {
        super()
        this.toggleBookmark = this.toggleBookmark.bind(this)
    }
    breadcrumbs(index) {
        const pathArray = this.props.current.split("\\").slice(0, index + 1)
        const path = pathArray.join("\\")
        this.props.add(path)
    }
    toggleBookmark() {
        let value
        if (!this.props.bookmarks.includes(this.props.current)) {
            const bookmark = [...this.props.bookmarks, this.props.current]
            value = {
                'HKCU\\Software\\DualTouch': {
                    'bookmarks': {
                        value: bookmark,
                        type: 'REG_MULTI_SZ'
                    }
                }
            }
            this.props.refresh(bookmark)
        } else {
            const index = this.props.bookmarks.indexOf(this.props.current)
            this.props.bookmarks.splice(index, 1)
            value = {
                'HKCU\\Software\\DualTouch': {
                    'bookmarks': {
                        value: !this.props.bookmarks.length ? [0] : this.props.bookmarks,
                        type: 'REG_MULTI_SZ' 
                    }
                }
            }
            this.props.refresh(this.props.bookmarks)
        }
        regedit.putValue(value, err => err && console.log(err))
    }
    render() {
        const mark = this.props.bookmarks.includes(this.props.current) ? "fa" : "fal"
        return (
            <div className="breadcrumbs">
                {!this.props.current ? <span>This PC</span> :
                    this.props.current.split("\\").map((path, i, arr) =>
                        <span key={i} onClick={() => this.breadcrumbs(i)}>
                            {path} {arr.length != i + 1 && "\\"}
                        </span>
                    )}

                {this.props.current &&
                    <span onClick={this.toggleBookmark}>
                        <i className={`${mark} fa-bookmark`}></i>
                    </span>
                }
            </div>
        )
    }
}

export default BreadCrumbs