// var path = require('path');
// var childProcess = require('child_process');
// var phantomjs = require('phantomjs-prebuilt');
// var binPath = phantomjs.path;
//  
// var childArgs = [
//   path.join(__dirname, 'fetchStylesheets.js'),
//   'http://www.niteco.se'
// ]
//  
// childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
//   // handle results 
// })

var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false });
var http = require('http');

nightmare
  .goto('http://www.niteco.se')
  .evaluate(function () {
      var linkStylesheets = document.querySelectorAll('link[rel=stylesheet]');
      var externCss = Array.prototype.map.call(linkStylesheets, function(link) { return link.href; });
      return externCss;
  })
  .end()
  .then(function (result) {
    
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  })
  ;