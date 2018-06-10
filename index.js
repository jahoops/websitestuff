  var now = new Date();
  var begintick = now.getTime();
  var rendering = false;

  function render() {
    rendering = true;
    var element_ids = ['header','leftColumn','rightColumn','footer'];
    for(var e=0; e<element_ids.length; e++) {
      var container_div = document.getElementById(element_ids[e]);
      container_div.innerHTML = ""; // clear contents
      var height = container_div.offsetHeight;
      var width = container_div.offsetWidth;
      for (var i = 0; i < 12; i++) {
        var div_to_insert = document.createElement('div');
        div_to_insert.style.height = height + 'px';
        div_to_insert.style.width = width / 12 + 'px';
        div_to_insert.style.position = 'absolute';
        div_to_insert.style.left = (i * width / 12) + 'px';
        div_to_insert.style.backgroundColor = randomColor();
        div_to_insert.style.border = 'solid thin lightgray';
        container_div.appendChild(div_to_insert);
      }
    }
    rendering = false;
  }

  requestAnimationFrame(render);

  // don't fire render if already rendering
  window.addEventListener('resize', function () {
    if (!rendering) requestAnimationFrame(render);
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