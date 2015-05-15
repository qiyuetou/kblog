//TODO: user name auto file

(function() {
    //for the verification
    //comment-box
    $('.comment,.comment-list').on('focus', 'input,textarea', function() {
        var form = $(this).parents('form');
        if (form.attr('verification') == 'true') {
            return false;
        }
        form.attr('verification', 'true');
        $('.verification-image').remove();
        form.append('<img class="verification-image" src="/verification/img?v=' + Math.random() + '">');
    });

    $('.comment,.comment-list').on('click', '.verification-image', function() {
        $(this).attr('src', '/verification/img?v=' + Math.random());
    });

    //remember username and pwd
    $('.comment,.comment-list').on('keyup', 'input', function() {
        var name = $(this).attr('name');
        var val = $(this).val();
        if (name == 'vcode') {
            return false;
        }

        $.cookie('article-' + name, val, {
            expires: 365
        });

    });

    function formAutofild(tar) {
        tar.find('input[name="name"]').val($.cookie('article-name'));
        tar.find('input[name="email"]').val($.cookie('article-email'));
        tar.find('input[name="blog"]').val($.cookie('article-blog'));
    }

    //for replay
    var form = $('.comment form');
    var replayBox = form.clone();

    //init user info
    formAutofild(form);
    formAutofild(replayBox);

    replayBox.find('button').html('Replay');
    replayBox.append('<input type="hidden" name="replayid">');
    replayBox.css({
        'padding': '5px',
        'background': '#2F3238',
        'margin-top': '10px'
    });
    $('.comment-list').on('click', '.comment-info-replay a', function() {
        var parent = $(this).parents('.comment-block');
        var cid = $(this).attr('cid');
        parent.append(replayBox);
        var usename = parent.find('.comment-info-name').text();
        replayBox.find('textarea').html('@' + usename + ' ');
        replayBox.find('input[name="replayid"]').val(cid);
        return false;
    });

    //scroll'
    // alert(1)
    var articleGuid = parseInt($.cookie('article-guid') || 0);

    if (articleGuid <= 2) {
        setTimeout(function() {
            $('.article-guid').fadeIn()
        }, 1000);
        $('.article').on('scroll', function() {
            var top = $(this).scrollTop();
            if (top >= 500) {
                $('.article').unbind('scroll');
                $.cookie('article-guid', ++articleGuid, {
                    expires: 365
                });
            }
        });
    }

    $('.article-guid').on('click', function() {
        $.cookie('article-guid', ++articleGuid, {
            expires: 365
        });
        $('.article').animate({
            scrollTop: document.body.clientHeight
        });
    })

})()
