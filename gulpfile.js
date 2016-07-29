var gulp = require("gulp");
var phantom = require("gulp-phantom");
 
gulp.task('phantom', function(){
  gulp.src("./phantom/*.js")
    .pipe(phantom({
      ext: json
    }))
    .pipe(gulp.dest("./data/"));
})