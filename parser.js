
var css = require('css');

function parse(rawCss) {
	var ast = css.parse(rawCss, {
		silent: true,
	});
	
	var selectors = [];
	visit(ast, function(node){
		if (node.type==='rule') {
			
			var selectorInfos = node.selectors.map(function(sel){
				return {
					selector: sel,
					position: {
						line: node.position.start.line,
						column: node.position.start.column
					},
					file: '',
					count: 0
				}
			});
			Array.prototype.push.apply(selectors, selectorInfos);
		}
	});
	return selectors;
}

function visit(node, visitor) {
	switch(node.type) {
		case 'stylesheet':
			visitor(node);
			for(var i=0, rule = node.stylesheet.rules[i]; i < node.stylesheet.rules.length; i++) {
				visit(rule, visitor);
			}
			if (node.parsingErrors && node.parsingErrors.length) {
				console.error(node.parsingErrors);
			}
			break;
		case 'rule':
			visitor(node);
			break;
		case 'media':
			visitor(node);
			for(var i=0, rule = node.rules[i]; i < node.rules.length; i++) {
				visit(rule, visitor);
			}
			break;
		case 'comment':
		default: 
			break;
	}
}

module.exports = parse;