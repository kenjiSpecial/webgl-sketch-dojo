
var raf     = require('raf');
var glslify = require('glslify');
var scene, camera, points;
var buffer, shaderMaterial;
var renderer, light;

var particleNum = 10000;

/** -------- **/
/** particle **/
var particleVertices;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;


    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    createBuffer();
}

function createBuffer(){
    buffer = new THREE.BufferGeometry();

    particleVertices = new Float32Array(particleNum * 3); /** vertices **/

    var ii;
    for( ii = 0; ii < particleNum; ii++ ){

    }

}

init();