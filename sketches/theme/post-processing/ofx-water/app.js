
var raf = require('raf');
var createCaption = require('../../../dom/caption');

var ShaderOdangoSet = require('../../../../src/js/vendors/shader-odango-set/main');
var grayShader = ShaderOdangoSet.gray;
var copyShader = ShaderOdangoSet.copy;
var blurShader = ShaderOdangoSet.blur;
var normalShader = ShaderOdangoSet.normal;
var displacePixelShader = require('./displacePixel/main');

var decayShader = require('./decay/main');
var translationShader = require('./translation/main');

//require('../../../src/js/vendors/shaders/CopyShader')

var scene, camera, renderer;
var material, light;
var plane;

var loader = new THREE.TextureLoader();
var composer, composer1, composer2, composer3;
var translationComposer1, translationComposer2;
var finalComposer;
var object, id;

var isAnimation = true;

var title = 'Water painting from image.';
var caption = '<p>Shaders are imported from <a href="https://github.com/patriciogonzalezvivo/ofxFX">ofxFx</a></p>';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/post-processing/ofx-water');
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '20px';
stats.domElement.style.left = '30px';
stats.domElement.style.zIndex= 9999;
document.body.appendChild( stats.domElement );

var nextTexture;

var backBuffer, frontBuffer;
var targetBuffet, currentBuffer;
var rtTexture;
var displacePixelEffect;
var translationEffect;
var decayEffect, grayEffect, blurEffect, normalEffect;

var totalTime     = 0;
var translateTime = 0;
var startTime;

var count = 0;
var textures = [];

var sWidth = 512;
var sHeight = 512;

var curAssets = 0;

var assets = [
    'assets/sq0.jpg',
    'assets/sq1.jpg',
    'assets/sq2.jpg',
    'assets/sq3.jpg'
];

function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( sWidth / - 2, sWidth / 2, sHeight / 2, sHeight / - 2, 1, 1000 );
    camera.position.z = 10;

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(sWidth , sHeight);
    renderer.setClearColor( 0x000000 );
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = (window.innerWidth - sWidth)/2 + 'px';
    renderer.domElement.style.left = (window.innerHeight - sWidth)/2 + 'px';


    frontBuffer = new THREE.WebGLRenderTarget(sWidth , sHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    });

    backBuffer = new THREE.WebGLRenderTarget(sWidth , sHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    });

    rtTexture = new THREE.WebGLRenderTarget(sWidth , sHeight, {
                                                minFilter: THREE.LinearFilter,
                                                magFilter: THREE.NearestFilter,
                                                format: THREE.RGBAFormat
                                            });

    nextTexture = new THREE.WebGLRenderTarget(sWidth , sHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    });

    // load assets
    /**
    loader.load('assets/sample4-sq.jpg', function(texture) {
        count++;
        textures.type0 = texture;

        loaded();
    }); */

    assets.forEach(function(asset){
        loader.load(asset, function(texture){
            textures.push(texture);
            if(textures.length == assets.length) loaded();
        });
    });

    grayEffect = new THREE.ShaderPass(grayShader);
    grayEffect.renderToScreen = false;


    blurEffect = new THREE.ShaderPass(blurShader);
    blurEffect.uniforms.uWindow.value = new THREE.Vector2(sWidth , sHeight);

    normalEffect = new THREE.ShaderPass(normalShader);
    normalEffect.uniforms.uWindow.value = new THREE.Vector2(sWidth , sHeight);

    displacePixelEffect = new THREE.ShaderPass(displacePixelShader);
    displacePixelEffect.uniforms.uWindow.value = new THREE.Vector2(sWidth , sHeight);
    displacePixelEffect.uniforms['backBuffer'].value = backBuffer;
    displacePixelEffect.uniforms['normalTexture'].value =  rtTexture;
    displacePixelEffect.uniforms['uTime'].value =  totalTime;

    decayEffect = new THREE.ShaderPass(decayShader);
    decayEffect.uniforms['uWindow'].value = new THREE.Vector2(sWidth, sHeight);

    translationEffect = new THREE.ShaderPass(translationShader);
    translationEffect.uniforms['uWindow'].value = new THREE.Vector2(sWidth, sHeight);

    var copyEffect = new THREE.ShaderPass(copyShader);
    copyEffect.renderToScreen = true;

    //composer.addPass(copyEffect);


    composer3 = new THREE.EffectComposer(renderer, rtTexture);
    composer3.addPass( new THREE.RenderPass(scene, camera) );
    composer3.addPass(grayEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(normalEffect);

    finalComposer = new THREE.EffectComposer(renderer, frontBuffer);
    finalComposer.addPass(displacePixelEffect);
    finalComposer.addPass(copyEffect);

    translationComposer1 = new THREE.EffectComposer(renderer);
    translationComposer1.addPass(decayEffect);

    translationComposer2 = new THREE.EffectComposer(renderer);
    translationComposer2.addPass(translationEffect);
    translationComposer2.addPass(copyEffect);

    currentBuffer = backBuffer;
    targetBuffet  = frontBuffer;


}

