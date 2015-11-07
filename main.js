/** global library **/

window.THREE = require('three');

require('./src/js/vendors/shaders/CopyShader');

require('./src/js/vendors/postprocessing/EffectComposer');
require('./src/js/vendors/postprocessing/RenderPass');
require('./src/js/vendors/postprocessing/MaskPass');
require('./src/js/vendors/postprocessing/ShaderPass');

window.Stats = require('./src/js/vendors/Stats');
window.GUI   = require('dat-gui').GUI;

require('gsap');

/** basic **/
//require('./sketches/basic/boxes/app');

/** undefined **/
//require('../../sketches/undefined/#000/app');

/** theme **/
/** light **/
//require('../../sketches/theme/light/point-light#00/app'); // shit
//require('./sketches/theme/post-processing/godray0/app');

/** postprocessing **/
//require('./sketches/theme/post-processing/postprocessing00/app')
require('./sketches/theme/post-processing/postprocessing01/app');