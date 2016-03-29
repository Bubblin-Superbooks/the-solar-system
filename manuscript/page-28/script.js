window.onload = doALoadOfStuff;
window.onresize = doALoadOfStuff;

function doALoadOfStuff() {
    var shader = document.getElementById('shadertoy');
    var width = shader.clientWidth;
    var height = width * 9 / 16;
    height = window.innerHeight;
    shader.setAttribute("height", height + 'px');
}