///////////////// MODULES ////////////////////

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const saveSamples = require('./src/system').saveSamples;
const appConfig = require('./config');

/////////// CONSTRUCT SAMPLES FILE ///////////

gulp.task('samples', function() {
  saveSamples('./samples.json');
});

//////////////// DEV SERVER //////////////////

gulp.task('default', function() {
  return nodemon({
    script: 'src/server.js',
    ext: 'js',
    ignore: [
      'repos/**',
      'gulpfile.js'
    ]
  });
});

