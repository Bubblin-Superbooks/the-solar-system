window.onload = doALoadOfStuff;
window.onresize = doALoadOfStuff;

function doALoadOfStuff() {
    var shader = document.getElementById('shadertoy');
    var width = Math.max(shader.clientWidth || 300);
    
    var height = width * 9 / 16;
    shader.setAttribute("height", height + 'px');
}