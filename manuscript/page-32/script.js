window.onload = doALoadOfStuff;
window.onresize = doALoadOfStuff;

function doALoadOfStuff() {
    var shader = document.getElementById('shadertoy');
    var width = shader.clientWidth;
    var height = width * 9 / 16;
    shader.setAttribute("height", height + 'px');
}