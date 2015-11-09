
var raf = require('raf');
var createCaption = require('../../../dom/caption');

var ShaderOdangoSet = require('../../../../src/js/vendors/shader-odango-set/main');
var grayShader = ShaderOdangoSet.gray;
var copyShader = ShaderOdangoSet.copy;
var blurShader = ShaderOdangoSet.blur;
var normalShader = ShaderOdangoSet.normal;

//require('../../../src/js/vendors/shaders/CopyShader')

var scene, camera, renderer;
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;

var loader = new THREE.TextureLoader();
var composer, composer1, composer2, composer3;
var object, id;

var isAnimation = true;

var title = 'basic post processing';
var caption = '<p>Shader is implemented by <a href="https://github.com/kenjiSpecial/shader-odango-set">https://github.com/kenjiSpecial/shader-odango-set</a></p>';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/blob/master/sketches/basic/postprocessing/app.js');
wrapper.style.width = (window.innerWidth/2 - 50) + "px";
wrapper.style.position = "absolute";
wrapper.style.top = '50px';
wrapper.style.left = '30px';

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.left = '0px';
stats.domElement.style.zIndex= 9999;
document.body.appendChild( stats.domElement );


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


    // load assets
    loader.load('assets/sample3-sq.jpg', function(texture   ){

        var imgWidth = window.innerWidth;//texture.image.width/2;
        var imgHeight = window.innerHeight;//texture.image.height/2;


        var geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
        var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture} );
        plane = new THREE.Mesh( geometry, material );
        scene.add( plane );

    });

    /** GUI Controller **/

    var controls = new function () {
        this.isGray = true;
    };

    var gui = new GUI();
    gui.add(controls, 'isGray').onChange(function(){ grayEffect.enabled = controls.isGray;});

    /** composer **/

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    var grayEffect = new THREE.ShaderPass(grayShader);
    grayEffect.renderToScreen = false;

    var blurEffect = new THREE.ShaderPass(blurShader);
    blurEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    var normalEffect = new THREE.ShaderPass(normalShader);
    normalEffect.uniforms.uWindow.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

    var copyEffect = new THREE.ShaderPass(copyShader);
    copyEffect.renderToScreen = true;

    composer1 = new THREE.EffectComposer(renderer);
    composer1.addPass( new THREE.RenderPass( scene, camera ));
    composer1.addPass(grayEffect);
    composer1.addPass(copyEffect);
    
    composer2 = new THREE.EffectComposer(renderer);
    composer2.addPass( new THREE.RenderPass( scene, camera ) );
    composer2.addPass(grayEffect);
    composer2.addPass(blurEffect);
    composer2.addPass(blurEffect);
    composer2.addPass(blurEffect);
    composer2.addPass(copyEffect);


    composer3 = new THREE.EffectComposer(renderer);
    composer3.addPass( new THREE.RenderPass(scene, camera) );
    composer3.addPass(grayEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(blurEffect);
    composer3.addPass(normalEffect);
    composer3.addPass(copyEffect);

    id = raf(animate);
}

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