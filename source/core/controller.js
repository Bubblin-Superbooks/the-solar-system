/*
 * /lib/controller.js
 */
var controller = function() {};

  controller.prototype = {
    'view' : function(user) {
      return '<h1>Todos for ' + user + '</h1>';
    }
  };


module.exports = new controller();