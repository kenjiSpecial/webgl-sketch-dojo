
var raf = require('raf');
var createCaption = require('vendors/caption');
var dat = require('dat-gui');
var glslify = require('glslify');
import CamTexture from "vendors/video-texture/webcam";
import OpticalFlowMaterial from "./optical-flow-mat";

var scene, camera, renderer, mesh;
var mainScene, mainCamera;
var debugScene;
var plane, mesh;
var cubes = [];
var object, id;
var clock;

var opticalFlowMat;
var camTexture;
var stats, wrapper;
var count = 0;
var isStartRender;

var isAnimation = true;
var camWidth = 640;
var camHeight = camWidth * 9/16;
var scale = 1/4;

var SwapRenderer = require('vendors/swapRenderer'), swapRenderer;
var velocityRenderer, pressureRenderer;

import Solver1 from './fluid/solver1'
var solver;

var grid = {
    size : new THREE.Vector2(window.innerWidth/2, window.innerHeight/2),
    scale : 1
};

var time = {
    step : 1
};

var rendererTarget0;
var gui = new dat.GUI();
var videoMesh, videoMat;

var videoFiles = {
    "mp4" : "assets/video.mp4",
    "ogv" : "assets/video.ogv"
}

function init(){
    scene = new THREE.Scene();
    debugScene = new THREE.Scene();
    mainScene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( camWidth / - 2, camWidth / 2, camHeight / 2, camHeight / - 2, 1, 10000 );
    camera.updateProjectionMatrix();
    camera.position.z = 1000;

    mainCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
    mainCamera.updateProjectionMatrix();
    mainCamera.position.z = 100;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.autoClear = false;
    renderer.setClearColor ( 0x000000, 1.0 );

    rendererTarget0 = new THREE.WebGLRenderTarget(camWidth, camHeight, {depthBuffer: false});

    solver = new Solver1(grid, renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camTexture = new CamTexture({width: camWidth, height: camHeight});
    camTexture.eventDispatcher.addEventListener("textuer:ready", onCamReady);

    opticalFlowMat = new OpticalFlowMaterial({width: camWidth, height: camHeight});

    swapRenderer = new SwapRenderer({
        shader : glslify('./shaders/advect.frag'),

        width : window.innerWidth,
        height: window.innerHeight,
        uniforms: {
            "target" : { type: "t", value: null },
            "velocity" : { type: "t", value:  solver.velocity.output},
            // "randomTex" : { type: "t", value: velocityRenderer.target },
            "invresolution" : {type : "v2", value: new THREE.Vector2(1/window.innerWidth, 1/window.innerHeight)},
            "resolution" : {type : "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            "aspectRatio" : {type: "f", value:  window.innerWidth/window.innerHeight },
            "dt" : {type : "f", value: 0.0},
            "rdx" : {type: "f", value: 1.0},
            "uWindow"  : { type: "v2", value: null },
            "uMouse"   : { type: "v2", value: null }

        },
        renderer : renderer
    });

    clock = new THREE.Clock();
    clock.start();

    swapRenderer.uniforms.target.value =  swapRenderer.target;
    swapRenderer.uniforms.uWindow.value  = new THREE.Vector2( window.innerWidth, window.innerHeight );
    // swapRenderer.uniforms.uMouse.value   = mouse;


    setComponent();

}

function onCamReady(){
    plane = new THREE.PlaneGeometry(camWidth, camWidth);

    opticalFlowMat.uniforms.uTexture.value = camTexture;
    mesh = new THREE.Mesh(plane, opticalFlowMat);
    scene.add(mesh);


    var debugPlane = new THREE.PlaneGeometry(camWidth * scale, camHeight * scale);
    var debugMat = new THREE.MeshBasicMaterial({map: camTexture});
    var debugMesh = new THREE.Mesh(debugPlane, debugMat);
    debugMesh.position.set( window.innerWidth/2 - camWidth*scale/2 - 30, -window.innerHeight/2 + camHeight * scale /2 + 30, 0)
    debugScene.add(debugMesh)

    raf(animate);
    setTimeout(function(){
        isStartRender = true;
    }, 1000)
}

function setComponent(){
    var title = 'Web Camera Texture';
    var caption = 'optical-flow';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/basic/video-texture';
    createCaption(title, caption, url);

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
    stats.update();
    var dt = clock.getDelta();

    camTexture.updateTexture();

    opticalFlowMat.updateShader(camTexture);
    if(isStartRender) {
        render(dt);
    }



    count++;
    if(count % 3 == 0) {
        var tex = new THREE.Texture(camTexture.image);
        tex.minFilter = THREE.NearestFilter;
        tex.magFilter = THREE.NearestFilter;
        tex.needsUpdate = true;

        opticalFlowMat.uniforms.uPreviousTexture.value = tex;
    }


    id = raf(animate);
}

function render(dt){
    // renderer.clear();


    renderer.render(scene, camera, rendererTarget0, false);
    solver.step(rendererTarget0.texture);

    swapRenderer.changeDebugBaseCol(new THREE.Vector3(0.5, 0.5, 0.5));
    swapRenderer.debugOutput(solver.velocity.output);

    renderer.render(debugScene, mainCamera);

    // solver
}

window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

window.addEventListener('resize', function () {
    mainCamera.left = window.innerWidth/-2;
    mainCamera.right = window.innerWidth/2;
    mainCamera.top = window.innerHeight/2;
    mainCamera.bottom = -window.innerHeight/2;
    mainCamera.updateProjectionMatrix();


    renderer.setSize( window.innerWidth, window.innerHeight );
});

init()
