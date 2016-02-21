require('../../../../src/js/vendors/controls/OrbitControls');

var raf = require('raf');
var createCaption = require('../../../dom/caption');
import SnowWrapperObject from "./snow-wrapper-object";

var scene, camera, renderer;
var light;
var cubes = [];
var object, id;
var stats, wrapper;
var snowWrapperObject;
var clock;
var controls;

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 600;
    camera.position.x = 400;
    camera.position.y = 200;
    camera.lookAt(new THREE.Vector3());

    renderer = new THREE.WebGLRenderer({alpha: true, antialias : true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    snowWrapperObject = new SnowWrapperObject();
    scene.add(snowWrapperObject);

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    setComponent();

    clock = new THREE.Clock();

    clock.start();
    raf(animate);
}

function setComponent(){
    var title = '';
    var caption = '';
    var url = '';

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
    stats.begin();

    var dt = clock.getDelta();
    var time = clock.getElapsedTime();

    camera.lookAt(new THREE.Vector3);
    snowWrapperObject.update(dt);

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


window.addEventListener('resize', function(ev){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});

init();