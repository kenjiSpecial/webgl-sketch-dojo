/** global library **/

window.THREE = require('three');

require('./vendors/shaders/CopyShader');

require('./vendors/postprocessing/EffectComposer');
require('./vendors/postprocessing/RenderPass');
require('./vendors/postprocessing/MaskPass');
require('./vendors/postprocessing/ShaderPass');

window.Stats = require('./vendors/Stats');
window.GUI   = require('dat-gui').GUI;

require('gsap');

/** undefined **/

//require('../../sketches/undefined/#000/app');

/** theme **/
/** light **/
//require('../../sketches/theme/light/point-light#00/app'); // shit
require('../../sketches/theme/post-processing/godray0/app');