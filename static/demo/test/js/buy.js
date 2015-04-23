define(function(require, exports, module) {
    //
    'use strict';
    //
    var blocks = document.querySelectorAll('.showarea .block');
    var showin = document.querySelectorAll('.showarea_in');
    var blockW = parseInt(getComputedStyle(blocks[0])['margin-right']) + 148;
    console.log(blockW, blocks[0].offsetWidth)
    for (var i = 0, len = showin.length; i < len; i++) {
        showin[i].style.width = showin[i].querySelectorAll('.block').length * blockW + 'px';
    }
    showin[0].style.display = 'block';

    var startX = 0;
    var domX = 0;
    var movedom = '';
    var canmove = false;
    var maxWidth = 0;
    // $('.showarea_in').Bind('mousedown', function(e) {
    // movedom = this;
    // console.log(e)
    // //startX = e.targetTouches[0].pageX;
    // //startX = (e.targetTouches?e.targetTouches[0].pageX:e.pageX);
    // startX = e.x;
    // domX = parseInt(getComputedStyle(this).left);
    // maxWidth = this.offsetWidth - $('.showarea').width();
    // if (this.offsetWidth > $('.showarea').width()) {
    // canmove = true;
    // console.log('true')
    // } else {
    // cosnole.log('false')
    // canmove = false;
    // }
    // });
    //start
    for(var i=0;i<$('.showarea_in').length;i++){
        $('.showarea_in')[i].addEventListener('mousedown', function(e) {
            movedom = this;
            //startX = e.targetTouches[0].pageX;
            startX = e.x;
            domX = parseInt(getComputedStyle(this).left);
            maxWidth = this.offsetWidth - $('.showarea').width();
            if (this.offsetWidth > $('.showarea').width()) {
                canmove = true;
            } else {
                canmove = false;
            }
        });
    }
    for(var i=0;i<$('.showarea_in').length;i++){
        $('.showarea_in')[i].addEventListener('touchstart', function(e) {
            movedom = this;
            startX = e.targetTouches[0].pageX;
            //startX = e.x;
            domX = parseInt(getComputedStyle(this).left);
            maxWidth = this.offsetWidth - $('.showarea').width();
            if (this.offsetWidth > $('.showarea').width()) {
                canmove = true;
            } else {
                canmove = false;
            }
        });
    }

    //move
    alert(2);
    $('body')[0].addEventListener('touchmove', function(event) {
        if (canmove) {
            event.preventDefault()
            var val = domX + event.targetTouches[0].pageX - startX;
            if (val < (-maxWidth)) {
                val = -maxWidth;
            } else if (val > 14) {
                val = 14;
            }
            movedom.style.left = val + 'px';
        }
    });
    // $(window)[0].addEventListener('mousemove', function() {
        // event.preventDefault()
        // if (canmove) {
            // var val = domX + event.x - startX;
            // if (val < (-maxWidth)) {
                // val = -maxWidth;
            // } else if (val > 14) {
                // val = 14;
            // }
            // movedom.style.left = val + 'px';
        // }
    // });

    //end
    // $(window).Bind('mouseup', function() {
    // console.log('up')
    // canmove = false;
    // });
    $(window)[0].addEventListener('touchend', function() {
        canmove = false;
    });
    $(window)[0].addEventListener('mouseup', function() {
        canmove = false;
    });

    var colors = document.querySelectorAll('.showcolors_block');
    for (var i = 0; i < colors.length; i++) {
        (function(i) {
            colors[i].onclick = function() {
                for (var j = 0, lenj = showin.length; j < lenj; j++) {
                    showin[j].style.display = 'none';
                    colors[j].style.borderColor = '#333';
                }
                showin[i].style.display = 'block';
                showin[i].style.left = '14px';
                colors[i].style.borderColor = 'red';
                document.querySelector('.colorname').value = i
            };
        })(i);
    }

    var size = document.querySelectorAll('.showsize span');
    for (var i = 0; i < size.length; i++) {
        (function(i) {
            size[i].onclick = function() {
                for (var j = 0; j < size.length; j++) {
                    size[j].style.borderColor = '#333';
                }
                this.style.borderColor = 'red';
                document.querySelector('.sizenumber').value = this.innerHTML;
            }
        })(i)
    };

    var plus = document.querySelector('.numberplus');
    var min = document.querySelector('.numbermin');
    plus.onclick = function() {
        var val = parseInt(document.querySelector('.numberinput').value || 0) - 1;
        document.querySelector('.numberinput').value = val < 0 ? 0 : val;
    }
    min.onclick = function() {
        document.querySelector('.numberinput').value = parseInt(document.querySelector('.numberinput').value || 0) + 1
    }
    var way = document.querySelectorAll('.showway a');
    for (var i = 0; i < way.length; i++) {
        (function(i) {
            way[i].onclick = function() {
                document.querySelector('.buyinput').value = i;
                for (var j = 0; j < way.length; j++) {
                    way[j].setAttribute('class', '');
                }
                this.setAttribute('class', 'active');
                return false;
            }
        })(i);
    }
});
