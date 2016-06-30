require('vendors/shaders/VerticalBlurShader');
require('vendors/shaders/HorizontalBlurShader');
require('vendors/shaders/FocusShader');
require('./vendors/StaticShader');


var QuntumGodray = require('./shaders/quantum-godray/index');
var QuntumAdditive = require('./shaders/quntum-additive/index');

var raf     = require('raf');
var glslify = require('glslify');
// var createCaption = require('../../dom/caption');
var createCaption = require('vendors/caption');

var scene, camera, renderer;
var object, id;
var size = {
    width : window.innerWidth,
    height: window.innerHeight
}
var scale = 2;
var stats, wrapper;

var isAnimation = true;
var effectComposer, focusShader, staticShader;

var ray;// = {};

function init(){


    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    initSceneMake();
    makeRay();
    createRenderer();

    setComponent();

    raf(animate);
}

function initSceneMake(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, size.width / size.height, 1, 6000);
    camera.position.z = 1250;

    // var geo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    // var mat = new THREE.MeshBasicMaterial({
    //     color : 0xff3333,
    //     wireframe : true,
    //     transparent: true
    // });

    // var plane = new THREE.Mesh(geo, mat)
    // scene.add(plane);
}

function makeRay(){
    ray = {};
    ray.camera = new THREE.PerspectiveCamera(60, size.width / size.height, 1, 6000);
    ray.scene  = new THREE.Scene();
    /**
    ray.light = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 2), new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1
    })); */
    var geo = new THREE.PlaneGeometry(100, 100, 10, 10);
    var mat = new THREE.MeshBasicMaterial({
        color : 0xff3333,
        wireframe : true,
        transparent: true
    });
    var mesh = new THREE.Mesh(geo, mat);
    ray.scene.add(mesh);
    ray.camera.position.z = 1250;
}

function createRenderer() {
    var mainRendererPass = new THREE.RenderPass( scene, camera );

    var rendererFormat = {
        minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
        format    : THREE.RGBFormat,
        stencilBuffer : false
    };
    ray.renderTarget = new THREE.WebGLRenderTarget( size.width/scale, size.height/scale, rendererFormat );
    ray.hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    ray.vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    ray.hblur.uniforms.h.value = 2 / size.width * 0.1;
    ray.vblur.uniforms.v.value = 2 / size.width * 0.1;
    var depthPass = new THREE.RenderPass(ray.scene, camera);
    ray.gr = new THREE.ShaderPass(new QuntumGodray());
    ray.gr.needsSwap = true;
    ray.gr.renderToScreen = false;
    var additivePass = new THREE.ShaderPass(new QuntumAdditive());
    additivePass.needsSwap = true;
    additivePass.renderToScreen = false;
    ray.composer = new THREE.EffectComposer(renderer, ray.renderTarget);
    ray.composer.addPass(depthPass);
    ray.composer.addPass(ray.hblur);
    ray.composer.addPass(ray.vblur);
    ray.composer.addPass(ray.hblur);
    ray.composer.addPass(ray.vblur);
    ray.composer.addPass(ray.gr);
    additivePass.uniforms.tAdd.value = ray.composer.renderTarget1;
    var renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, rendererFormat);

    effectComposer = new THREE.EffectComposer(renderer, renderTarget);
    effectComposer.addPass(mainRendererPass);
    effectComposer.addPass(additivePass);

    focusShader = new THREE.ShaderPass(THREE.FocusShader);
    focusShader.renderToScreen = false;
    focusShader.uniforms.screenWidth.value = size.width;
    focusShader.uniforms.screenHeight.value = size.height;
    // effectComposer.addPass(focusShader);
    // console.log(THREE.StaticShader  );
    staticShader = new THREE.ShaderPass(THREE.StaticShader);
    staticShader.uniforms.amount.value = 0.03; //Device.system.retina ? 0.055 : 0.035;
    staticShader.uniforms.size.value = 3; //Device.system.retina ? 4 : 3;
    staticShader.renderToScreen = true;
    effectComposer.addPass(staticShader)
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

    ray.composer.render();
    effectComposer.render();

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

init();