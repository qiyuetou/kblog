$(function() {
    'use strict';
    var subTitleDom = $('.index_subtitle');
    var subTitle = subTitleDom.text().split('|');

    var animateCount = 0;

    function showTitles() {
        subTitleDom.html(subTitle[animateCount]);
        var domAni = subTitleDom.animate({
            'opacity': 1
        }, 1000);
        if (animateCount < subTitle.length - 1) {
            domAni.delay(1000);
            domAni.animate({
                'opacity': 0
            }, 1000, function() {
                animateCount++;
                showTitles();
            });
        }
    }
    showTitles();




    //height
    $('.index_block').css({
        'height': document.body.clientHeight
    });

    var body = document.body;
    var moveHandle = true;
    if (body.addEventListener) {
        // IE9, Chrome, Safari, Opera
        body.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        body.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    } else {
        body.attachEvent("onmousewheel", MouseWheelHandler);
    }

    var index = 0;
    var inprogress = false;

    var blockLen = $('.index_block').length;
    var perHeight = document.body.scrollHeight / blockLen;
    index = Math.round($('body').scrollTop() / perHeight);

    function MouseWheelHandler(e) {
        moveHandle = false;
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //1 up -1 down
        e.preventDefault(e);
        if (!inprogress) {
            inprogress = true;
            if (delta == -1) {
                index++;
            } else {
                index--;
            }

            if (index < 0) {
                index = 1;
                inprogress = false;
            } else if (index > $('.index_block').length - 1) {
                index = $('.index_block').length - 2;
                inprogress = false;
            } else {
                moveto(index, function() {
                    setTimeout(function() {
                        inprogress = false;
                    }, 1000);
                })
            }
        }

        return false;
    }

    function moveto(index, callback) {
        var height = document.body.clientHeight * index;
        // console.log(height)
        $('body,html').animate({
            'scrollTop': height
        }, 480, function() {
            callback && callback();
            moveHandle = true;
        });
    }

});
