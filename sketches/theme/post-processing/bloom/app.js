require('vendors/shaders/VerticalBlurShader');
require('vendors/shaders/HorizontalBlurShader');
require('vendors/shaders/CopyShader');
require('./vendors/StaticShader');

var QuntumAdditive = require('./shaders/quntum-additive/index');

var raf = require('raf');
var glslify = require('glslify');
var createCaption = require('vendors/caption');


var scene, camera, renderer;
var mesh;
var plane;
var effect;
var object, id;
var effectComposer, renderTarget;
var mainEffectComposer;
var staticShader;
var scale = 2;
var size = {
    width : window.innerWidth,
    height: window.innerHeight
}
var stats, wrapper;

init();

function init(){
    renderer = new THREE.WebGLRenderer({alpha : true });
    renderer.setSize( size.width, size.height );
    document.body.appendChild(renderer.domElement);

    initSceneMake();
    addMesh();
    makePostEffect();

    setComponent();

    raf(animate);
}

function initSceneMake(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, size.width / size.height, 1, 6000);
    camera.position.z = 1250;
}

function addMesh(){
    plane = new THREE.PlaneGeometry(600, 400, 6, 4);
    var mat = new THREE.MeshBasicMaterial({
        color : 0xff0000,
        wireframe : true,
        transparent : true
    })
    mesh = new THREE.Mesh( plane, mat );
    scene.add(mesh);
}

function makePostEffect(){
    var mainRenderPass = new THREE.RenderPass( scene, camera );
    var rendererFormat = {
        minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
        format    : THREE.RGBFormat,
        stencilBuffer : false
    };
    renderTarget = new THREE.WebGLRenderTarget( size.width/scale, size.height/scale, rendererFormat );
    var hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    var vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    hBlur.uniforms.h.value = 3 / size.width;
    vBlur.uniforms.v.value = 3 / size.height;
    var additivePass = new THREE.ShaderPass(new QuntumAdditive());
    additivePass.needsSwap = true;
    additivePass.renderToScreen = false;

    var copyPass = new THREE.ShaderPass(THREE.CopyShader);
    copyPass.needsSwap = true;
    copyPass.renderToScreen = false;

    var renderPass = new THREE.RenderPass(scene, camera);
    effectComposer = new THREE.EffectComposer( renderer, renderTarget );
    effectComposer.addPass(renderPass);
    effectComposer.addPass(hBlur);
    effectComposer.addPass(vBlur);
    effectComposer.addPass(hBlur);
    effectComposer.addPass(vBlur);
    // effectComposer.addPass(hBlur);
    // effectComposer.addPass(vBlur);
    effectComposer.addPass(copyPass);

    additivePass.uniforms.tAdd.value = effectComposer.renderTarget1;

    var renderTarget = new THREE.WebGLRenderTarget( size.width, size.height, rendererFormat );

    mainEffectComposer = new THREE.EffectComposer(renderer, renderTarget);
    mainEffectComposer.addPass(mainRenderPass);
    // mainEffectComposer.addPass(hBlur);
    // mainEffectComposer.addPass(vBlur);
    // mainEffectComposer.addPass(hBlur);
    // mainEffectComposer.addPass(vBlur);
    mainEffectComposer.addPass(additivePass);

    staticShader = new THREE.ShaderPass(THREE.StaticShader);
    staticShader.uniforms.amount.value = 0.03; //Device.system.retina ? 0.055 : 0.035;
    staticShader.uniforms.size.value = 3; //Device.system.retina ? 4 : 3;
    staticShader.renderToScreen = true;
    mainEffectComposer.addPass(staticShader)


}

function setComponent(){
    var title = 'Boilerplate: Shader';
    var caption = 'Boilerplate Three.js shader app';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/boilerplate/shader';

    wrapper = createCaption(title, caption, url);

    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom  = '30px';
    stats.domElement.style.left = '30px';
    stats.domElement.style.zIndex= 9999;

    document.body.appendChild( stats.domElement );
}

function animate() {
    stats.begin();

    // renderer.render(scene, camera);

    // ray.composer.render();
    effectComposer.render();
    mainEffectComposer.render();

    staticShader.uniforms.time.value += 1/60;

    stats.end();

    id = raf(animate);
}


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});