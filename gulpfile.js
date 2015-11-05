const argv = require('minimist')(process.argv.slice(2))
const openURL = require('opn')
const once = require('once')

const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const streamify = require('gulp-streamify')
const source = require('vinyl-source-stream')

const budo = require('budo')
const browserify = require('browserify')
const resetCSS = require('node-reset-scss').includePath
const garnish = require('garnish');
const glslify = require('glslify');
const browserifyShader = require('browserify-shader');
const errorify = require('errorify');

const entry = './src/js/main.js';
const outfile = 'bundle.js';

//our CSS pre-processor
gulp.task('sass', function() {
  gulp.src('./src/sass/main.scss')
    .pipe(sass({ 
      errLogToConsole: true,
      outputStyle: argv.production ? 'compressed' : undefined,
      includePaths: [ resetCSS ] 
    }))
    .pipe(gulp.dest('./app'))
});

//the development task
gulp.task('watch', ['sass'], function(cb) {
  //watch SASS
  gulp.watch('src/sass/*.scss', ['sass'])

  var ready = function(){}
  var pretty = garnish()
  pretty.pipe(process.stdout)

  //dev server
  budo(entry, {
    serve: 'bundle.js',    //end point for our <script> tag
    stream: pretty,        //pretty-print requests
    live: true,            //live reload & CSS injection
    verbose: true,         //verbose watchify logging
    open : true,
    dir: 'app',            //directory to serve

    browserify : {
      debug : true,
      transform: [browserifyShader, glslify]   //browserify transforms
    },
    plugin: errorify       //display errors in browser
  })
  .on('exit', cb)
  .on('connect', function(ev) {
    ready = once(openURL.bind(null, ev.uri))
  })
  .once('update', function() {
    //open the browser
    if (argv.open) {
      ready()
    }
  })
});

//the distribution bundle task
gulp.task('bundle', ['sass'], function() {
  var bundler = browserify(entry, { transform: [browserifyShader, glslify]})
        .bundle()
  return bundler
    .pipe(source('index.js'))
    .pipe(streamify(uglify()))
    .pipe(rename(outfile))
    .pipe(gulp.dest('./app'))
})