var tl = {};
(function (){
    sys();
    tl.rand = rand;
    tl.writeCss = writeCss;
    function sys() {
        var strTemp = navigator.userAgent;
        var result = {};
        var nameArr = [ "iPhone", "iPad", "iPod", "iPadmini", "MSIE", "Firefox", "Opera", "Safari", "Chrome" ];
        for (var i = 0; i < nameArr.length; i++) {
            var b = strTemp.indexOf(nameArr[i]);
            if (b != -1) {
                nameArr = nameArr[i];
                break;
            }
        }
        switch (nameArr) {
            case "MSIE":
                IE();
                break;

            case "Firefox":
                Firefox();
                break;

            case "Safari":
                Safari();
                break;

            case "Opera":
                opera();
                break;

            case "iPhone":
                IOS();
                break;

            case "iPad":
                IOS();
                break;

            case "iPod":
                IOS();
                break;

            case "iPadMini":
                IOS();
                break;
        }
        function IE() {
            var c = strTemp.match(/MSIE(.{0,2})/);
            result.ver = "IE" + c[1].slice(1, 2);
            result.name = "IE";
            result.pf = "ms";
        }
        function opera() {
            result = "Opera";
        }
        function Firefox() {
            var c = strTemp.match(/Firefox\/(.*)/);
            result.ver = "Firefox" + c[1];
            result.name = "Firefox";
            result.pf = "moz";
        }
        function Safari() {
            result.name = "Webkit";
            result.pf = "webkit";
        }
        function IOS() {
            result.pla = "mobile";
            result.name = nameArr;
            result.pf = "webkit";
        }
        tl.sys = result;
    }
    function eventTypt(t) {
        var type = t;
        var perfix = tl.sys.pf;
        if (type == "mousewheel") {
            mousewheel();
            return;
        }
        if (tl.sys.pla == "mobile") {
            mobile();
        }
        switch (type) {
            case "animationStart":
                type = perfix + "AnimationStart";
                break;

            case "animationIng":
                type = perfix + "AnimationIteration";
                break;

            case "animationEnd":
                type = perfix + "AnimationEnd";
                break;

            case "transitionEnd":
                type = perfix + "TransitionEnd";
                break;
        }
        function mousewheel() {
            $this.mousewheel(function(e, delta) {
                fn(e, delta);
            });
        }
        function mobile() {
            switch (type) {
                case "click":
                    type = "touchstart";
                    break;

                case "mouseenter":
                    type = "touchstart";
                    break;

                case "mouseleave":
                    type = "";
                    break;

                case "mousedown":
                    type = "touchstart";
                    break;

                case "mouseup":
                    type = "touchend";
                    break;

                case "mousemove":
                    type = "touchmove";
                    break;
            }
        }
        return type;
    }
    $.fn.Bind = function(t, fn) {
        var type = eventTypt(t);
        var $this = $(this);
        $this.unbind(type);
        $this.bind(type, fn);
    };
    $.fn.unBind = function(t, fn) {
        var type = eventTypt(t);
        $(this).unbind(type, fn);
    };
    $.fn.Trigger = function(type) {
        var type = type;
        if (tl.sys.pla == "mobile") {
            type = eventTypt(type);
        }
        $(this).trigger(type);
    };
    $.fn.Live = function(sel,t, fn) {
        var type = eventTypt(t);
        var $this = $(this);
        $this.undelegate(sel,type);
        $this.delegate(sel,type,fn);
    };

    function rand(n1,n2) {
        var _n2 = arguments[1] || 0,
            _rand = Math.random(),
            _exp;
        if (_n2 === 0){
            _exp = _rand * arguments[0];
        }else{
            _exp = _rand * arguments[1] + n1;
        }
        return Math.floor(_exp)
    }
    function writeCss(name, content) {
        var css,
            html = '',
            backUp = '',
            reg;
        if (document.getElementsByTagName('style').length){
            css = document.getElementsByTagName('style')[0]
        }
        else {
            css = document.createElement("style");
            css.type = "text/css";
        }
        html = css.innerHTML;
        if(html.indexOf(name) !== -1){
            reg = new RegExp(name+'{'+'.*'+'}','i');
            backUp = html.match(reg)[0]
            css.innerHTML = html.replace(backUp,"");
        }
        backUp = backUp.match(/{(.*)}/i);
        if (backUp !== null){
            content  = (backUp[1]+';'+content).replace(/;+/i,';');
        }
        if (/@key/.test(name)) {
            name = name.replace("@key", " ");
            content = "@-" + tl.sys.pf + "-keyframes " + name + "{" + content + "}";
        } else {

            content = name + "{" + content + "}";
        }
        var content = document.createTextNode(content);
        css.appendChild(content);
        document.getElementsByTagName("head")[0].appendChild(css);
    }
    $.batchRun = function(times, fn, interval, id) {
        var i = 0;
        var intTime = 0;
        var timeOut = [];
        for (i; i < times; i++) {
            (function(i) {
                if (typeof interval == "number") {
                    intTime = interval * i;
                } else {
                    intTime = intTime + interval[i];
                }
                timeOut[i] = setTimeout(function() {
                    fn(i);
                    timeOut.splice(0, 1);
                }, intTime);
            })(i);
        }
    };
    $.fn.allWidth = function() {
        var $this = $(this);
        var val;
        var marginLeft = exp($this.css("margin-left"));
        var marginRight = exp($this.css("margin-right"));
        var paddingLeft = exp($this.css("padding-left"));
        var paddingRight = exp($this.css("padding-right"));
        /*	var left = exp($this.css("left"));
         var right = exp($this.css("right"));*/
        val = $this.width() + marginLeft + marginRight + paddingLeft + paddingRight;
        function exp(str) {
            return /\d*/g.exec(str)[0] * 1;
        }
        return val;
    };
}())