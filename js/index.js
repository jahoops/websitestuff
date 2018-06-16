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

function moveTo(element, targetPos, tickStart, tickEnd, callback, lastTick) {
  rendering = true;
  var d = new Date();
  var ticks = d.getTime();
  var top = parseInt(element.style.top, 10) || 0; // parses to int or is set to zero
  var left = parseInt(element.style.left, 10) || 0;
  var toprate = (targetPos.top - top) / (tickEnd - ticks);
  var leftrate = (targetPos.left - left) / (tickEnd - ticks);
  if (!lastTick) {
    lastTick = ticks;
  }
  var elapsed = ticks - lastTick;
  if (tickEnd > lastTick) {
    if (elapsed) {
      element.style.top = top + (toprate * elapsed) + 'px';
      element.style.left = left + (leftrate * elapsed) + 'px';
    }
    lastTick = ticks;
    // requestAnimationFrame only accepts functions, pass info along in a function
    requestAnimationFrame(function () {
      moveTo(element, targetPos, tickStart, tickEnd, callback, lastTick);
    });
  } else {
    element.style.top = targetPos.top + 'px';
    element.style.left = targetPos.left + 'px';
    callback(element);
  }
  rendering = false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var itm = document.getElementsByClassName('ryu');
itm[0].style.display = 'none';

var moveToQueue = [];

function moveToFinished(element){
  moveToQueue.push(element);
}

for (var i = 0; i < 30; i++) {
  var cln = itm[0].cloneNode(true);
  document.getElementById("slide2").appendChild(cln);
  moveToQueue.push(cln);
}

window.setInterval(function(){
  if(moveToQueue.length>0) {
    var el = moveToQueue.shift();
    el.classList.remove('red');
    el.classList.remove('blue');
    var r = getRandomInt(40, 120);
    if(r%5 === 0) el.classList.add('red');
    if(r%40 === 0) el.classList.add('blue');
    el.style.top = r + 'px';
    el.style.left = '-1000px';
    el.style.zIndex = r;
    el.style.zoom = r/100;
    el.style.display = 'block';
    var d = new Date();
    var ticks = d.getTime();
    moveTo(
      el, 
      {
        top: parseInt(el.style.top, 10) || 0,
        left: 4000
      }, 
      ticks, 
      ticks + 3000, 
      moveToFinished
    );
  }
},getRandomInt(100, 300));