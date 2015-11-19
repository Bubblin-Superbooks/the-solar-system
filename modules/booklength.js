var sh = require('shelljs');

var count = 0;

exports.module = {
  booklength: function(manuscript){
    return "hello";
  }
}
// function annotateFolder (folderPath) {
//   sh.cd(folderPath);
//   var files = sh.ls() || [];

//   for (var i=0; i<files.length; i++) {
//     var file = files[i];

//     if (!file.match(/.*\..*/)) {
//       annotateFolder(file);
//       sh.cd('../');
//     } else {
//       count++;
//     }
//   }
// }
// if (process.argv.slice(2)[0])
//   annotateFolder(process.argv.slice(2)[0]);
// else {
//   console.log('There is no folder');
// }

// console.log(count);

