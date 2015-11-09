/** global library **/
require('gsap');

window.THREE = require('three');

require('./src/js/vendors/shaders/CopyShader');

require('./src/js/vendors/postprocessing/EffectComposer');
require('./src/js/vendors/postprocessing/RenderPass');
require('./src/js/vendors/postprocessing/MaskPass');
require('./src/js/vendors/postprocessing/ShaderPass');

window.Stats = require('./src/js/vendors/Stats');
window.GUI   = require('dat-gui').GUI;

/** three.js sketch **/

/** boilerplate */
//require('./sketches/boilerplate/box/app');

/** basic **/
//require('./sketches/basic/texture/app');
//require('./sketches/basic/postprocessing/app');
require('./sketches/basic/webglrenderer-target/app')

/** undefined **/
//require('../../sketches/undefined/#000/app');

/** theme **/
/** light **/
//require('../../sketches/theme/light/point-light#00/app'); // shit
//require('./sketches/theme/post-processing/godray0/app');

/** postprocessing **/
//require('./sketches/theme/post-processing/postprocessing00/app')
//require('./sketches/theme/post-processing/postprocessing01/app');
//require('./sketches/theme/post-processing/ofx-water/app');