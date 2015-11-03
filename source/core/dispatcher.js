var fs = require('fs');

var actions = {
  'book' : function(slug, page_no) {

    // fs.readFile('./jacket/book.html', function(error, content) {
    //   if (error) {
    //     serverError(500);
    //   } else {
    //     renderHtml(content);
    //   }
    // });

    return '<h1>book/ ' + slug + '/' + page_no + '</h1>';

  },

  'cover' : function(slug) {
    return '<h1>Cover/ ' + slug + '</h1>';
  }

}

exports.dispatch = function(req, res) {

  // Private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }

  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  }

  var parts = req.url.split('/');

  if (req.url == "/") {

    fs.readFile('./source/index.html', function(error, content) {
      if (error) {
        serverError(500);
      } else {
        renderHtml(content);
      }
    });
  } else {
    
    var action    = parts[1],
        slug      = parts[2],
        page_no   = parts[3];

    if (typeof actions[action] == 'function') {
      var content = actions[action](slug, page_no);
      renderHtml(content);
    } else {
      serverError(404, '404 Bad Request');
    }
  }
}