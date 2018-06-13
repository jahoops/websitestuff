  var divqueue = [];
  var body = document.getElementsByTagName("BODY")[0];
  var rendering = false;
  
  function init() {
    rendering = true;
    var element_ids = ['header', 'leftColumn', 'rightColumn', 'footer']; // names of my index.html divs
    // if this is the first pass
    for (var e = 0; e < element_ids.length; e++) {
      var container_div = document.getElementById(element_ids[e]);
      container_div.innerHTML = ""; // clear contents
      var height = container_div.offsetHeight;
      var width = container_div.offsetWidth;
      // create twelve divs and put them inside this content div
      for (var i = 0; i < 12; i++) {
        var div_to_insert = document.createElement('div');
        div_to_insert.classList.add('can-move');
        div_to_insert.style.transition = 'left 0.5s ease'; // width transition
        div_to_insert.style.transition += ',width 0.3s ease'; // width transition
        div_to_insert.style.height = height + 'px';
        div_to_insert.style.width = (width / 12) + 'px';
        div_to_insert.style.position = 'absolute';
        div_to_insert.style.left = (i * width / 12) + 'px';
        div_to_insert.style.backgroundColor = randomColor(); // see randomColor function at bottom
        //div_to_insert.style.border = 'solid thin lightgray';
        container_div.appendChild(div_to_insert);
      }
    } 
    rendering = false;
  }

  function moveTo(element,arrivePosition,arriveTick,movePerTick) {
    rendering = true;
    var d = new Date();
    var ticks = d.getTime();
    var elapsed = arriveTick - ticks;
    if(!movePerTick) {
      var top = parseInt(gohomeElement.style.top, 10) || 0;
      var left = parseInt(gohomeElement.style.left, 10) || 0;
      movePerTick = { top: (arrivePosition.top - top)/elapsed, left: (arrivePosition.left - left)/elapsed };
      requestAnimationFrame( function(){ moveTo(element,arrivePosition,arriveTick,movePerTick) } );
    }
    if (elapsed > 0) {
      element.style.top += (movePerTick.top * elapsed) + 'px';
      element.style.left += (movePerTick.left * elapsed) + 'px';
      requestAnimationFrame( function(){ moveTo(element,arrivePosition,arriveTick,movePerTick) } );
    } else {
      element.style.top = arrivePosition.top + 'px';
      element.style.left = arrivePosition.left + 'px';
    }
    rendering = false;
  }


  // initial render
  requestAnimationFrame(init);

  var classname = document.getElementsByClassName("can-move");

  var myFunction = function() {
    divqueue.push(this);
    if(divqueue.length>1) {    
      var d = new Date();
      var ticks = d.getTime();    
      var el1 = divqueue.pop();
      var el2 = divqueue.pop();
      requestAnimationFrame(function(){
        moveTo(el1, { top: el2.style.top, left:el2.style.left }, ticks+1000);
        moveTo(el2, { top: el1.style.top, left:el1.style.left }, ticks+1000);
      });
    }
  };
  
  for (var i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click', myFunction, false);
  }

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