var ui = {}

$('input[name="maptype"]').on('click', function() {
    var self = this;

    earth.remove(earthPlan);
    if ($(this).val() == '0') {
        earthPlan = dottedMap();
    }

    if ($(this).val() == '1') {
        earthPlan = planeMap();
    }

    earth.add(earthPlan);
    console.log($(this).val())

})


function getNmae() {

    var name = '';
    for (var i = 0; i < 3 + Math.random() * 8 | 0; i++) {
        var Str = 10 + Math.random() * 10 | 0;
        Str = Str.toString(36);
        if (i == 0) {
            Str = Str.toUpperCase();
        }
        name += Str;
    }
    name += ' ';
    for (var i = 0; i < 3 + Math.random() * 2 | 0; i++) {
        var Str = 10 + Math.random() * 10 | 0;
        Str = Str.toString(36);
        if (i == 0) {
            Str = Str.toUpperCase();
        }
        name += Str;
    }
    return name;
}

getNmae();

ui.tips = function(lat, log) {
    var str = '<p><span style="display:inline-block; width:130px; color:#a6e807;"> ' + getNmae() + '</span> '
    str += 'from <span style="color:#65d9f0; display:inline-block; width:94px; text-align:center;">[' + lat.toString() + ']</span> to <span style="color:#65d9f0;display:inline-block; width:94px; text-align:center;">[' + log.toString() + ']</span></p>';

    $('.infoPan').append(str);
    if ($('.infoPan p').length > 10) {
        $('.infoPan p').eq(0).remove();
    }

    // console.log(lat, log);
}
