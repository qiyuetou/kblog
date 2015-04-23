define(function(require, exports, module) {
    //
    'use strict';
    var head = document.querySelector('.msg_reptext_head');
    var box = document.querySelector('.msg_reptext');
    head.onclick = function() {
        box.style.bottom="0px";
    };
    
    var area=document.querySelector('.msg_blcok');
    area.onclick=function(e){
        if(e.target.innerHTML=="回复"){
             box.style.bottom="0px";
        }
    };
})