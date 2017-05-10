// JavaScript Document
(function(doc,win){
    var docEl = doc.documentElement;
    var resizeEvt = "onorientationchange" in win ? "orientationchange" : "resize";
    var Timer = null;
    function recalc(){
        var clientWidth = docEl.clientWidth || win.innerWidth;
        //var initSize = (clientWidth/720) * 100;
        if (!clientWidth) return;
	  		docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
       /* var fontSize = clientWidth > 768 ? 120 : (initSize < 50 ? 50 : initSize);
        docEl.style.fontSize = fontSize + "px";*/
    }
    if (!doc.addEventListener) return;
  	win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContendLoaded",recalc,false);

    //转屏
    win.addEventListener(resizeEvt,function(){
        clearTimeout(Timer);
        Timer = setTimeout(recalc,300)
    },false);

    //pageshow,缓存相关
    win.addEventListener("pageshow",function(e){
        if(e.persisted){
            clearTimeout(Timer);
            Timer = setTimeout(recalc,300)
        }
    },false);

    // 初始化
    recalc();
    /*function fixFontSize() {
      var $html = $('html');
      var remBase = $(window).width() / 10;
      var fontSize = remBase;
      while (true) {
        var actualSize = parseInt( $html.css('font-size') );
        if (actualSize > remBase && fontSize > 10) {
          fontSize--;
          $html.attr('style', 'font-size:' + fontSize + 'px!important');
        } else {
          break;
        }
      }
    };
    fixFontSize();*/
})(document,window);