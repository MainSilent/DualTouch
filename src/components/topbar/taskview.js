const edge = window.require('electron-edge-js')

const dllPath = './modules/tools/taskbar/Taskbar.dll'

const count = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'count'
})

const create = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'create'
})

const current = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'current'
})

const left = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'left'
})

const right = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'right'
})

const moveCurrent = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'moveCurrent'
})

const remove = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'remove'
})

const toggle = edge.func({
    assemblyFile: dllPath,
    typeName: 'TaskView.Main',
    methodName: 'toggle'
})

import React from 'react';
import DragRemove from './drag-close';
import anime from 'animejs';
import $ from 'jquery';
const { ipcRenderer } = window.require("electron");

class TaskView extends React.Component {
    constructor() {
        super()
        this.state = {
            edit: false,
            count: 0,
            current: 0
        }
    }
    range(start, stop, step) {
        if (typeof stop == 'undefined') {
            // one param defined
            stop = start;
            start = 0;
        }
    
        if (typeof step == 'undefined') {
            step = 1;
        }
    
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
    
        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
    
        return result;
    }
    componentDidMount() {
        var className = ".taskview";
        var element = document.getElementsByClassName("taskview")[0];
        var position = 0;
        var draggable = false;
        var offset = 15;
        var dur = 500;
        var blockAnime;
        var toggle_mode = true;
        var initialX = null;
        var initialY = null;
        var currentPosX = 0;
        var currentPosY = 0;

        element.addEventListener("touchstart", startTouch);
        element.addEventListener("touchmove", moveTouch);

        function startTouch(e) {
            currentPosX = e.touches[0].clientX;
            currentPosY = e.touches[0].clientY;
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
            //if(!this.state.edit) 
                draggable = true;
            blockAnime.pause();
        }

        function moveTouch(e) {
            if (initialX === null) {
              return;
            }
           
            if (initialY === null) {
              return;
            }
           
            var currentX = e.touches[0].clientX;
            var currentY = e.touches[0].clientY;
           
            var diffX = initialX - currentX;
            var diffY = initialY - currentY;
           
            // for ------------------ X ------------------------ //
            if (Math.abs(diffX) > Math.abs(diffY)) {
              if(draggable) {
                    position = currentX - currentPosX;
                    $(className).css('transform', 'translateX(' + position / 2 + 'px)'); 
                }		
          
              // sliding horizontally
              if (diffX > 0 && position <= (offset * -1) && draggable) {
                // swiped left
                center();
                left();
                ipcRenderer.on('window_handle:reply', (event, hWnd) => {
                    moveCurrent(hWnd);
                })
                ipcRenderer.send('window_handle');
              } else if (position >= offset && draggable) {
                // swiped right
                center();
                right();
                ipcRenderer.on('window_handle:reply', (event, hWnd) => {
                    moveCurrent(hWnd);
                })
                ipcRenderer.send('window_handle');
              }  
            } 
            // for ------------------ Y ------------------------ //
            else {
                if(draggable) {
                    position = currentY - currentPosY;
                    $(className).css('transform', 'translateY(' + position / 2 + 'px)'); 
                }	
          
                // sliding vertically
                if (position < 0 && draggable) {
                    draggable = false;
                    center()
                } 
                else if (position >= offset && draggable) {
                    // swiped down
                    center();
                    if(toggle_mode) {
                        toggle(true);
                        toggle_mode = false;
                    } else {
                        toggle(false);
                        toggle_mode = true;
                    }
                }  
            }
        }

        element.addEventListener("touchend", function(e) {
            draggable && center();
        });

        function center() {
            draggable = false;
            blockAnime = anime({
                targets: className,
                duration: dur,
                translateX: 0,
                translateY: 0
            })
        }
        center()

        setInterval(() => {
            count(null, (err, data) => {
                err && console.log(err)
                this.setState({ count: data })
            })
            current(null, (err, data) => {
                err && console.log(err)
                this.setState({ current: data + 1 })
            })
        }, 500);

        // Hold to chage edit
        var setint  = '';
        var val = 0;
        $(className).on('touchstart', () => {
            if(this.state.edit) {
                this.setState({ edit: false },
                    () => $(".media-controller").show())
            } else {
                setint = setInterval(() => {
                    if(++val >= 1) {
                        this.setState({edit: true }, () => {
                            $(".media-controller").hide()
                            clearInterval(setint);
                        })
                    }
                }, 500);
            }
        }).on("touchend touchcancel", () => {
            val = 0;
            clearInterval(setint);
        });
    }
    render() {
        return (
            <>
            {this.state.edit && 
                <div className="taskview" onClick={() => create()}>
                    <i className="far fa-plus"></i>
                </div>
            }
            {this.state.edit && this.range(this.state.count).reverse().map(index => 
                <DragRemove key={index} index={index} mode="taskview" remove={remove}>
                    <div className="taskview taskview-sub" id={"desktop-"+index}>
                        <p>{index + 1}</p>
                    </div>
                </DragRemove>
            )}

            <div className="taskview">
                <p>{this.state.edit ? <i className="fal fa-times"></i> : this.state.current}</p>
            </div>
            </>
        )
    }
}

export default TaskView