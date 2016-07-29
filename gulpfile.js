var gulp = require("gulp");
var phantom = require("gulp-phantom");
var assemble = require("./assemblefile.js");
var clean = require("gulp-clean");
var watch = require("gulp-watch");

gulp.task('clean', [], function() {
  return gulp.src('reports', {read: false})
        .pipe(clean());
});

gulp.task('css', ['clean'], function() {
  return gulp.src('css/**/*').pipe(gulp.dest('reports/css'));
});

gulp.task('script', ['clean'], function() {
  return gulp.src('scripts/**/*').pipe(gulp.dest('reports/scripts'));
});

gulp.task('assemble', ['clean', 'css', 'script'], function() {
  return assemble.build(['default'], function(err) {
    if (err) throw err;
    console.log('done!');
  });
});

gulp.task('watch', function() {
  return watch('templates/**/*.hbs', function () {
      return assemble.build(['default'], function(err) {
        if (err) throw err;
        console.log('done!');
      });
    });
});

gulp.task('phantom', function(){
  return gulp.src("./phantom/*.js")
    .pipe(phantom({
      ext: json
    }))
    .pipe(gulp.dest("./data/"));
})
