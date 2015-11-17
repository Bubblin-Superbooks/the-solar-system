jQuery(document).ready(function() {

  var $superbook = jQuery('#superbook');

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

  if (Turn.isTouchDevice) {
    jQuery('body .ui-arrow-next-page').on('tap', function(e) {
      $superbook.turn('next');
    });
    jQuery('body .ui-arrow-previous-page').on('tap', function(e) {
      $superbook.turn('previous');
    });
  } else {
    jQuery('.ui-arrow-next-page').on('click', function(e) {
      $superbook.turn('next');
    });
    jQuery('.ui-arrow-previous-page').on('click', function(e) {
      $superbook.turn('previous');
    });
  }
  
  // Binding keys: left, right, pageu, pagedown to flipping the book.
  key('left, pageup, up', function(e) {
    e.preventDefault(e);
    $superbook.turn('previous');
  });

  key('right, pagedown, down, space', function(e) {
    e.preventDefault(e);
    $superbook.turn('next');
  });

  // Command + pageup, command + pagedown combinations to beginning or end of book
  key('⌘ + left, ⌘ + pageup, ⌘ + up, ctrl + left, ctrl + pageup, ctrl + up', function(e) {
    e.preventDefault(e);
    $superbook.turn('page', 1);
  });

  key('⌘ + right, ⌘ + pagedown, ⌘ + down, ctrl + right, ctrl + pagedown, ctrl + down', function(e) {
    e.preventDefault(e);
    $superbook.turn('page', $superbook.turn('pages'));
  });
});