var browserify = require('browserify');
var babelify = require('babelify');
var glslify  = require('glslify');
var aliasify = require('aliasify');
var vinyl = require('vinyl-source-stream');
var uglify = require("uglifyify");
var browserify = require('browserify')
var fs = require('fs')

// console.log('__dirname + '/index.js );
var b = browserify();
b.add(__dirname + '/../main.js');
b.transform(babelify.configure({presets: ["es2015"]}));
b.transform(glslify);
// b.transform(aliasify.configure({aliases : {"vendors" : "./vendors/"}}));
b.transform({global: true}, 'uglifyify');

var o = b.bundle().pipe(fs.createWriteStream(__dirname + '/../example/bundle.js'));