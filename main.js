var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false });
var fs = require('fs');
var parse = require('./parser.js');
var report = require('./assembleFile.js');
var request = require('request');

var url = 'http://www.dn.se';

nightmare
    .goto(url)
    .evaluate(function () {
        var linkStylesheets = document.querySelectorAll('link[rel=stylesheet]');
        var externCss = Array.prototype.map.call(linkStylesheets, function(link) { return link.href; });
        return externCss;
    })
    .end()
    .then(function (links) {
        return new Promise(function(resolve, reject) {
            var cssData = [];
            
            for(var i=0; i < links.length; i++){
                request(links[0], function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        cssData.push(body);
                    }
                    
                    if (cssData.length === links.length) {
                        resolve(cssData);
                    }
                })
            }
        });
    })
    .then(function(cssContents){
      var allSelectors = [];
      for(var cssContent of cssContents) {
        var selectors = parse(cssContent);
        Array.prototype.push.apply(allSelectors, selectors);
      }
      return allSelectors;
    })
    .then(function(allSelectors){
        var sub = Nightmare({ show: false })
        return sub.goto(url)
            .evaluate(function(selectors) {
                for(var i=0, selector = selectors[i]; i< selectors.lenth; i++) {
                    var count = document.querySelectorAll(selector).length;
                    selector.count = count;
                }
                return selectors;
            }, allSelectors)
            .then(function(selectors) {
                return selectors;
            })
            .catch(function (error) {
                console.error(error);
            });    
    })
    .then(function(selectors){
        
        var count = selectors.length;
        var unusedCnt = selectors.filter(function(sel){ return sel.count == 0; });
        var moderateCnt = selectors.filter(function(sel){ return sel.count > 0 && sel.count < 5; });
        var heavyCnt = selectors.filter(function(sel){ return sel.count >=5; });
        var result = {
            "website": "",
            "url": url,
            "statistics": [
                {
                    "title": "Unused",
                    "percentage": unusedCnt / count
                },
                {
                    "title": "Moderately Used",
                    "percentage": moderateCnt / count
                },
                {
                    "title": "Heavily Used",
                    "percentage": heavyCnt / count
                }
            ],
            "obsoletedselectors": selectors
        };
        fs.writeFile('./data/data.json', JSON.stringify(result), function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("Done");
        }); 
        return true;
    })
    .catch(function (error) {
      console.error(error);
    })
    ;
