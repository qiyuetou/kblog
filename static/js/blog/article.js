// (function() {
//     var commentArea = $('.blogCommentBox');
//     var commentPlug = $('.bCPost').clone();
//     commentPlug.append('<input type="hidden" name="replayid">');

//     commentArea.on('focus', '.bCVcodeI', function() {
//         var img = $(this).parents('.bCPost').find('.bCPostImg');
//         if (img.length > 0) {
//             img.attr('src', '/verification/img?v=' + Math.random())
//         } else {
//             $(this).after('<img src="/verification/img" class="bCPostImg">');
//         }
//     });

//     commentArea.on('click', '.bCPostImg', function() {
//         $(this).attr('src', '/verification/img?v=' + Math.random())
//     });

//     commentArea.on('mouseenter', '.bCBlock', function() {
//         $(this).find('.bCREP').show();
//     });

//     commentArea.on('mouseleave', '.bCBlock', function() {
//         $(this).find('.bCREP').hide();
//     });

//     commentArea.on('click', '.bCREP', function() {
//         var thisBlock = $(this).parents('.bCBlock');
//         //base info
//         var usename = thisBlock.find('.bCName').text();
//         var cid = $(this).attr('cid');

//         thisBlock.append(commentPlug);
//         thisBlock.find('.bCVcodeI').val('');
//         //title
//         commentPlug.find('.bCPostTitle').html('回复 @' + usename);
//         //host email,nick,comment
//         commentPlug.find('input[name="replayid"]').val(cid);
//         commentPlug.find('input[name="email"]').focus();
//         return false
//     });
// })();

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
