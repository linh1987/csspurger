var system = require('system');
if (system.args.length === 1) {
  console.log('Please pass in an url');
	phantom.exit();
}
var url = system.args[1];
//console.log("URL: " + url);

var page = require('webpage').create();

page.open(url, function(status) {
  if(status !== "success") {
    console.error("ERROR: " + status);
  }
  
  var result = page.evaluate(function() {
    var externalCss = document.querySelectorAll('links[rel=stylesheet]');
  });
  console.log(result);
  phantom.exit();
});

