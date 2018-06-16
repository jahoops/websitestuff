  var divqueue = [];
  var body = document.getElementsByTagName("BODY")[0];
  var rendering = false;
  
  function init() {
    rendering = true;
    removeElementsByClass('can-move');
    var element_ids = ['header', 'leftColumn', 'rightColumn', 'footer']; // names of my index.html divs
    // if this is the first pass
    for (var e = 0; e < element_ids.length; e++) {
      var container_div = document.getElementById(element_ids[e]);
      var pos = getPosition(container_div);
      var height = container_div.offsetHeight;
      var width = container_div.offsetWidth;
      // create twelve divs and position them using this container div
      for (var i = 0; i < 12; i++) {
        var div_to_insert = document.createElement('div');
        div_to_insert.classList.add('can-move');
        div_to_insert.style.height = height + 'px';
        div_to_insert.style.width = (width / 12) + 'px';
        div_to_insert.style.position = 'absolute';
        div_to_insert.style.top = pos.y + 'px';
        div_to_insert.style.left = pos.x + (i * width / 12) + 'px';
        div_to_insert.style.backgroundColor = randomColor(); // see randomColor function at bottom
        // append to body so we are not stuck in another div and can move anywhere
        body.appendChild(div_to_insert);
      }
    } 
    bindEvents();
    rendering = false;
  }

  function moveTo(element,targetPos,tickStart,tickEnd,callback,lastTick) {
    rendering = true;
    var d = new Date();
    var ticks = d.getTime();
    var top = parseInt(element.style.top, 10) || 0; // parses to int or is set to zero
    var left = parseInt(element.style.left, 10) || 0;
    var toprate = (targetPos.top-top)/(tickEnd-ticks);
    var leftrate = (targetPos.left-left)/(tickEnd-ticks);
    if(!lastTick) {
        lastTick = ticks;
    }
    var elapsed = ticks - lastTick;
    if (tickEnd > lastTick) {
      if(elapsed) {
        element.style.top = top + (toprate * elapsed) + 'px';
        element.style.left = left + (leftrate * elapsed) + 'px';
      }
      lastTick = ticks;
      // requestAnimationFrame only accepts functions, pass info along in a function
      requestAnimationFrame( function(){ moveTo(element,state,tickStart,tickEnd,lastTick); } );
    } else {
      element.style.top = targetPos.top + 'px';
      element.style.left = targetPos.left + 'px';
      callback(element);
    }
    rendering = false;
  }


  // initial render
  requestAnimationFrame(init);

  function bindEvents() {
    // get array of can-move elements
    var canMoveArray = document.getElementsByClassName("can-move");

    var onCanMoveClick = function() {
      this.style.border = '2px dotted darkgreen';
      divqueue.push(this);
      if(divqueue.length>1) {    
        var d = new Date();
        var ticks = d.getTime();    
        var el1 = divqueue.pop();
        var el2 = divqueue.pop();
        // requestAnimationFrame only accepts functions, so we have to pass info in a function
        requestAnimationFrame(function(){
          var top2 = parseInt(el2.style.top, 10) || 0;
          var left2 = parseInt(el2.style.left, 10) || 0;
          top1 = parseInt(el1.style.top, 10) || 0;
          left1 = parseInt(el1.style.left, 10) || 0;
          moveTo(el1, { top: top2, left: left2 }, ticks, ticks+1000, function(element){ element.style.border = 'none'; });
          moveTo(el2, { top: top1, left: left1 }, ticks, ticks+1000, function(element){ element.style.border = 'none'; });
        });
      }
    };
    // binding all class='can-move' to the 
    for (var i = 0; i < canMoveArray.length; i++) {
      canMoveArray[i].addEventListener('click', onCanMoveClick, false);
    }
  }

  // re-initialize on resize
  window.addEventListener('resize', function () {
    if (!rendering) requestAnimationFrame(init);
  });


  //**** HELPER FUNCTIONS

  function randomColor() {
    // by using h,s,v we can get only bright colors
    // the (h) hue is random, but the (s) saturation is max, and the (v) brightness is max
    var h = Math.random();
    var s = 0.99;
    var v = 0.99;
    // the "golden ratio" allegedly gives better colors
    h = h + 0.618033988749895;
    h = h % 1;

    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
    }

    return "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + "," + 0.2 + ")";
  }

// full explantion here: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
  function getPosition(el) {
    var xPos = 0;
    var yPos = 0;
   
    while (el) {
      if (el.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = el.scrollTop || document.documentElement.scrollTop;
   
        xPos += (el.offsetLeft - xScroll + el.clientLeft);
        yPos += (el.offsetTop - yScroll + el.clientTop);
      } else {
        // for all other non-BODY elements
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }
   
      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  }

  function removeElementsByClass(className){
      var elements = document.getElementsByClassName(className);
      while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
      }
  }