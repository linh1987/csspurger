'use strict';

var assemble = require('assemble');
var extname = require('gulp-extname');

var app = assemble({
  layout: 'templates/layouts/layout.hbs'
});

app.task('default', function() {
  app.pages('templates/*.hbs');
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(extname())
    .pipe(app.dest('reports'));
});

module.exports = app;
