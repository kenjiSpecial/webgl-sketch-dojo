
var raf     = require('raf');
var glslify = require('glslify');
// var createCaption = require('../../dom/caption');

var scene, camera, renderer;
var object, id;
var stats, wrapper;
var makeCaption = require('vendors/caption');
var SwapRendererTarget = require('vendors/swapRendererTarget');
var swapRendererTarget;
var mesh;
var utils = require('vendors/three-js-utils/utils');
var textureColorMaterial = utils.createRedBlueMaterial(100, 100, window.innerWidth, window.innerHeight);

var isAnimation = true;

var plane, planeMesh, camera;

function init(){
    scene = new THREE.Scene();
    var size = 1;
    camera = new new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
    camera.updateProjectionMatrix();
    var plane = new THREE.PlaneGeometry(1, 1);
    mesh = new THREE.Mesh(plane);
    scene.add(mesh);

    var mat = utils.createRedBlueMaterial( 100, 100, window.innerWidth, window.innerHeight );
    mesh.material = mat;
    
    
    
    swapRendererTarget = new SwapRendererTarget({ width: window.innerWidth, height: window.innerHeight });

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    setComponent();

    raf(animate);
}

function setComponent(){
    var title = 'Boilerplate: Shader';
    var caption = 'Boilerplate Three.js shader app';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/boilerplate/shader';

    makeCaption(title, caption, url);

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

    renderer.render(scene, camera);
    
    

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