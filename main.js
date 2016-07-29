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
                request(links[i], function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        cssData.push({
                            link: links[i],
                            body: body
                        });
                    }
                    
                    if (cssData.length === links.length) {
                        resolve(cssData);
                    }
                })
            }
        });
    })
    .then(function(cssInfos){
      for(var cssInfo of cssInfos) {
        var selectors = parse(cssInfo.body);
        cssInfo.selectors = selectors;
      }
      return cssInfos;
    })
    .then(function(cssInfos){
        var sub = Nightmare({ show: false })
        return sub.goto(url)
            .evaluate(function(cssInfos) {
                for(var i=0, cssInfo = cssInfos[i]; i< cssInfos.lenth; i++) {
                    for(var j=0, selector = cssInfo.selectors[j]; j< cssInfo.selectors.length; j++){
                        var count = document.querySelectorAll(selector).length;
                        selector.count = count;    
                    }
                }
                return cssInfos;
            }, cssInfos)
            .then(function(cssInfos) {
                return cssInfos;
            })
            .catch(function (error) {
                console.error(error);
            });    
    })
    .then(function(cssInfos){
        
        
        var result = {
            "website": "",
            "url": url,
            "stylesheets": cssInfos.map(function(css){
                var count = css.selectors.length;
                var unusedCnt = css.selectors.filter(function(sel){ return sel.count == 0; }).length;
                var moderateCnt = css.selectors.filter(function(sel){ return sel.count > 0 && sel.count < 5; }).length;
                var heavyCnt = css.selectors.filter(function(sel){ return sel.count >=5; }).length;
                return {
                    "link":css.link,
                    "statistics": [
                        {
                            "title": "Unused",
                            "color": "#ef3c79",
                            "percentage": unusedCnt / count
                        },
                        {
                            "title": "Moderately Used",
                            "color": "#ba65c9",
                            "percentage": moderateCnt / count
                        },
                        {
                            "title": "Heavily Used",
                            "percentage": heavyCnt / count,
                            "color": "#acec00"
                        }
                    ],
                    "obsoletedselectors": css.selectors
                };
            }),
            
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
