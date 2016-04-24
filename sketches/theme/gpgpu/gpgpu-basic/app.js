
var raf     = require('raf');
var glslify = require('glslify');
// var test = require('sketches/vendors/desc');
var scene, camera, points;
var buffer, shaderMaterial;
var renderer, light;
var id;
var clock;

var particleNum = 10000;
// console.log(test);
var title = 'GPGPU Basic';
var caption = "";
var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/gpgpu/gpgpu-basic';
var caption = window.ks.createCaption(title, caption, url);

/** -------- **/
/** particle **/
var velocityTexture;
var particleVertices;
// var GPGPUTex = require('./texture');
var PhysicsRenderer = require('./gpuRenderer');
var gpgpuTex;
// var positionVelocity = velocityTexture;
// import PointMesh from "./point/pointMesh";

var pointMesh;
var simulation;

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom  = '30px';
stats.domElement.style.left = '30px';
stats.domElement.style.zIndex= 9999;

document.body.appendChild( stats.domElement );

var loader = new THREE.TextureLoader();

var simulationUniforms = {

    dT:{ type:"f" , value: 0 },
    noiseSize: { type:"f" , value: .1 }

}

var renderUniforms = {

    tPos:{ type:"t" , value: null }

}


var SIZE = 128;

function init(){
    scene = new THREE.Scene();

    var ar = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera( 75, ar , 1, 1000 );
    camera.position.z = 100;


    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    simulation = new PhysicsRenderer({size : SIZE, shader : glslify("./shaders/curl.frag"), renderer: renderer });
    clock = new THREE.Clock();
    var geo = createLookupGeometry( SIZE );

    var mat = new THREE.ShaderMaterial({
        uniforms: renderUniforms,
        vertexShader   : glslify("./shaders/lookup.vert"),
        fragmentShader : glslify("./shaders/lookup.frag"),
        transparent : true,
        depthTest  : false,
        depthWrite : false,
        blending : THREE.AdditiveBlending

    });

    simulation.setUniforms( simulationUniforms );

    var points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    scene.add( points );


    simulation.addBoundTexture( renderUniforms.tPos , 'output' );
    simulation.resetRand( 5 );

    // simulation.addDebugScene(scene);

    id = raf(loop);

}

function createLookupGeometry( size ){

    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(  size * size * 3 );

    for ( var i = 0, j = 0, l = positions.length / 3; i < l; i ++, j += 3 ) {

        positions[ j     ] = ( i % size ) / size;
        positions[ j + 1 ] = Math.floor( i / size ) / size;

    }

    var posAtt = new THREE.BufferAttribute( positions , 3 );
    geo.addAttribute( 'position', posAtt );

    return geo;

}



function loop(){
    stats.update();

    simulationUniforms.dT.value = clock.getDelta();
    simulation.update();
    renderer.render(scene, camera);

    id = raf(loop);
}


init();