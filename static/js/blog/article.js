(function() {
    var commentArea = $('.blogCommentBox');
    var commentPlug = $('.bCPost').clone();
    commentPlug.append('<input type="hidden" name="replayid">');

    commentArea.on('focus', '.bCVcodeI', function() {
        var img = $(this).parents('.bCPost').find('.bCPostImg');
        if (img.length > 0) {
            img.attr('src', '/verification/img?v=' + Math.random())
        } else {
            $(this).after('<img src="/verification/img" class="bCPostImg">');
        }
    });

    commentArea.on('click', '.bCPostImg', function() {
        $(this).attr('src', '/verification/img?v=' + Math.random())
    });

    commentArea.on('mouseenter', '.bCBlock', function() {
        $(this).find('.bCREP').show();
    });

    commentArea.on('mouseleave', '.bCBlock', function() {
        $(this).find('.bCREP').hide();
    });

    commentArea.on('click', '.bCREP', function() {
        var thisBlock = $(this).parents('.bCBlock');
        //base info
        var usename = thisBlock.find('.bCName').text();
        var cid = $(this).attr('cid');

        thisBlock.append(commentPlug);
        thisBlock.find('.bCVcodeI').val('');
        //title
        commentPlug.find('.bCPostTitle').html('回复 @' + usename);
        //host email,nick,comment
        commentPlug.find('input[name="replayid"]').val(cid);
        commentPlug.find('input[name="email"]').focus();
        return false
    });
})();