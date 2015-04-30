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


    //next button
    var nextBtn = setTimeout(function() {
        $('.index_next').fadeIn();
    }, 2000)
    $('.index_next').on('click', function() {
        moveto(1);
    })

    function moveto(index, callback) {
        clearTimeout(nextBtn);
        $('.index_next').hide();

        var height = document.body.clientHeight * index;
        // console.log(height)
        $('body,html').animate({
            'scrollTop': height
        }, 480, function() {
            callback && callback();
            moveHandle = true;
        });
    }

    //autoscroll
    var tag = location.hash.replace('#', '');
    if (tag) {
        var index = $('div[tag=' + tag + ']').attr('index');
        moveto(index);
    }

    var sending = false;
    $('.sendemail').on('click', function() {
        if (sending) {
            return false;
        }
        sending = true;
        var self = $(this);
        self.html('sending...');
        var data = {};
        data.username = $('input[name="username"]').val();
        data.email = $('input[name="email"]').val();
        data.content = $('textarea[name="content"]').val();
        data.vcode = $('input[name="vcode"]').val();
        $.ajax({
            'url': '/api/sendemail',
            'method': 'post',
            'data': data,
            'success': function(data) {
                if (data.meta.code == 200) {
                    $('input[name="username"]').val('');
                    $('input[name="email"]').val('');
                    $('textarea[name="content"]').val('');
                    alert('您的留言已经收到，如有必要，我会第一时间回复，谢谢')
                } else {
                    alert('啊哦，发送失败');
                }
                $('.vcode').attr('src', '/verification/img?v=' + Math.random());
                $('input[name="vcode"]').val('');
                self.html('Send to me');
                sending = false;
            }
        })
    })
});
