/** global library **/
require('gsap');

global.THREE = require('three');

require('vendors/shaders/CopyShader');

require('vendors/postprocessing/EffectComposer');
require('vendors/postprocessing/RenderPass');
require('vendors/postprocessing/MaskPass');
require('vendors/postprocessing/ShaderPass');

window.Stats = require('vendors/Stats');
window.GUI   = require('dat-gui').GUI;

// window.ks.createCaption = require('vendors/caption');

/** three.js sketch **/

/** boilerplate */
//require('./sketches/boilerplate/box/app');
// require('./sketches/boilerplate/shader/app');
// require('./sketches/boilerplate/interactive/app');

/** basic **/
// require('./sketches/basic/video-texture/index')
// require('./sketches/basic/buffer-geometry/app')
//require('./sketches/basic/texture/app');
// require('./sketches/basic/postprocessing/app');
//require('./sketches/basic/webglrenderer-target/app')
//require('./sketches/basic/texture-buffergeometry-image/app');
// require('./sketches/basic/texture-buffergeometry-canvas/app');
//require('./sketches/basic/swap-rendering0/app');
//require('./sketches/basic/swap-rendering1/app');
// require('./sketches/basic/swap-rendering-with-customSwapRenderer/app');
// require('./sketches/basic/video-texture/index');


/** undefined **/
//require('../../sketches/undefined/#000/app');

/** theme **/
/** light **/
// require('../../sketches/theme/light/point-light#00/app'); // shit
// require('./sketches/theme/post-processing/godray0/app');
// require('./sketches/theme/post-processing/godray1/app');

/** postprocessing **/

// require('./sketches/theme/post-processing/postprocessing00/app')
//require('./sketches/theme/post-processing/postprocessing01/app');
// require('./sketches/theme/post-processing/ofx-water/app');
//require('./sketches/theme/post-processing/ofx-glitch/app');

// require('./sketches/theme/post-processing/bloom/app');

/** gallery **/
//require('./sketches/theme/gallery/gallery00/app');
//require('./sketches/theme/gallery/gallery01/app');
//require('./sketches/theme/gallery/gallery02/app');

/** noise **/
//require('./sketches/theme/noise/noise01/app');

/** shader **/
//require('./sketches/theme/shader/00-shader00/app');
// require('./sketches/theme/post-processing/ofx-water/app');
// require('./sketches/theme/shader/app01/app');
// require('./sketches/theme/shader/app02-lensflare/app');
//require('./sketches/theme/post-processing/ofx-water/app');
// require('./sketches/theme/shader/01-wireframe/app')

/** brush **/
// require('./sketches/theme/brush/app');
// require('./sketches/theme/paint/brush00/app');
// require('./sketches/theme/paint/brush01/app');

/** Marching Cube **/
//require('./sketches/theme/marching-cube/marching-cube00/app');
//require('./sketches/theme/marching-cube/marching-cube00/app');

/** particle **/
//require('./sketches/theme/particle-system/particle01/app');

/** palne **/
//require('./sketches/theme/geometry/animation-geometry/app'); // <- snow

/** procedural mesh **/
// require('./sketches/theme/procedural-mesh/primitive-plane/app')
// require('./sketches/theme/procedural-mesh/grid/app')
//require('./sketches/theme/procedural-mesh/grid/app');
//require('./sketches/theme/procedural-mesh/cube/app');
//require('./sketches/theme/procedural-mesh/cube2/app');
// require('./sketches/theme/procedural-mesh/sphere/index');
// require('./sketches/theme/procedural-mesh/raycaster-sphere/index');

/** controller **/
// require('./sketches/theme/controller/steam/app');

/** gpgpu **/
// require('./sketches/theme/gpgpu/gpgpu-basic1/app');
// require('./sketches/theme/gpgpu/gpgpu-basic2/app');
// require('./sketches/theme/gpgpu/gpgpu-swap-renderer/app');

/** swap renderer **/
// require('./sketches/theme/swap-renderer/app00');
// require('./sketches/theme/swap-renderer/app01');


/** fluid **/
// require('./sketches/theme/fluid/app/index');
// require('./sketches/theme/fluid/app00/index')
// require('./sketches/theme/fluid/app01/index')
// require('./sketches/theme/fluid/app-2dFluid');
// require('./sketches/theme/fluid/advect');

/** camera **/
// require('./sketches/theme/camera/app00/index') // optical-flow
// require('./sketches/theme/camera/app01/index');

/** others **/
// require('./sketches/undefined/#002/app');
// require('./sketches/undefined/#003/app');

/** rawGL **/
// require('./sketches/rawGL/noise/app');

/** video */
// require('./sketches/theme/video/videoMask/app');

/** particles **/
require('./sketches/theme/particles/buffergeometry-particle/app')