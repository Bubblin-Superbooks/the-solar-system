window.onload = doALoadOfStuff;
window.onresize = doALoadOfStuff;

function doALoadOfStuff() {
    var shader = document.getElementById('shadertoy');
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 300);
    shader.setAttribute("height", height + 'px');
}