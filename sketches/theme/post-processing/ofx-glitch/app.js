var raf = require('raf');
var createCaption = require('../../../dom/caption');

var ShaderOdangoSet = require('../../../../src/js/vendors/shader-odango-set/main');
var grayShader = ShaderOdangoSet.gray;
var copyShader = ShaderOdangoSet.copy;
var shadowEffect = new THREE.ShaderPass(grayShader);

var twistShader = require('./shaders/twist/app');
var twistEffect = new THREE.ShaderPass(twistShader);

var convergenceShader = require('./shaders/covergence/app');
var convergenceEffect = new THREE.ShaderPass(convergenceShader);

var cutSliderShader = require('./shaders/cut-slider/app');
var cutSliderEffect = new THREE.ShaderPass(cutSliderShader);

var noiseShader = require('./shaders/noise/app');
var noiseEffect = new THREE.ShaderPass(noiseShader);

var slitScanShader = require('./shaders/slit-scan/app');
var slitScanEffect  = new THREE.ShaderPass(slitScanShader);

var slitScanHorizonalShader = require('./shaders/slit-scan-horizonal/app');
var slitScanHorizonalEffect = new THREE.ShaderPass(slitScanHorizonalShader);

//require('../../../src/js/vendors/shaders/CopyShader')

var scene, camera, renderer;
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;

var loader = new THREE.TextureLoader();
var composer;
var object;
var cubes = [];

var title = 'Imported shader from ofxGlitch';
var caption = '';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/post-processing/ofx-glitch');
wrapper.style.width = (window.innerWidth/2 - 50) + "px";
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';


function init(){
    scene = new THREE.Scene();

    //camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    //camera.position.z = 10;
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x000000 );
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);


    // load assets
    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    material = new THREE.MeshPhongMaterial({color: 0x3a9ceb});

    var c;
    for(var i = 0; i < 300; i++) {
        c = addCube();
        cubes.push(c);
        scene.add(c);
    }
    c.position.set(0, 0, 50);




    /** composer **/

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );


    composer.addPass(shadowEffect);

    twistEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    composer.addPass(twistEffect);

    convergenceEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    composer.addPass(convergenceEffect);

    cutSliderEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    composer.addPass(cutSliderEffect);

    noiseEffect.uniforms.uWindow.value =  new THREE.Vector2(window.innerWidth, window.innerHeight);
    composer.addPass(noiseEffect);

    slitScanEffect.uniforms.uWindow.value =  new THREE.Vector2(window.innerWidth, window.innerHeight);
    slitScanEffect.uniforms.uValue.value =  1;
    TweenLite.to(slitScanEffect.uniforms.uValue, 0.8 + 0.4 * Math.random(), {value: window.innerWidth * Math.random(), delay: 0.6 + 0.4 * Math.random(), onComplete: tweenComp, ease: Power4.easeInOut });
    composer.addPass(slitScanEffect);

    slitScanHorizonalEffect.uniforms.uWindow.value =  new THREE.Vector2(window.innerWidth, window.innerHeight);
    slitScanHorizonalEffect.uniforms.uValue.value =  1;
    TweenLite.to(slitScanHorizonalEffect.uniforms.uValue, 0.8 + 0.4 * Math.random(), {value: window.innerHeight * Math.random(), ease: Power4.easeInOut, delay: 0.6 + 0.4 * Math.random(), onComplete: tweenComp2 });
    composer.addPass(slitScanHorizonalEffect);

    var copyEffect = new THREE.ShaderPass(copyShader);
    copyEffect.renderToScreen = true;
    composer.addPass(copyEffect);

    setGUI();

    raf(animate);
}

var count = 0;
function tweenComp(){
    var dur = 0.8 + 0.4 * Math.random();
    var del = 0.6 + 0.4 * Math.random();

    if(count % 2 == 0){
        TweenLite.to(slitScanEffect.uniforms.uValue, dur, {value: 10 * Math.random(), delay: del, onComplete: tweenComp, ease: Power4.easeInOut });
    }else{
        TweenLite.to(slitScanEffect.uniforms.uValue, dur, {value: window.innerWidth * Math.random(), delay: del, onComplete: tweenComp, ease: Power4.easeInOut });
    }

    count++;
}

var count2 = 0;
function tweenComp2(){
    var dur = 0.8 + 0.4 * Math.random();
    var del = 0.6 + 0.4 * Math.random();

    if(count % 2 == 0){
        TweenLite.to(slitScanHorizonalEffect.uniforms.uValue, dur, {value: 10 * Math.random(), delay: del, ease: Power4.easeInOut, onComplete: tweenComp2 });
    }else{
        TweenLite.to(slitScanHorizonalEffect.uniforms.uValue, dur, {value: window.innerHeight * Math.random(), delay: del, ease: Power4.easeInOut, onComplete: tweenComp2});
    }

    count2++;
}

function setGUI(){
    var controls = new function () {
        this.isGray           = true;
        this.isTwist          = false;
        this.isCovergence     = false;
        this.isCutSlider      = true;
        this.isNoise          = true;
        this.isSlit           = false;
        this.isHorizontalSlit = true;
    };

    var gui = new GUI();
    gui.add(controls, 'isGray').onChange(function(){ shadowEffect.enabled = controls.isGray; });
    gui.add(controls, 'isTwist').onChange(function(){ twistEffect.enabled = controls.isTwist; });
    gui.add(controls, 'isCovergence').onChange(function(){ convergenceEffect.enabled = controls.isCovergence; });
    gui.add(controls, 'isCutSlider').onChange(function(){ cutSliderEffect.enabled = controls.isCutSlider; });
    gui.add(controls, 'isNoise').onChange(function(){ noiseEffect.enabled = controls.isNoise; });
    gui.add(controls, 'isSlit').onChange(function(){ slitScanEffect.enabled = controls.isSlit; });
    gui.add(controls, 'isHorizontalSlit').onChange(function(){ slitScanHorizonalEffect.enabled = controls.isHorizontalSlit; });

    shadowEffect.enabled = controls.isGray;
    twistEffect.enabled = controls.isTwist;
    convergenceEffect.enabled = controls.isCovergence;
    cutSliderEffect.enabled = controls.isCutSlider;
    noiseEffect.enabled = controls.isNoise;
    slitScanEffect.enabled = controls.isSlit;
    slitScanHorizonalEffect.enabled = controls.isHorizontalSlit;

}

function addCube() {
    var cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), material);
    cube.position.set(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * -500
    );
    cube.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );
    return cube;
}


function animate() {
    cubes.forEach(function(cube, index){
        cube.rotation.y += 0.005 + 0.01 * index/300;
    });

    convergenceEffect.uniforms.uRandom.value = Math.random();
    cutSliderEffect.uniforms.uRandom.value = Math.random();
    twistEffect.uniforms.uTime.value += 1/60;
    twistEffect.uniforms.uRandom.value = Math.random();
    noiseEffect.uniforms.uRandom.value = Math.random();
    slitScanEffect.uniforms.uRandom.value = Math.random();
    slitScanHorizonalEffect.uniforms.uRandom.value = Math.random();

    composer.render();

    raf(animate);
}

init();