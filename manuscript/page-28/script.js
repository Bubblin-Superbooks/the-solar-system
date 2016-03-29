window.onload = doALoadOfStuff;
window.onresize = doALoadOfStuff;

function doALoadOfStuff() {
    var shader = document.getElementById('shadertoy');
    height = window.innerHeight;
    shader.setAttribute("height", height + 'px');
}