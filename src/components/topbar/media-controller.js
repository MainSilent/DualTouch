const edge = window.require('electron-edge-js')

const dllPath = './modules/tools/taskbar/Taskbar.dll'

const controller = edge.func({
    assemblyFile: dllPath,
    typeName: 'Taskbar.Media',
    methodName: 'control'
})

import React from 'react';
import anime from 'animejs';
import $ from 'jquery';

class MediaController extends React.Component {
    constructor() {
        super();
        this.state = {
            draggable: false
        }
    }
    componentDidMount() {
        var className = ".media-controller";
        var element = document.getElementsByClassName("media-controller")[0];
        var currentPosX = 0;
        var currentPosY = 0;
        var position = 0;
        var draggable = false;
        var offset = 15;
        var dur = 500;
        var blockAnime;
        
        element.addEventListener("touchstart", startTouch);
        element.addEventListener("touchmove", moveTouch);
         
        // Swipe Up / Down / Left / Right
        var initialX = null;
        var initialY = null;

        function startTouch(e) {
            currentPosX = e.touches[0].clientX;
            currentPosY = e.touches[0].clientY;
            draggable = true;
            blockAnime.pause();
          
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
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
                controller("previous");
              } else if (position >= offset && draggable) {
                // swiped right
                center();
                controller("next");
              }  
            } 
            // for ------------------ Y ------------------------ //
            else {
              if(draggable) {
                  position = currentY - currentPosY;
                $(className).css('transform', 'translateY(' + position / 2 + 'px)'); 
                }	
          
              // sliding vertically
              if (diffY > 0 && position <= (offset * -1) && draggable) {
                // swiped up
                center();
                controller("volume_up");
              } else if (position >= offset && draggable) {
                // swiped down
                center();
                controller("volume_down");
              }  
            }
        }

        element.addEventListener("touchend", function(e) {
            draggable && center();
        })

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

        // play pause event
        var setint;
        var val = 0;
        $(className).on('touchstart',function (e) {
            clearInterval(setint);
            val = 0;
            setint = setInterval(function () {
                if(++val >= 1) {
                    controller('play_pause');
                    clearInterval(setint);
                }
            }, 500);
        }).on("touchend touchcancel", function () {
            val = 0;
            clearInterval(setint);
        });
    }
    render() {
        return (
            <div className="media-controller">
                <i className="fal fa-chevron-up top"></i>
                <i className="fal fa-chevron-down bottom"></i>
                <i className="fal fa-chevron-right right"></i>
                <i className="fal fa-chevron-left left"></i>
                <div className="center">
                    <i className="fas fa-play"></i>
                    <i className="fas fa-pause"></i>
                </div>
            </div>
        )
    }
}

export default MediaController