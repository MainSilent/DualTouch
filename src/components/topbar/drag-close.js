import React from 'react';
import anime from 'animejs';
import $ from 'jquery';

class DragClose extends React.Component {
    componentDidMount() {
        const props = this.props;
        const offset = 15;
        const dur = 500;
        var currentPosY = 0;
        var position = 0;
        var draggable = false;
        var blockAnime;
        var initialY = null;
        
        function startTouch(e) {
            currentPosY = e.touches[0].clientY;
            initialY = e.touches[0].clientY;
            draggable = true;
            blockAnime.pause();
        }

        // taskview ----------------------------------
        if (this.props.mode === "taskview") {
            var id = "#desktop-"+props.index;
            var element = document.getElementById("desktop-"+props.index);

            element.addEventListener("touchstart", startTouch);
            element.addEventListener("touchmove", moveTouch);
            
            function moveTouch(e) {
                if (initialY === null) {
                    return;
                }
                var currentY = e.touches[0].clientY;
                var diffY = initialY - currentY;
 
                if(draggable) {
                    position = currentY - currentPosY;
                    $(id).css('transform', 'translateY(' + position / 2 + 'px)'); 
                }	

                if (position >= offset && draggable) {
                    // swiped down
                    props.remove(props.index);
                    center()
                } else if (diffY > 0 && draggable) {
                    // swiped up
                    draggable = false;
                    center()
                }  
            }
        }
        // program --------------------------------
        else {
            /* ---------------------- Event for dragClose ----------------- */
            // We can't use 'this' in mouse events
            // after 2 days i realized that we could use arrow functions 😐
            var id = "#program-"+props.program.handle;
            var element = document.getElementById("program-"+props.program.handle);

            element.addEventListener("touchstart", startTouch);
            element.addEventListener("touchmove", moveTouch);

            function moveTouch(e) {
                if (initialY === null) {
                    return;
                }
                var currentY = e.touches[0].clientY;
                var diffY = initialY - currentY;
                
                if(draggable) {
                    position = currentY - currentPosY;
                    $(id).css('transform', 'translateY(' + position / 2 + 'px)'); 
                }	
                // there is a bug and i don't really know how to fix it 😥
                if (diffY > 0 && position <= (offset * -1) && draggable) {
                    // swiped up
                    $(id).addClass('alert')
                    center()
                    props.kill(props.program);
                } else if (position >= offset && draggable) {
                    // swiped down
                    $(id).addClass('alert')
                    center()
                    props.close(props.program);
                }  
            }

            /* ---------------------- Event for show the title ----------------- */
            var setint  = '';
            var val = 0;
            $(id).on('touchstart',function (e) {
                clearInterval(setint);
                val = 0;
                setint = setInterval(function () {
                    if(++val >= 1) {
                        document.getElementsByClassName("title")[props.index].style.display = "block";
                        props.chToggle(false)
                    }
                }, 500);
            }).on("touchend touchcancel", function () {
                if(val < 1) 
                    props.chToggle(true)
                val = 0;
                document.getElementsByClassName("title")[props.index].style.display = "none";
                clearInterval(setint);
            });
        }

        element.addEventListener("touchend", function(e) {
            draggable && center();
        });

        function center() {
            draggable = false;
            blockAnime = anime({
                targets: id,
                duration: dur,
                translateY: 0,
            })
        }
        center()
    }
    render() {
        return this.props.children
    }
}

export default DragClose