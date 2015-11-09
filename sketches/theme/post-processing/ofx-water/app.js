
var raf = require('raf');
var createCaption = require('../../../dom/caption');

var ShaderOdangoSet = require('../../../../src/js/vendors/shader-odango-set/main');
var grayShader = ShaderOdangoSet.gray;
var copyShader = ShaderOdangoSet.copy;
var blurShader = ShaderOdangoSet.blur;
var normalShader = ShaderOdangoSet.normal;
var displacePixelShader = ShaderOdangoSet.displayPixel;

//require('../../../src/js/vendors/shaders/CopyShader')

var scene, camera, renderer;
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;

var loader = new THREE.TextureLoader();
var composer, composer1, composer2, composer3;
var finalComposer;
var object, id;

var isAnimation = true;

var title = 'basic post processing';
var caption = '<p>Shader is implemented by <a href="https://github.com/kenjiSpecial/shader-odango-set">https://github.com/kenjiSpecial/shader-odango-set</a></p>';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/blob/master/sketches/basic/postprocessing/app.js');
wrapper.style.width = (window.innerWidth/2 - 50) + "px";
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

var buffer, backBuffer, frontBuffer;
var rtTexture;


function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 10;

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x000000 );
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);


    frontBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    });

    backBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    });

    rtTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
                                                minFilter: THREE.LinearFilter,
                                                magFilter: THREE.NearestFilter,
                                                format: THREE.RGBAFormat
                                            });

    // load assets
    loader.load('assets/sample3-sq.jpg', function(texture   ){

        var imgWidth = window.innerWidth;//texture.image.width/2;
        var imgHeight = window.innerHeight;//texture.image.height/2;


        var geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
        var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture} );
        plane = new THREE.Mesh( geometry, material );
        scene.add( plane );


        renderer.render(scene, camera, backBuffer);
        renderer.render(scene, camera, buffer);
        //setTimeout(function(){renderer.render(scene, camera, backBuffer)}, 100);

        id = raf(animate);
    });

    /** GUI Controller **/

    var controls = new function () {
        this.isGray = true;
    };

    var gui = new GUI();
    gui.add(controls, 'isGray').onChange(function(){ grayEffect.enabled = controls.isGray;});

    /** composer **/

    /**
    composer = new THREE.EffectComposer( renderer, backBuffer );
    composer.addPass( new THREE.RenderPass( scene, camera ) ) */



    var grayEffect = new THREE.ShaderPass(grayShader);
    grayEffect.renderToScreen = false;

    var blurEffect = new THREE.ShaderPass(blurShader);
    blurEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    var normalEffect = new THREE.ShaderPass(normalShader);
    normalEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    console.log(displacePixelShader);
    var displacePixelEffect= new THREE.ShaderPass(displacePixelShader);
    displacePixelEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    displacePixelEffect.uniforms['backBuffer'].value = backBuffer;
    displacePixelEffect.uniforms['normalTexture'].value =  rtTexture;

    var copyEffect = new THREE.ShaderPass(copyShader);
    copyEffect.renderToScreen = true;

    //composer.addPass(copyEffect);

    composer1 = new THREE.EffectComposer(renderer);
    composer1.addPass( new THREE.RenderPass( scene, camera ));
    composer1.addPass(copyEffect);
    
    composer2 = new THREE.EffectComposer(renderer);
    composer2.addPass( new THREE.RenderPass( scene, camera ) );
    composer2.addPass(grayEffect);
    composer2.addPass(blurEffect);
    composer2.addPass(blurEffect);
    composer2.addPass(blurEffect);
    composer2.addPass(copyEffect);


    composer3 = new THREE.EffectComposer(renderer, rtTexture);
    composer3.addPass( new THREE.RenderPass(scene, camera) );
    composer3.addPass(grayEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(normalEffect);
    composer3.addPass(copyEffect);

    finalComposer = new THREE.EffectComposer(renderer, frontBuffer);
    finalComposer.addPass(displacePixelEffect);
    finalComposer.addPass(copyEffect);




}
var count = 0;
function animate() {
    //renderer.render(scene, camera);
    stats.begin();
    renderer.clear();

    renderer.setViewport(0, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
    composer1.render();

    renderer.setViewport( 0, 0, window.innerWidth/2, window.innerHeight/2);
    composer2.render();

    renderer.setViewport(window.innerWidth/2, window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
    composer3.render();

    renderer.setViewport(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);

    finalComposer.render();

    backBuffer = frontBuffer.clone();

    /**
    var temp = backBuffer;
    backBuffer = buffer;
    buffer = temp; */


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