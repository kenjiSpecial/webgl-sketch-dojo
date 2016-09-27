/**
 *
 *  my custom shader kit for post processing with three.js
 *
 *  based on three.js shaders
 *  https://github.com/mrdoob/three.js/tree/master/examples/js/shaders
 *
 *
 *
 */

module.exports = {
    'copy'         : require('./shaders/copy/main'),
    'gray'         : require('./shaders/gray/main'),
    'blur'         : require('./shaders/blur/main'),
    'normal'       : require('./shaders/normal/main'),
    'displayPixel' : require('./shaders/displacePixel/main')
};