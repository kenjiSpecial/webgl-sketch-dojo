
var raf = require('raf');
var createCaption = require('../../dom/caption');

var scene, camera, renderer, mesh;
var plane, mesh;
var cubes = [];
var object, id;
import CamTexture from "vendors/video-texture/webcam"
var camTexture;
var stats, wrapper;


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

    setComponent();

    raf(animate);
}

function onCamReady(){
    plane = new THREE.PlaneGeometry(600, 400);
    var mat = new THREE.MeshBasicMaterial({map : camTexture, side: THREE.DoubleSide});
    mesh = new THREE.Mesh(plane, mat);
    scene.add(mesh);
}

function setComponent(){
    var title = 'Web Camera Texture';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/basic/video-texture';

    wrapper = createCaption(title, caption, url);
    wrapper.style.width = (window.innerWidth/2 - 50) + "px";
    wrapper.style.position = "absolute";
    wrapper.style.top = '50px';
    wrapper.style.left = '30px';

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
    renderer.render(scene, camera);

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
