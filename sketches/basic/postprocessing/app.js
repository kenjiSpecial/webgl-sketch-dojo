var raf = require('raf');
var createCaption = require('../../dom/caption');

var ShaderOdangoSet = require('../../../src/js/vendors/shader-odango-set/main');
var grayShader = ShaderOdangoSet.gray;
var copyShader = ShaderOdangoSet.copy;

//require('../../../src/js/vendors/shaders/CopyShader')

var scene, camera, renderer;
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;

var loader = new THREE.TextureLoader();
var composer;
var object;


var title = 'basic post processing';
var caption = '<p>Shader is implemented by <a href="https://github.com/kenjiSpecial/shader-odango-set">https://github.com/kenjiSpecial/shader-odango-set</a></p>';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/blob/master/sketches/basic/postprocessing/app.js');
wrapper.style.width = (window.innerWidth/2 - 50) + "px";
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';


function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 10;

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x000000 );
    document.body.appendChild(renderer.domElement);


    // load assets
    loader.load('assets/sample3-sq.jpg', function(texture   ){

        var imgWidth = texture.image.width/3;
        var imgHeight = texture.image.height/3;


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
    gui.add(controls, 'isGray').onChange(function(){ shadowEffect.enabled = controls.isGray;});

    /** composer **/

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    var shadowEffect = new THREE.ShaderPass(grayShader);
    shadowEffect.renderToScreen = false;
    composer.addPass(shadowEffect);


    var copyEffect = new THREE.ShaderPass(copyShader);
    copyEffect.renderToScreen = true;
    composer.addPass(copyEffect);


    raf(animate);
}

function animate() {
    //renderer.render(scene, camera);
    composer.render();

    raf(animate);
}

init();