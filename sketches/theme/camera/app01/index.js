
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
var renderScene, renderCamera, renderMaterial, renderPlane;

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
var opticalFlowMesh;

var testScene = new THREE.Scene();
var testPlane = new THREE.PlaneGeometry(100, 100);
var testMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
var testMesh = new THREE.Mesh(testPlane, testMat);
testScene.add(testMesh);

var appStatus = {
    rendererStatus : 1,
    isScale : true
}

gui.add(appStatus, "rendererStatus", { main : 0, velocity: 1, pressure : 2, density: 3 } );
gui.add(appStatus, 'isScale');

var grayShaderMat = new THREE.ShaderMaterial({
    uniforms : {
        uTexture : {value: null},
        baseCol  : {value: new THREE.Vector3(0.5, 0.5, 0.5)},

    },
    vertexShader   : glslify('./shaders/shader.vert'),
    fragmentShader : glslify('./shaders/gray.frag')
})

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

    renderer = new THREE.WebGLRenderer({alpha: false});
    renderer.autoClear = false;
    renderer.setClearColor ( 0x000000, 1.0 );

    rendererTarget0 = new THREE.WebGLRenderTarget(camWidth, camHeight, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false, debugTest : false});

    solver = new Solver1(grid, renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camTexture = new CamTexture({width: camWidth, height: camHeight});
    camTexture.eventDispatcher.addEventListener("textuer:ready", onCamReady);

    opticalFlowMat = new OpticalFlowMaterial({width: camWidth, height: camHeight});
    // opticalFlowMat.updateBaseColor(new THREE.Vector3(0.5, 0.5, 0.5));


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

    var opDebugMat = new THREE.MeshBasicMaterial();
    opticalFlowMesh = new THREE.Mesh(debugPlane, opDebugMat);
    opticalFlowMesh.position.set( window.innerWidth/2 - camWidth*scale/2 * 3 - 40, -window.innerHeight/2 + camHeight * scale /2 + 30, 0)
    debugScene.add(opticalFlowMesh)


    renderScene = new THREE.Scene();
    renderCamera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -10000, 10000 );
    renderCamera.updateProjectionMatrix();

    renderMaterial = new THREE.ShaderMaterial({
        depthTest : false,
        side : THREE.DoubleSide,
        uniforms : {
            "tDiffuse" : {type: "t", value: null },
            "tDensity" : {type: "t", value: null }
        },
        vertexShader : glslify('./display/shader.vert'),
        fragmentShader : glslify('./display/shader2.frag')
    });

    renderPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight),
        renderMaterial
    );

    renderScene.add(renderPlane);


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
    opticalFlowMesh.material = opticalFlowMat;
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
    solver.step(rendererTarget0.texture, appStatus.isScale);

    appStatus.rendererStatus = parseInt(appStatus.rendererStatus);
    switch (appStatus.rendererStatus) {
        case 0:
            renderMaterial.uniforms.tDiffuse.value = camTexture; //rendererTarget0.texture;
            renderMaterial.uniforms.tDensity.value = solver.density.output;
            renderer.render(renderScene, renderCamera);
            break;
        case 1:
            swapRenderer.changeDebugBaseCol(new THREE.Vector3(0.5, 0.5, 0.5));
            swapRenderer.debugOutput(solver.velocity.output);
            break;
        case 2:
            swapRenderer.changeDebugBaseCol(new THREE.Vector3(0., 0., 0.));
            swapRenderer.debugOutput(solver.pressure.output);
            break;
        case 3:
            swapRenderer.changeDebugBaseCol(new THREE.Vector3(0., 0., 0.));
            swapRenderer.debugOutput(solver.density.output);
            break;
        default:
            break;

    }

    // swapRenderer.changeDebugBaseCol(new THREE.Vector3(0.5, 0.5, 0.5));
    // swapRenderer.debugOutput(solver.velocity.output, mainCamera) ;
    // grayShaderMat.uniforms.uTexture.value = solver.velocity.output
    // swapRenderer.out(grayShaderMat);

    // renderer.render(testScene, mainCamera);
    // renderer.render(debugScene, mainCamera);



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
