
var raf = require('raf');
var getStats = require('../../../lib/stats').getStats;
var glslify = require('glslify');
var stats;

var scene, camera, renderer;
var material;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;
var SwapRenderer = require('./swapRenderer'), swapRenderer;
var GPURenderer = require('./gpuRenderer'), gpuRenderer;
var LookUpMesh = require('./lookUpMesh'), lookUpMesh;
var mesh;

var clock;
var loader = new THREE.TextureLoader();
var SIZE = 128 * 2;

var simulationUniforms = {

    dT:{ type:"f" , value: 0 },
    noiseSize: { type:"f" , value: .1 }

}
var renderUniforms = {
    tVelocity : { type:"t" , value: null }
}

function init(){
    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 10;

    clock = new THREE.Clock();

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000);
    document.body.appendChild(renderer.domElement);
    
    gpuRenderer = new GPURenderer({size : SIZE, shader: glslify("./shaders/curl.frag"), renderer : renderer });
    gpuRenderer.setUniforms({
        dT:{ type:"f" , value: 0 },
        noiseSize: { type:"f" , value: .1 }
    });
    gpuRenderer.addBoundTexture( renderUniforms.tVelocity , 'output' );
    gpuRenderer.resetRand( 5 );

    swapRenderer = new SwapRenderer()

    // gpuRenderer.addDebugScene(scene);

    // console.log(LookUpMesh);
    lookUpMesh = new LookUpMesh({size : SIZE, renderer : renderer, uniforms : renderUniforms });
    scene.add(lookUpMesh);


    
    stats = getStats();

    raf(animate);
}

function animate() {
    renderer.render(scene, camera);

    simulationUniforms.dT.value = clock.getDelta();
    gpuRenderer.update();

    stats.update();

    raf(animate);
}

init();