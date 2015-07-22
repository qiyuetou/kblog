//TODO: user name auto file

(function() {
    //for the verification
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

	// for submit
	$('.comment,.comment-list').on('submit','form',function(){
		var val = $(this).serialize();
		var url = $(this).attr('action');
		$.ajax({
			url : url,
			method: 'post',
			data: val,
			success: function(data){
				console.log(data);
                if(data.code == 200){
                    var html = [
                        '<div class="comment-block">',
                            '<div class="comment-block-imgbg">',
                                '<img src="' + data.message.avatar + '" onerror="this.src=\'/img/avatar/nobody.jpg\'" class="comment-block-avatar">',
                            '</div>',
                            '<div class="comment-info">',
                                '<div class="comment-info-head">',
                                    '您',
                                    '<span>刚刚</span>',
                                        '<span class="comment-info-replay">',
                                        '<a href="#" cid="' + data.message._id + '">m回复</a>',
                                    '</span>',
                                    '<div class="comment-text">' + data.message.content + '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join('');
                    $('input[name=vcode]').val('');
                    $('.verification-image').remove();
                    $('form').attr('verification',false);
                    $('.comment-block form').remove();
                    $('textarea[name="content"]').val('')
                    $('.comment-list').prepend(html);
                    alert('留言成功')
                    //
                }
			}
		})
		return false;
	})

})()
