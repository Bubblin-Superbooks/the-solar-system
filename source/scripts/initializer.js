$(document).ready(function() {

  var $superbook = $('#superbook');

  // Initialize superbook
  $superbook.turn({
    pageWidth: 1115,
    pageHeight: 1443,
    autoCenter: true,
    responsive: true,
    display: 'single',
    animatedAutoCenter: true,
    smartFlip: true,
    autoScaleContent: true,
    swipe: true,
    iframeSupport: true
    // page: typeof gon != 'undefined' && gon.page_no ? parseInt(gon.page_no) : 1
  });
});