function loaded(){
    var imgWidth = 512; //texture.image.width/2;
    var imgHeight = 512; //texture.image.height/2;

    var geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
    var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: textures[curAssets] } );
    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );


    renderer.render(scene, camera, backBuffer);
    composer3.render();

    startTime = +new Date;



    id = raf(animate);
    //translateLoop()
}

function reset(){

    composer3 = new THREE.EffectComposer(renderer, rtTexture);
    composer3.addPass( new THREE.RenderPass(scene, camera) );
    composer3.addPass(grayEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(normalEffect);

    currentBuffer = nextTexture;
    targetBuffet  = frontBuffer;

    //renderer.render(scene, camera, backBuffer);
    composer3.render();

    displacePixelEffect.uniforms['uTime'].value =  0;
    displacePixelEffect.uniforms['backBuffer'].value = currentBuffer;
    finalComposer.reset(targetBuffet);

    startTime = +new Date;

    id = raf(animate);
}

function animate() {
    stats.begin();

    totalTime = (+new Date - startTime)/1000;

    finalComposer.render();

    if( currentBuffer == frontBuffer ){
        currentBuffer = backBuffer;
        targetBuffet  = frontBuffer;
    }else{
        currentBuffer = frontBuffer;
        targetBuffet  = backBuffer;
    }

    displacePixelEffect.uniforms['uTime'].value =  totalTime;
    displacePixelEffect.uniforms['backBuffer'].value = currentBuffer;
    finalComposer.reset(targetBuffet);


    stats.end();

    if(totalTime > 4){
        translate();
    }else{
        id = raf(animate);
    }

}

function translate(){
    translateTime = +new Date;

    curAssets = (curAssets + 1) % assets.length;
    plane.material.map = textures[curAssets];

    translationComposer1.reset(targetBuffet);
    decayEffect.uniforms['uTime'].value = 0;
    decayEffect.uniforms['backBuffer'].value = currentBuffer;


    renderer.render( scene, camera, nextTexture );

    translationEffect.uniforms['nextTexture'].value = nextTexture;
    translationEffect.uniforms['oldTexture'].value = currentBuffer;
    translationEffect.uniforms['uTime'].value =  0.0;

    id = raf(translateLoop);
}

function translateLoop(){
    stats.begin();
    translationComposer1.render();
    translationComposer2.render();

    totalTime = (+new Date - translateTime)/1000;


    if( currentBuffer == frontBuffer ){
        currentBuffer = backBuffer;
        targetBuffet  = frontBuffer;
    }else{
        currentBuffer = frontBuffer;
        targetBuffet  = backBuffer;
    }

    decayEffect.uniforms['uTime'].value =  totalTime;
    decayEffect.uniforms['backBuffer'].value = currentBuffer;
    translationComposer1.reset(targetBuffet);

    translationEffect.uniforms['oldTexture'] = currentBuffer;
    translationEffect.uniforms['uTime'].value =  totalTime;

    stats.end();
    if(totalTime > 1.5){
        reset();
    }else{

        id = raf(translateLoop);
    }
}

window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);


        isAnimation = !isAnimation;
    }
});

init();