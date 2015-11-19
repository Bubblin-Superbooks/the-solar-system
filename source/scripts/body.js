var fs = require('fs'),
    path = require('path'),
    booklength = require('./../../modules/booklength');


var manuscript = "./../../manuscript/";


booklength(manuscript);



// var pages = [];

// function getDirectories(srcpath) {
//   return fs.readdirSync(srcpath).filter(function(file) {
//     return fs.statSync(path.join(srcpath, file)).isDirectory();
//   });
// }


// console.log(getDirectories);