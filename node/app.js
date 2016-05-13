var budo = require('budo');
var babelify = require('babelify');
var glslify  = require('glslify');
var aliasify = require('aliasify');
console.log(glslify);
// "sections": "./src/sections/",
budo("main.js", {
    live : true,
    // open : true,
    stream : process.stdout,
    serve : "bundle.js",
    verbose : true,
    browserify: {
        transform: [
            babelify.configure({presets: ["es2015"]}),
            glslify,
            aliasify.configure({
                aliases : {
                    "vendors" : "./vendors/"
                }
            })
        ]
    }
}).on('connect', function (ev) {
    // console.log('Server running on %s', ev.uri)
    // console.log('LiveReload running on port %s', ev.livePort)
}).on('update', function (buffer) {
    // console.log('bundle - %d bytes', buffer.length)
})