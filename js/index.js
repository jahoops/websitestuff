var body = document.getElementsByTagName("BODY")[0];

function scrollSlide(id) {
  document.querySelector('.active').classList.remove('active');
  var targetDiv = document.querySelector(id);
  targetDiv.classList.add('active');
  var y = targetDiv.getBoundingClientRect().top + window.scrollY;
  window.scroll({
    top: y,
    behavior: 'smooth'
  });
  return false;
}

function moveTo(element,targetPos,tickStart,tickEnd,lastTick) {
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
    requestAnimationFrame( function(){ moveTo(element,targetPos,tickStart,tickEnd,lastTick); } );
  } else {
    element.style.top = targetPos.top + 'px';
    element.style.left = targetPos.left + 'px';
    element.style.border = 'none';
  }
  rendering = false;
}

// Get the last <li> element ("Milk") of <ul> with id="myList2"
var itm = document.getElementsByClassName('ryu');

// Copy the <li> element and its child nodes
var cln = itm[0].cloneNode(true);

// Append the cloned <li> element to <ul> with id="myList1"
document.getElementById("slide2").appendChild(cln);

var d = new Date();
var ticks = d.getTime();
moveTo(cln,{top: 150, left:999},ticks,ticks+1000);