(function() {

    var nav = $('.blog-list-nav');
    if (document.body.clientWidth > 640) {
        fitNav();

        $(window).on('resize', function() {
            nav.append($('.blog-list-nav-more-list li'));
            var more = $('.blog-list-nav-more');
            more.removeClass('active');
            nav.append(more);
            fitNav();
        })
    } else {
        var active = $('.blog-list-nav li.active');
        nav.prepend(active);
        active.find('a').html(active.find('a').html() + '<span style="float:right">&#xe120;</span>').css('font-family', 'blog')
            // $('.blog-list-nav').addClass('mobileHide');
        var isOpen = false;
        active.on('click', function() {
            var height;
            if (isOpen) {
                height = '42px';
            } else {
                height = $('.blog-list-nav li').length * (active.height() + 1);
            }
            $('.blog-list-nav').css({
                'height': height
            });
            isOpen = !isOpen;
            return false;
        })
    }

})();

function fitNav() {
    var navDom = $('.blog-list-nav-box');
    var navBoxHeight = navDom.height();
    var navListDom = navDom.find('.blog-list-nav');
    var navHeight = navListDom.height();
    var navLis = navListDom.find('li');


    if (navHeight > 1.5 * navBoxHeight) {
        var lastIndex = 0;
        var lastRight = 0;
        var navWidth = navDom.width();
        var activeNav;
        var lists = $('<ul></ul>');

        var activeHtml = navListDom.find('.active').html();
        // console.log(activeHtml);
        var more = $('.blog-list-nav-more');
        var moreWidth = more.html('&#xe120;').width() + 40;
        var moreActiveWidth = more.html('&#xe120; ' + activeHtml).width() + 40;

        var activeIndex = false;
        var listFit = true;
        var activeShow = false;

        var depth = moreActiveWidth;
        for (var i = 0; i < navLis.length; i++) {
            var li = navLis.eq(i);
            var pos = li.position();
            var liRight = li.width() + pos.left;
            var canfit = (liRight + depth) < navWidth;

            if (pos.top <= 0 && canfit) {
                lastDmoIndex = i;
                lastRight = liRight;
                if (li.hasClass('active')) {
                    activeIndex = i;
                    depth = moreWidth;
                    activeShow = true;
                }
            } else {
                lists.append(li);
            }
        }

        if (!activeShow) {
            more
                .addClass('active')
                .html('&#xe120; ' + activeHtml)
        } else {
            more.html('&#xe120;');
        }
        var moreList = $('.blog-list-nav-more-list');
        var moreLeft = lastRight + 10;
        more
            .css('left', moreLeft)
            .show();
        moreList
            .css('right', navWidth - moreLeft - more.outerWidth())
            .html(lists);

        //hover
        var timeoutId;
        more.on('mouseenter', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                moreList.show();
            }, 200);
        }).on('mouseleave', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                moreList.hide();
            }, 200);
        });

        moreList.on('mouseenter', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                moreList.show();
            }, 200);
        }).on('mouseleave', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                moreList.hide();
            }, 200);
        });
    }
}
