/*
 * 实现div可拖拽
 * @params drag 可以点击拖动的元素
 * @params wrap 拖动的整体元素 必须是脱离标准流;
 * 思想：鼠标的clienX/clientY相对值设置为父元素的left/top的相对值
 */


function dragFun(drag, wrap) {
    function getCss(ele, prop) {
      return parseInt(window.getComputedStyle(ele)[prop]);
    }
    
    window.dbbMousemoveFunc = function (e) {
      if (dragable === true) {
        let nowX = e.clientX,
          nowY = e.clientY,
          disX = nowX - initX,
          disY = nowY - initY;
        wrap.style.left = wrapLeft + disX + "px";
        wrap.style.top = wrapRight + disY + "px";
      }
    }
    window.document.addEventListener("mousemove", window.dbbMousemoveFunc);
  
    let initX,
      initY,
      dragable = false,
      wrapLeft = getCss(wrap, "left"),
      wrapRight = getCss(wrap, "top");
  
    drag.addEventListener(
      "mousedown",
      function (e) {
        dragable = true;
        initX = e.clientX;
        initY = e.clientY;
      },
      false
    );
  
    drag.addEventListener(
      "mouseup",
      function (e) {
        dragable = false;
        wrapLeft = getCss(wrap, "left");
        wrapRight = getCss(wrap, "top");
      },
      false
    );
  }
  
  export default dragFun;
  