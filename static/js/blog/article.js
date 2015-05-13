//TODO: scroll read -> remember
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

    //for replay
    var form = $('.comment form');
    var replayBox = form.clone();
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
})()
