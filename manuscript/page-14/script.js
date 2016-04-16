window.onload = doALoadOfStuff;
window.onresize = doALoadOfStuff;

function doALoadOfStuff() {
    var shader = document.getElementById('shadertoy');
    var width = Math.max(shader.clientWidth || 300);
    var height = width * 9 / 16;

    clearTimeout($.data(this, 'timer'));
    $.data(this, 'timer', setTimeout(function() {
      shader.setAttribute("height", height + 'px');

      $('#shadertoy').removeClass('invisible').fadeIn('slow');
    }, 250));

}
