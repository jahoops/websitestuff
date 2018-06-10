  var now = new Date();
  var begintick = now.getTime(); // not using right now, but gets ticks (milliseconds) from Jan 1, 1970

  var rendering = false; // window resize event waits until this is false to request a render
  var firetransitions = false; // transitions only work on a change, like width, so we need to call render twice
  function render() {
    firetransitions = rendering; // if the rendering flag is true coming in, fire transitions
    rendering = true; // set rendering flag so that the resize event does not keep calling this function
    var element_ids = ['header', 'leftColumn', 'rightColumn', 'footer']; // names of my index.html divs
    // if this is the first pass
    if (!firetransitions) {
      for (var e = 0; e < element_ids.length; e++) {
        var container_div = document.getElementById(element_ids[e]);
        container_div.innerHTML = ""; // clear contents
        var height = container_div.offsetHeight;
        var width = container_div.offsetWidth;
        // create twelve divs and put them inside this content div
        for (var i = 0; i < 12; i++) {
          var div_to_insert = document.createElement('div');
          div_to_insert.style.transition = 'width 0.3s ease'; // width transition
          div_to_insert.style.height = height + 'px';
          div_to_insert.style.width = '1px'; // set to 1 for now, next pass will resize and set off transition
          div_to_insert.style.position = 'absolute';
          div_to_insert.style.left = (i * width / 12) + 'px';
          div_to_insert.style.backgroundColor = randomColor(); // see randomColor function at bottom
          div_to_insert.style.border = 'solid thin lightgray';
          container_div.appendChild(div_to_insert);
        }
      } 
      // NOW, call a second pass, because that will allow our new elements to render on the page
      // requestAnimationFrame waits for the browser to finish rendering between frames
      requestAnimationFrame(render);
    } else {
      // THIS is the second pass, to fire transitions
      for (var e = 0; e < element_ids.length; e++) {
        var container_div = document.getElementById(element_ids[e]);
        var width = container_div.offsetWidth;
        var get_divs = document.querySelectorAll('#' + element_ids[e] + ' div'); // get all the divs inside this element
        for (var i = 0; i < get_divs.length; i++) {
          get_divs[i].style.width = width / 12 + 'px'; // now we change the width, and the transition will fire
        }
      }
      rendering = false;
    } 
  }

  // initial render
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