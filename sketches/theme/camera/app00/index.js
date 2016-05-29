
var raf = require('raf');
var createCaption = require('vendors/caption');

var scene, camera, renderer, mesh;
var plane, mesh;
var cubes = [];
var object, id;
import CamTexture from "vendors/video-texture/webcam"
import OpticalFlowMaterial from "./optical-flow-mat";
var opticalFlowMat;
var camTexture;
var stats, wrapper;
var count = 0;
var isStartRender;

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camTexture = new CamTexture({width: 600, height: 400});
    camTexture.eventDispatcher.addEventListener("textuer:ready", onCamReady);

    opticalFlowMat = new OpticalFlowMaterial({width: 600, height: 400});


    setComponent();

}

function onCamReady(){
    plane = new THREE.PlaneGeometry(600, 400);

    opticalFlowMat.uniforms.uTexture.value = camTexture;
    // opticalFlowMat.uniforms.uPreviousTexture.value = camTexture;



    mesh = new THREE.Mesh(plane, opticalFlowMat);
    scene.add(mesh);

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

    camTexture.updateTexture();

    // if(!opticalFlowMat.uniforms.uPreviousTexture.value){
    //     console.log('??');
    //     opticalFlowMat.uniforms.uPreviousTexture.value = camTexture; //.clone();
    //
    //     opticalFlowMat.uniforms.uPreviousTexture.value.minFilter =  THREE.NearestFilter ;
    //     opticalFlowMat.uniforms.uPreviousTexture.value.magFilter = THREE.NearestFilter;;
    //
    //     opticalFlowMat.uniforms.uPreviousTexture.value.needsUpdate = true;
    // }
    //

    opticalFlowMat.updateShader(camTexture);
    if(isStartRender) renderer.render(scene, camera);



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

window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init()
