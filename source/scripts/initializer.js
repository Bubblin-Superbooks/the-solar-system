function getViewNumber(book, page) {
  return parseInt((page || book.turn('page')) / 2 + 1, 10);
}

var isUserInteracting = false;

function bookSlider($superbook) {
  // Slider module

  var doubleDisplay = $superbook.turn('display') == 'double' ? true : false;
  var pages = $superbook.turn('pages');
  var numberOfViews = doubleDisplay ? (pages / 2 + 1) : (pages);

  $('#page-slider').slider({
    min: 1,
    max: numberOfViews,
    value: (doubleDisplay ? getViewNumber($superbook) : $superbook.turn('page'))
  });

  $('#page-slider').on('changeValue', function(event, newVal) {
    //isUserInteracting = true;
    if (!isUserInteracting) {
      var currentVal = $(this).slider('value');
      var newPage = newVal;
      if (doubleDisplay) {
        var leftPage = newVal * 2 - 2;
        var rightPage = newVal * 2 - 1;
        if (currentVal > newVal) {
          newPage = rightPage;
        } else {
          newPage = leftPage;
        }
      }
      $superbook.unbind('turning', turnAndSlide);
      if ($.inArray(newPage, $('#superbook').turn('view')) != -1) {
        event.preventDefault();
        return;
      }
      if ($('#superbook').turn('page', newPage) === false) {
        event.preventDefault();
      }
      $superbook.bind('turning', turnAndSlide);
    }
    isUserInteracting = false;
  });

  var turnAndSlide = function(event, page, view) {
    isUserInteracting = true;
    var viewNumber = doubleDisplay ? (parseInt((page || $superbook.turn('page')) / 2 + 1, 10)) : page;
    $('#page-slider').slider('value', viewNumber);
  };
  $superbook.bind('turning', turnAndSlide);
}

var pushToStateFlag = true;

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
    iframeSupport: true,
    // page: typeof gon != 'undefined' && gon.page_no ? parseInt(gon.page_no) : 1
  });

  // Prevent drag/scroll physics on iOS Safari with 'touchmove'
  if ($('#superbook').length > 0 ){
    document.body.addEventListener('touchmove', function(e){
      e.preventDefault();
    });
  }

  // // Present superbook elements after turn has been applied.
  // $superbook.fadeIn('slow');

  // var bookId = $('#page_book_id').val();
  // // var readPageNo = Cookies.get(""+bookId);
  // var currentPage = $superbook.turn('page');
  // var viewPages = $superbook.turn('view');

  // Cookies.remove(""+bookId);
  // // alert(Cookies.get());

  // Setting cookie to fresh new page when user cancels overlay.
  // Cookies.set(""+bookId, parseInt(gon.page_no));

  // if (readPageNo && readPageNo != viewPages[0] && readPageNo != viewPages[1]) {

  //   $('#readPage').text('Go to page ' + readPageNo);
  //   $('#readPageNo').html(readPageNo);
  //   $('#overlayRememberPage').fadeIn('slow');

  //   $('#firstPage').on('click', function(e) {
  //     e.preventDefault();
  //     $superbook.turn('page', 1);
  //     $('#overlayRememberPage').fadeOut('slow');
  //   });

  //   $('#readPage').on('click', function(e) {
  //     e.preventDefault();
  //     $superbook.turn('page', readPageNo);
  //     $('#overlayRememberPage').fadeOut('slow');
  //   });
  // }

  // $('#superbook').bind('turned', function(event, page, view) {
  //   Cookies.remove(""+bookId);
  //   Cookies.set(""+bookId, parseInt(page));
  // });

  bookSlider($superbook);

  $superbook.bind('turning', function(event, page, view) {
    // var newURL = '/book/' + gon.slug + (gon.action == 'edit' ? '/edit/' : '/') + page;
    if (pushToStateFlag) {
      window.history.pushState('Books', 'Flip', newURL);
    } else {
      pushToStateFlag = true;
    }

    // $('.bookPreviewButton').attr('href', '/book/' + gon.slug + '/' + page);
    // gon.page_no = page;

  });

  if (Turn.isTouchDevice) {
    $('body .ui-arrow-next-page').on('tap', function(e) {
      $superbook.turn('next');
    });
    $('body .ui-arrow-previous-page').on('tap', function(e) {
      $superbook.turn('previous');
    });
  } else {
    $('.ui-arrow-next-page').on('click', function(e) {
      $superbook.turn('next');
    });
    $('.ui-arrow-previous-page').on('click', function(e) {
      $superbook.turn('previous');
    });
  }

  // // Binding keys: left, right, pageu, pagedown to flipping the book.
  // key('left, pageup, up', function(e) {
  //   e.preventDefault(e);
  //   $superbook.turn('previous');
  // });

  // key('right, pagedown, down, space', function(e) {
  //   e.preventDefault(e);
  //   $superbook.turn('next');
  // });

  // // Command + pageup, command + pagedown combinations to beginning or end of book
  // key('⌘ + left, ⌘ + pageup, ⌘ + up, ctrl + left, ctrl + pageup, ctrl + up', function(e) {
  //   e.preventDefault(e);
  //   $superbook.turn('page', 1);
  // });

  // key('⌘ + right, ⌘ + pagedown, ⌘ + down, ctrl + right, ctrl + pagedown, ctrl + down', function(e) {
  //   e.preventDefault(e);
  //   $superbook.turn('page', $superbook.turn('pages'));
  // });

  // Click on ellipsis to reveal header/page-slider
  $('.show-hint').on('click', function() {
    $('#controls').toggleClass('hidden-controls');
    $('header').toggleClass('hidden');
  });

  // // Open up payment/tip overlay after the reader has read through the book
  // $superbook.bind('last', function(event) {
  //   $('#promptLastPageOverlay').delay(2000).fadeIn('slow');
  // });

});
